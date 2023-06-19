import { execSync } from 'node:child_process';
import path from 'node:path';

import { unique } from './utils.js';

const exec = (command: string): RA<string> =>
  execSync(command).toString().trim().split('\n').filter(Boolean);

export const getGitDirectory = (): string => exec('git rev-parse --git-dir')[0];

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
      .filter((branch) => branch !== 'HEAD')
  );

export const getCurrentBranch = (): string =>
  exec('git branch --show-current')[0];

export const getRemotes = (): RA<string> => exec('git remote');

export const getRemoteUrl = (remote: string): string =>
  exec(`git remote get-url ${remote}`)[0];
