const { randomString } = require('../../src/util/util');

describe('randomString', () => {
  it('returns a string that starts with the default prefix', () => {
    const id = randomString();
    expect(id).toMatch(/^id_/);
    expect(typeof id).toBe('string');
  });

  it('returns different values on consecutive calls', () => {
    const a = randomString();
    const b = randomString();
    expect(a).not.toBe(b);
  });

  it('respects custom prefix', () => {
    const id = randomString('test_');
    expect(id).toMatch(/^test_/);
  });
});
