jest.mock('node:child_process', () => ({
  ...jest.requireActual('node:child_process'),
  execSync: jest.fn((command: string) => {
    const mock = mocks.find(([matcher]) => matcher(command))?.[1];
    if (mock === undefined)
      throw new Error(`Unmocked execSync call: ${command}`);
    return mock;
  }),
}));

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const mocks: RA<
  readonly [matcher: (command: string) => boolean, output: string]
> = [
  [(command) => command.includes('show-current'), 'main'],
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
/* eslint-enable @typescript-eslint/explicit-function-return-type */

export {};
