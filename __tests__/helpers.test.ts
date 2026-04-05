import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  getBranches,
  getCurrentBranch,
  getGitDirectory,
  getRemotes,
  getRemoteUrl,
  getRootDirectory,
} from '../src/helpers.js';
import { execSync } from 'node:child_process';

const withTemporaryDirectory = (
  callback: (directory: string) => void,
): void => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'github-resolver-'));

  try {
    callback(directory);
  } finally {
    fs.rmSync(directory, { force: true, recursive: true });
  }
};

test('getGitDirectory', () =>
  expect(getGitDirectory()).toBe(`${process.cwd()}/.git`));

test('getGitDirectory finds nearest parent .git directory', () => {
  withTemporaryDirectory((directory) => {
    const repositoryRoot = path.join(directory, 'repository');
    const nestedDirectory = path.join(repositoryRoot, 'src', 'nested');
    const gitDirectory = path.join(repositoryRoot, '.git');

    fs.mkdirSync(gitDirectory, { recursive: true });
    fs.mkdirSync(nestedDirectory, { recursive: true });

    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(nestedDirectory);

    try {
      expect(getGitDirectory()).toBe(gitDirectory);
      expect(getRootDirectory()).toBe(repositoryRoot);
    } finally {
      cwdSpy.mockRestore();
    }
  });
});

test('getGitDirectory handles worktree .git file', () => {
  withTemporaryDirectory((directory) => {
    const worktreeRoot = path.join(directory, 'worktree');
    const nestedDirectory = path.join(worktreeRoot, 'packages', 'app');
    const gitFile = path.join(worktreeRoot, '.git');

    fs.mkdirSync(nestedDirectory, { recursive: true });
    fs.writeFileSync(gitFile, 'gitdir: /tmp/main/.git/worktrees/app\n');

    const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValue(nestedDirectory);

    try {
      expect(getGitDirectory()).toBe(gitFile);
      expect(getRootDirectory()).toBe(worktreeRoot);
    } finally {
      cwdSpy.mockRestore();
    }
  });
});

test('getRootDirectory', () => expect(getRootDirectory()).toBe(process.cwd()));

test('getBranches', () =>
  expect(getBranches()).toEqual(['main', 'pass', 'pass2']));

test('getCurrentBranch falls back to local branch', () =>
  expect(getCurrentBranch()).toBe('main'));

test('getCurrentBranch prefers tracked remote branch name', () => {
  const execSyncMock = jest.mocked(execSync);
  execSyncMock
    .mockImplementationOnce(() => 'feature/local')
    .mockImplementationOnce(() => 'origin/feature/remote');

  expect(getCurrentBranch()).toBe('feature/remote');
});

test('getRemotes', () => expect(getRemotes()).toEqual(['origin', 'origin2']));

describe('getRemoteUrl', () => {
  test('URL', () =>
    expect(getRemoteUrl('origin')).toBe('https://github.com/specify/specify7'));

  test('SSH URL', () =>
    expect(getRemoteUrl('origin2')).toBe(
      'git@github.example.com:organization/repository.git',
    ));
});
