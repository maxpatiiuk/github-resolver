import { buildUrl } from '../buildUrl.js';

describe('buildUrl', () => {
  test('Simple case', () =>
    expect(buildUrl({ remote: 'origin', branch: 'main', file: './' })).toBe(
      'https://github.com/specify/specify7/tree/main/'
    ));

  test('File case', () =>
    expect(
      buildUrl({ remote: 'origin', branch: 'main', file: './Read Me.txt' })
    ).toBe('https://github.com/specify/specify7/blob/main/Read%20Me.txt'));

  test('SSH remote case', () =>
    expect(
      buildUrl({ remote: 'origin2', branch: '#1234', file: './file.txt' })
    ).toBe(
      'http://github.example.com/organization/repository/blob/%231234/file.txt'
    ));
});
