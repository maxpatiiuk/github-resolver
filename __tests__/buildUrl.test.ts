import { execFileSync } from 'node:child_process';
import { describe, expect, test, vi } from 'vitest';

import { buildUrl } from '../src/buildUrl.js';

describe('buildUrl', () => {
  test('Pull requests page when the branch has no pull request', () =>
    expect(buildUrl({ remote: 'origin', branch: 'main', pr: 'true' })).toBe(
      'https://github.com/specify/specify7/pulls',
    ));

  test('Pull request for the branch', () => {
    vi.mocked(execFileSync).mockReturnValueOnce(
      'https://github.com/specify/specify7/pull/123\n',
    );

    expect(buildUrl({ remote: 'origin', branch: 'feature', pr: 'true' })).toBe(
      'https://github.com/specify/specify7/pull/123',
    );
    expect(execFileSync).toHaveBeenCalledWith(
      'gh',
      [
        'pr',
        'view',
        'feature',
        '--repo',
        'github.com/specify/specify7',
        '--json',
        'url',
        '--jq',
        '.url',
      ],
      { encoding: 'utf8' },
    );
  });

  test('Simple case', () =>
    expect(buildUrl({ remote: 'origin', branch: 'main', file: './' })).toBe(
      'https://github.com/specify/specify7/tree/main/',
    ));

  test('File case', () =>
    expect(
      buildUrl({ remote: 'origin', branch: 'main', file: './Read Me.txt' }),
    ).toBe('https://github.com/specify/specify7/blob/main/Read%20Me.txt'));

  test('SSH remote case', () =>
    expect(
      buildUrl({ remote: 'origin2', branch: '#1234', file: './file.txt' }),
    ).toBe(
      'http://github.example.com/organization/repository/blob/%231234/file.txt',
    ));
});
