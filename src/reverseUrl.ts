import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';

import { getRootDirectory } from './helpers.js';

const reGitHubUrl =
  /\/(?<organization>[^/]+)\/(?<repository>[^/]+)\/?(?:(?<type>tree|blob)\/(?<branch>[^/]+\/?(?<path>.*)))?/u;

export function reverseUrl(
  partialUrl: string,
  currentPath = process.cwd(),
): string | undefined {
  const url = new URL(partialUrl, 'https://github.com/').pathname;
  const parsed = reGitHubUrl.exec(url)?.groups;
  if (parsed === undefined) return undefined;
  const { path: repositoryPath = '/', type } = parsed;
  const fullPath = path.join(getRootDirectory(), repositoryPath);
  const relativePath = path.relative(currentPath, fullPath) || './';

  const isFile = type === 'blob' && !url.endsWith('/');
  const directory = isFile ? path.dirname(relativePath) : relativePath;

  const output = `cd ${directory} &&`;

  if (isFile) {
    const editor = process.env.EDITOR ?? 'open';
    const fileName = path.basename(relativePath);
    return `${output} ${editor} ${fileName}`;
  } else return `${output} ${process.env.LIST_FILES ?? 'ls'}`;
}
