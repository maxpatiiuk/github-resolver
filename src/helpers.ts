import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

import { unique } from './utils.js';

const exec = (command: string): RA<string> =>
  execSync(command).toString().trim().split('\n').filter(Boolean);

const removeRemoteName = (branch: string): string =>
  branch.split('/').slice(1).join('/') || branch;

export const getGitDirectory = (): string => {
  let currentDirectory = process.cwd();

  while (true) {
    const gitPath = path.join(currentDirectory, '.git');
    if (existsSync(gitPath)) return gitPath;

    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory === currentDirectory) break;
    currentDirectory = parentDirectory;
  }

  throw Error('Not in a git repository');
};

export const getRootDirectory = (): string => path.dirname(getGitDirectory());

export const getBranches = (): RA<string> =>
  unique(
    exec('git branch --list --no-color --no-column --all')
      .map((branch) => branch.split(' -> ')[0].trim())
      .map((branch) => (branch.startsWith('* ') ? branch.slice(2) : branch))
      .map((branch) => {
        const split = branch.split('/');
        return split[0] === 'remotes' ? split.slice(2).join('/') : branch;
      })
      .filter((branch) => branch !== 'HEAD'),
  );

export const getCurrentBranch = (): string => {
  const localBranch = exec('git branch --show-current')[0];
  const upstreamBranch = exec(
    `git for-each-ref --format='%(upstream:short)' refs/heads/${localBranch}`,
  )[0];

  return typeof upstreamBranch === 'string'
    ? removeRemoteName(upstreamBranch)
    : localBranch;
};

export const getRemotes = (): RA<string> => exec('git remote');

export const getDefaultRemote = (branch?: string): string | undefined => {
  const remotes = getRemotes();
  if (remotes.length <= 1) return remotes[0];

  const localBranch = branch ?? exec('git branch --show-current')[0];
  const upstreamRemote =
    localBranch === undefined
      ? undefined
      : exec(
          `git for-each-ref --format='%(upstream:remotename)' refs/heads/${localBranch}`,
        )[0];

  if (
    upstreamRemote !== undefined &&
    upstreamRemote !== '.' &&
    remotes.includes(upstreamRemote)
  )
    return upstreamRemote;

  return remotes.includes('origin') ? 'origin' : remotes[0];
};

export const getRemoteUrl = (remote: string): string =>
  exec(`git remote get-url ${remote}`)[0];
