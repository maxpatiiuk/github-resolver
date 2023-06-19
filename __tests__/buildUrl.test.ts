import { buildUrl } from '../buildUrl';

describe('buildUrl', () => {
  test('Simple case', () =>
    expect(buildUrl({ remote: 'origin', branch: 'main', file: './' })).toBe(
      'https://github.com/specify/specify7/blob/main/'
    ));

  test('File case', () =>
    expect(
      buildUrl({ remote: 'origin', branch: 'main', file: './file.txt' })
    ).toBe('https://github.com/specify/specify7/blob/main/file.txt'));

  test('SSH remote case', () =>
    expect(
      buildUrl({ remote: 'origin2', branch: 'main', file: './file.txt' })
    ).toBe(
      'http://github.example.com/organization/repository/blob/main/file.txt'
    ));
});
