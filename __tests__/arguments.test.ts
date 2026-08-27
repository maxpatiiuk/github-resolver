import { describe, expect, test, vi } from 'vitest';

import type { Arguments } from '../src/arguments.js';
import { parseArguments } from '../src/arguments.js';

const runs: IR<Arguments & { readonly warning?: string }> = {
  '': {
    branch: 'main',
    dry: 'false',
    file: './',
    pr: 'false',
    remote: 'origin',
    url: undefined,
  },
  'file.txt': {
    branch: 'main',
    dry: 'false',
    file: 'file.txt',
    pr: 'false',
    remote: 'origin',
    url: undefined,
  },
  '--file=file.txt main2 --dry': {
    branch: 'main2',
    dry: 'true',
    file: 'file.txt',
    pr: 'false',
    remote: 'origin',
    url: undefined,
  },
  '-----file file2.txt main2': {
    branch: 'main2',
    dry: 'false',
    file: 'file2.txt',
    pr: 'false',
    remote: 'origin',
    url: undefined,
  },
  '-fdir/file.txt --dry=true -bp.': {
    branch: 'pass',
    dry: 'true',
    file: 'dir/file.txt',
    pr: 'false',
    remote: 'origin',
    url: undefined,
    warning: 'More than one branch matched the pattern: pass, pass2',
  },
  'dir/file.txt origin2 -branch    pass2': {
    branch: 'pass2',
    dry: 'false',
    file: 'dir/file.txt',
    pr: 'false',
    remote: 'origin2',
    url: undefined,
  },
  '--pr': {
    branch: 'main',
    dry: 'false',
    file: './',
    pr: 'true',
    remote: 'origin',
    url: undefined,
  },
  'https://github.com/example/example/example': {
    branch: 'main',
    dry: 'false',
    file: './',
    pr: 'false',
    remote: 'origin',
    url: 'https://github.com/example/example/example',
  },
  '--dry github.com/example/example/example': {
    branch: 'main',
    dry: 'true',
    file: './',
    pr: 'false',
    remote: 'origin',
    url: 'github.com/example/example/example',
  },
  'www.github.com/example/example/example': {
    branch: 'main',
    dry: 'false',
    file: './',
    pr: 'false',
    remote: 'origin',
    url: 'www.github.com/example/example/example',
  },
  'www.github.example.com/example/example/example': {
    branch: 'main',
    dry: 'false',
    file: './',
    pr: 'false',
    remote: 'origin',
    url: 'www.github.example.com/example/example/example',
  },
};

describe('parseArguments', () => {
  Object.entries(runs).forEach(([args, { warning = '', ...result }]) =>
    test(args || 'empty case', () => {
      const warnings: WritableArray<unknown> = [];
      const consoleWarn = vi.fn((...args) => warnings.push(args[0]));
      vi.spyOn(console, 'warn').mockImplementation(consoleWarn);

      expect(parseArguments(args.split(' ').filter(Boolean))).toEqual(result);

      expect(warnings).toEqual([warning].filter(Boolean));
    }),
  );
});
