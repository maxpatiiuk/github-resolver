import path from 'node:path';

import { reverseUrl } from '../reverseUrl';

describe('reverseUrl', () => {
  test('invalid url', () =>
    expect(reverseUrl('https://github.com/')).toBeUndefined());

  test('base url', () =>
    expect(reverseUrl('https://github.example.com/specify/specify7/')).toBe(
      `cd ./ && ls`
    ));

  test('direct directory', () =>
    expect(
      reverseUrl('https://github.example.com/specify/specify7/tree/main/b')
    ).toBe(`cd b && ls`));

  test('nested directory', () =>
    expect(
      reverseUrl(
        'https://github.example.com/specify/specify7/tree/main/b/c',
        path.resolve('a')
      )
    ).toBe(`cd ../b/c && ls`));

  test('file', () =>
    expect(
      reverseUrl(
        'https://github.example.com/specify/specify7/blob/main/b/c.txt',
        path.resolve('a')
      )
    ).toBe(`cd ../b && open c.txt`));
});
