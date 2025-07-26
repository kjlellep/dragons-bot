const { safeRequest } = require('../../src/service/client');

describe('safeRequest', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns result on first success', async () => {
    const fn = jest.fn().mockResolvedValue('ok');
    const result = await safeRequest(fn, 'Test Request', 3);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe('ok');
  });

  test('retries up to max retries and returns result on final success', async () => {
    const fn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');

    const result = await safeRequest(fn, 'Retry Test', 3);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(result).toBe('success');
  });

  test('returns null after all retries fail', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('fail'));
    const result = await safeRequest(fn, 'Failing Request', 2);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(result).toBeNull();
  });
});