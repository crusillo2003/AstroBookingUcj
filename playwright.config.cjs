module.exports = {
  testDir: 'tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  retries: 0,
  use: {
    actionTimeout: 10_000,
    trace: 'on-first-retry',
  },
};
