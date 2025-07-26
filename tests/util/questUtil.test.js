const {
  filterValidQuests,
  probabilityScore
} = require('../../src/util/questUtil');

describe('questUtils', () => {
  describe('probabilityScore', () => {
    it('returns correct score for known labels', () => {
      expect(probabilityScore('Sure thing')).toBe(10);
      expect(probabilityScore('piece of cake')).toBe(8);
      expect(probabilityScore('Quite likely')).toBe(4);
      expect(probabilityScore('Hmmm....')).toBe(2);
      expect(probabilityScore('Gamble')).toBe(1);
      expect(probabilityScore('Suicide mission')).toBe(-1);
    });

    it('returns -1 for unknown labels', () => {
      expect(probabilityScore('unknown')).toBe(-1);
    });
  });

  describe('filterValidQuests', () => {
    it('filters out trap quests and encrypted ones', () => {
      const quests = [
        { message: 'Steal super awesome diamond ring', encrypted: null },
        { message: 'Find a potion', encrypted: null },
        { message: 'Protect caravan', encrypted: 1 }
      ];

      const result = filterValidQuests(quests);
      expect(result.length).toBe(1);
      expect(result[0].message).toBe('Find a potion');
    });
  });
});
