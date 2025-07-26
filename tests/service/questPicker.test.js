const {
  areAllQuestsHard,
  pickBestQuest,
  canGoShopping,
} = require('../../src/service/questPicker');

const { randomString } = require('../../src/util/util');

describe('questPicker', () => {
  const sampleQuests = [
    { adId: '1', message: randomString(), reward: 40, probability: 'Sure thing', expiresIn: 5 },
    { adId: '2', message: randomString(), reward: 30, probability: 'Piece of cake', expiresIn: 3 },
    { adId: '3', message: randomString(), reward: 50, probability: 'Quite likely', expiresIn: 6 },
    { adId: '4', message: randomString(), reward: 70, probability: 'Gamble', expiresIn: 4 },
  ];

  test('areAllQuestsHard returns true if all quests are risky', () => {
    const hardQuests = [
      { message: randomString(), probability: 'Risky' },
      { message: randomString(), probability: 'Suicide mission' },
    ];
    expect(areAllQuestsHard(hardQuests)).toBe(true);
  });

  test('areAllQuestsHard returns false if at least one quest is easy', () => {
    expect(areAllQuestsHard(sampleQuests)).toBe(false);
  });

  test('pickBestQuest selects quest with best score and excludes traps', () => {
    const trapQuest = {
      adId: 'trap1',
      message: 'Steal super awesome diamond from Lord Trollduke',
      probability: 'Sure thing',
      reward: 300,
      expiresIn: 1
    };

    const best = pickBestQuest([...sampleQuests, trapQuest]);

    expect(best.adId).not.toBe('trap1');
    expect(best).toHaveProperty('adId');
  });

  test('pickBestQuest selects quest with best score and excludes encrypted quests', () => {
    const encryptedQuest = {
      adId: 'encrypted1',
      message: randomString(),
      probability: randomString(),
      reward: 300,
      expiresIn: 1
    };

    const best = pickBestQuest([...sampleQuests, encryptedQuest]);

    expect(best.adId).not.toBe('trap1');
    expect(best).toHaveProperty('adId');
  });


  test('pickBestQuest returns null when all quests are invalid', () => {
    const quests = [
      { 
        message: 'Steal super awesome diamond from the king',
        probability: 'Sure thing',
        reward: 100,
        expiresIn: 1,
        encrypted: null
      },
      {
        message: randomString(),
        probability: randomString(),
        reward: 200,
        expiresIn: 5,
        encrypted: 1
      }
    ];

    const best = pickBestQuest(quests);
    expect(best).toBeNull();
  });

  test('canGoShopping returns true if all valid quests are hard', () => {
    const hardQuests = [
      { message: randomString(), probability: 'Gamble', reward: 30, expiresIn: 2 },
      { message: randomString(), probability: 'Risky', reward: 50, expiresIn: 3 },
    ];
    expect(canGoShopping(hardQuests)).toBe(true);
  });

  test('canGoShopping returns true if easy quests expire late', () => {
    const slowEasy = [
      { message: randomString(), probability: 'Piece of cake', reward: 25, expiresIn: 5 },
      { message: randomString(), probability: 'Walk in the park', reward: 15, expiresIn: 7 },
    ];
    expect(canGoShopping(slowEasy)).toBe(true);
  });

  test('canGoShopping returns false if there are easy quests expiring soon', () => {
    const shortExpiryEasy = [
      { message: randomString(), probability: 'Sure thing', reward: 20, expiresIn: 1 },
    ];
    expect(canGoShopping(shortExpiryEasy)).toBe(false);
  });
});
