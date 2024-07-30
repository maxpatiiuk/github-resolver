import fs from 'node:fs';

import { getBranches, getCurrentBranch, getRemotes } from './helpers.js';
import { basename, dirname, join } from 'node:path';

const booleanDefinitions = ['dry'];
const valuedDefinitions = [
  'file',
  'branch',
  'remote',
  'url',
  ...booleanDefinitions,
];
type Argument = ItemOf<typeof valuedDefinitions>;
type MutableArguments = Record<Argument, string | undefined>;
export type Arguments = Readonly<MutableArguments>;

/**
 * Very forgiving and flexible argument parsing
 * Allows for `--file=path -branch branch -remote remoteName -f path --f=path`
 * Or even: `file branch remoteName` in any order and it will automatically try
 * to figure out which argument is what)
 */
export function parseArguments(args = process.argv.slice(2)): Arguments {
  const values: MutableArguments = Object.fromEntries(
    valuedDefinitions.map((key) => [key, undefined]),
  );
  const unresolved: WritableArray<string> = [];
  let pendingArgument: Argument | undefined = undefined;
  args.forEach((argument) => {
    if (argument.startsWith('-')) {
      if (
        typeof pendingArgument === 'string' &&
        booleanDefinitions.includes(pendingArgument)
      )
        values[pendingArgument] = 'true';

      const parsed = argument.replaceAll(/^-+/gmu, '');
      const resolved = resolve(parsed);

      if (typeof resolved === 'string') {
        if (booleanDefinitions.includes(resolved)) values[resolved] = 'true';
        else pendingArgument = resolved;
        return;
      }

      const [name, ...parts] = parsed.split('=');
      const nameArgument = resolve(name);
      if (typeof nameArgument === 'string') {
        values[nameArgument] = parts.join('=').trim();
        return;
      }

      const shortArgument = resolve(parsed[0]);
      if (typeof shortArgument === 'string') {
        values[shortArgument] = parsed.slice(1).trim();
        return;
      }

      console.warn(`Unknown argument: ${argument}`);
    } else if (typeof pendingArgument === 'string') {
      values[pendingArgument] = argument.trim();
      pendingArgument = undefined;
    } else unresolved.push(argument.trim());
  });

  if (typeof pendingArgument === 'string')
    console.warn(`Argument without value: ${pendingArgument}`);

  const parsed = applyDefaults(unresolved.reduce(resolveArgument, values));
  return {
    ...parsed,
    branch: resolveBranch(parsed.branch),
  };
}

const resolve = (value: string): Argument | undefined =>
  valuedDefinitions.find((known) => known.startsWith(value));

/**
 * Support resolving arguments even argument name is not explicitly provided
 */
function resolveArgument(args: Arguments, unresolved: string): Arguments {
  const lower = unresolved.toLowerCase();

  // Check if argument is a url
  if (
    args.url === undefined &&
    ['https://', 'http://', 'www.', 'github.com'].some((part) =>
      lower.startsWith(part),
    )
  )
    return { ...args, url: unresolved };

  // Check if arguments matches a file that exists
  if (args.file === undefined && fs.existsSync(unresolved))
    return { ...args, file: unresolved };

  /*
   * If given a path to a file without extension, try to auto-complete it. This
   * can happen if directory contains multiple files with the same extension
   * (i.e .tsx and .css). In that case, auto-complete in shell may leave out
   * part of the file name
   */
  if (args.file === undefined && fs.existsSync(dirname(unresolved))) {
    const dir = dirname(unresolved);
    const base = basename(unresolved);
    const files = fs.readdirSync(dir);
    const filtered = files.filter((file) => file.startsWith(base));
    const withPriorities = filtered.map((file) => {
      const extension = file.split('.').pop();
      const priority =
        (extension ? fileExtensionPriorities.indexOf(extension) : undefined) ??
        Number.POSITIVE_INFINITY;
      return [file, priority] as const;
    });
    const sorted = withPriorities
      .sort((a, b) => b[1] - a[1])
      .map(([file]) => file);
    if (sorted[0]) return { ...args, file: join(dir,sorted[0]) };
  }

  // Check if argument matches a branch
  if (args.branch === undefined) {
    const branches = getBranches();
    const branch = branches.find((branch) => branch.toLowerCase() === lower);
    if (typeof branch === 'string') return { ...args, branch };
    // See resolveBranch()
    else if (unresolved.endsWith('.')) return { ...args, branch: unresolved };
  }

  // Check if argument matches a remote
  if (args.remote === undefined) {
    const remotes = getRemotes();
    const remote = remotes.find((remote) => remote.toLowerCase() === lower);
    if (typeof remote === 'string') return { ...args, remote };
  }

  // Assume it's just a file that doesn't exist locally
  if (args.file === undefined && unresolved.includes('.'))
    return { ...args, file: unresolved };

  // If not found branch yet, assume this is branch name
  if (args.branch === undefined) return { ...args, branch: unresolved };

  console.warn(
    `Unrecognized argument: ${unresolved}. Please explicitly specify argument name`,
  );

  return args;
}

/** Apply default arguments */
const applyDefaults = (parsed: Arguments): Arguments => ({
  ...parsed,
  remote: parsed.remote ?? getRemotes()[0],
  branch: parsed.branch ?? getCurrentBranch(),
  file: parsed.file ?? './',
  dry: parsed.dry ?? 'false',
});

/**
 * Could end branch name with "." or start it with "." and let the system
 * automatically resolve the rest
 */
function resolveBranch(branch: string | undefined): string | undefined {
  if (
    branch === undefined ||
    (!branch.startsWith('.') && !branch.endsWith('.'))
  )
    return branch;
  const branches = getBranches();
  const matches = branches.filter(
    (possibleBranch) =>
      (branch.startsWith('.') && possibleBranch.endsWith(branch.slice(1))) ||
      (branch.endsWith('.') && possibleBranch.startsWith(branch.slice(0, -1))),
  );

  if (matches.length > 1)
    console.warn(
      `More than one branch matched the pattern: ${matches.join(', ')}`,
    );

  return matches[0] ?? branch;
}

/**
 * If there are multiple files by the same name that match the given extension,
 * use the file extension to find the "most interesting" file
 */
const fileExtensionPriorities = [
  'tsx',
  'ts',
  'mts',
  'cts',
  'md',
  'json',
  'csv',
  'tsv',
  'xml',
  'yaml',
  'yml',
  'html',
  'css',
  'py',
  'sh',
  'txt',
  'mjs',
  'cjs',
  'jsx',
  /*
   * In some projects, transpiled .ts files are output into same directory as
   * .js files. That is why these should be far lower priority than .ts
   */
  'js',
];
