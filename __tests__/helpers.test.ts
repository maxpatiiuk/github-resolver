import {
  getBranches,
  getCurrentBranch,
  getGitDirectory,
  getRemotes,
  getRemoteUrl,
  getRootDirectory,
} from '../helpers.js';

test('getGitDirectory', () =>
  expect(getGitDirectory()).toBe(`${process.cwd()}/.git`));

test('getRootDirectory', () => expect(getRootDirectory()).toBe(process.cwd()));

test('getBranches', () =>
  expect(getBranches()).toEqual(['main', 'pass', 'pass2']));

test('getCurrentBranch', () => expect(getCurrentBranch()).toBe('main'));

test('getRemotes', () => expect(getRemotes()).toEqual(['origin', 'origin2']));

describe('getRemoteUrl', () => {
  test('URL', () =>
    expect(getRemoteUrl('origin')).toBe('https://github.com/specify/specify7'));

  test('SSH URL', () =>
    expect(getRemoteUrl('origin2')).toBe(
      'git@github.example.com:organization/repository.git'
    ));
});
