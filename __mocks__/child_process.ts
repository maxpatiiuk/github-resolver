import { vi } from 'vitest';

vi.mock('node:child_process', async () => ({
  ...(await vi.importActual('node:child_process')),
  execFileSync: vi.fn(() => {
    throw new Error('gh command failed');
  }),
  execSync: vi.fn((command: string) => {
    const mock = mocks.find(([matcher]) => matcher(command))?.[1];
    if (mock === undefined)
      throw new Error(`Unmocked execSync call: ${command}`);
    return mock;
  }),
}));

const mocks: RA<
  readonly [matcher: (command: string) => boolean, output: string]
> = [
  [(command) => command.includes('show-current'), 'main'],
  [(command) => command.includes('for-each-ref'), ''],
  [
    (command) => command.includes('branch'),
    '* main\n  remotes/origin/pass -> pass\npass2\npass2',
  ],
  [(command) => command.includes('rev-parse'), `${process.cwd()}/.git`],
  [(command) => command.endsWith('remote'), 'origin\norigin2'],
  [
    (command) => command.includes('origin2'),
    'git@github.example.com:organization/repository.git',
  ],
  [
    (command) => command.includes('origin'),
    'https://github.com/specify/specify7',
  ],
];
