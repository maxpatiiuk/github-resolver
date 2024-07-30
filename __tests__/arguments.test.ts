import type { Arguments } from '../src/arguments.js';
import { parseArguments } from '../src/arguments.js';

const runs: IR<Arguments & { readonly warning?: string }> = {
  '': {
    branch: 'main',
    dry: 'false',
    file: './',
    remote: 'origin',
    url: undefined,
  },
  'file.txt': {
    branch: 'main',
    dry: 'false',
    file: 'file.txt',
    remote: 'origin',
    url: undefined,
  },
  '--file=file.txt main2 --dry': {
    branch: 'main2',
    dry: 'true',
    file: 'file.txt',
    remote: 'origin',
    url: undefined,
  },
  '-----file file2.txt main2': {
    branch: 'main2',
    dry: 'false',
    file: 'file2.txt',
    remote: 'origin',
    url: undefined,
  },
  '-fdir/file.txt --dry=true -bp.': {
    branch: 'pass',
    dry: 'true',
    file: 'dir/file.txt',
    remote: 'origin',
    url: undefined,
    warning: 'More than one branch matched the pattern: pass, pass2',
  },
  'dir/file.txt origin2 -branch    pass2': {
    branch: 'pass2',
    dry: 'false',
    file: 'dir/file.txt',
    remote: 'origin2',
    url: undefined,
  },
  'https://github.com/example/example/example': {
    branch: 'main',
    dry: 'false',
    file: './',
    remote: 'origin',
    url: 'https://github.com/example/example/example',
  },
  '--dry github.com/example/example/example': {
    branch: 'main',
    dry: 'true',
    file: './',
    remote: 'origin',
    url: 'github.com/example/example/example',
  },
  'www.github.com/example/example/example': {
    branch: 'main',
    dry: 'false',
    file: './',
    remote: 'origin',
    url: 'www.github.com/example/example/example',
  },
  'www.github.example.com/example/example/example': {
    branch: 'main',
    dry: 'false',
    file: './',
    remote: 'origin',
    url: 'www.github.example.com/example/example/example',
  },
};

describe('parseArguments', () => {
  Object.entries(runs).forEach(([args, { warning = '', ...result }]) =>
    test(args || 'empty case', () => {
      const warnings: WritableArray<unknown> = [];
      const consoleWarn = jest.fn((...args) => warnings.push(args[0]));
      jest.spyOn(console, 'warn').mockImplementation(consoleWarn);

      expect(parseArguments(args.split(' ').filter(Boolean))).toEqual(result);

      expect(warnings).toEqual([warning].filter(Boolean));
    }),
  );
});
