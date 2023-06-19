jest.mock('node:process', () => {
  const actual = jest.requireActual('node:process');
  return {
    ...actual,
    env: {
      ...actual.env,
      LIST_FILES: 'ls',
      EDITOR: 'open',
    },
  };
});

export {};
