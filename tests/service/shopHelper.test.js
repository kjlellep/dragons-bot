const { pickBestItem, tryToShop } = require('../../src/service/shopHelper');

const HEALING_IDS = ['hpot'];

jest.mock('../../src/service/client', () => ({
  getShopItems: jest.fn(),
  buyItem: jest.fn()
}));

const { getShopItems, buyItem } = require('../../src/service/client');

function mockGameState({ lives, gold }) {
  return {
    gameId: 'game123',
    lives,
    gold,
    updateFromShopResult: jest.fn(),
    logState: jest.fn()
  };
}

describe('pickBestItem', () => {
  const sampleItems = [
    { id: 'hpot', cost: 50 },
    { id: 'cs', cost: 100 },
    { id: 'rf', cost: 300 }
  ];

  test('returns healing item when lives are low and gold is enough', () => {
    const item = pickBestItem(sampleItems, 1, 100);
    expect(item).toEqual({ id: 'hpot', cost: 50 });
  });

  test('returns a random expensive booster when lives are sufficient and gold is 350+', () => {
    const chosen = new Set();
    for (let i = 0; i < 10; i++) {
      const item = pickBestItem(sampleItems, 4, 500);
      if (item) chosen.add(item.id);
    }
    expect([...chosen]).toEqual(expect.arrayContaining(['rf']));
  });

  test('returns a random cheap booster when lives are sufficient and gold is 150+', () => {
    const cheapItems = [
      { id: 'cs', cost: 100 },
      { id: 'wax', cost: 100 }
    ];
    const chosen = new Set();
    for (let i = 0; i < 10; i++) {
      const item = pickBestItem(cheapItems, 4, 200);
      if (item) chosen.add(item.id);
    }
    expect([...chosen]).toEqual(expect.arrayContaining(['cs', 'wax']));
  });

  test('returns null if no suitable item found', () => {
    const noValidItems = [
      { id: 'foo', cost: 70 },
      { id: 'bar', cost: 999 }
    ];
    const item = pickBestItem(noValidItems, 4, 300);
    expect(item).toBeNull();
  });
});

describe('tryToShop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('buys healing potion when lives are low', async () => {
    const gameState = mockGameState({ lives: 1, gold: 100 });
    buyItem.mockResolvedValue({ lives: 1, gold: 50, level: 1 });

    const result = await tryToShop(gameState);

    expect(buyItem).toHaveBeenCalledWith(gameState.gameId, HEALING_IDS[0]);
    expect(gameState.updateFromShopResult).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test('buys booster when lives are fine and quests are present', async () => {
    const gameState = mockGameState({ lives: 4, gold: 300 });
    const shopItem = { id: 'cs', cost: 100 };

    getShopItems.mockResolvedValue([shopItem]);
    buyItem.mockResolvedValue({ lives: 4, gold: 200, level: 2 });

    const result = await tryToShop(gameState, [{}]);

    expect(getShopItems).toHaveBeenCalledWith(gameState.gameId);
    expect(buyItem).toHaveBeenCalledWith(gameState.gameId, shopItem.id);
    expect(gameState.updateFromShopResult).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test('returns false when no purchase is made', async () => {
    const gameState = mockGameState({ lives: 4, gold: 20 });
    const result = await tryToShop(gameState);

    expect(result).toBe(false);
    expect(buyItem).not.toHaveBeenCalled();
  });

  test('returns false if shop item is picked but purchase fails', async () => {
    const gameState = mockGameState({ lives: 4, gold: 300 });
    getShopItems.mockResolvedValue([{ id: 'cs', cost: 100 }]);
    buyItem.mockResolvedValue(null);

    const result = await tryToShop(gameState, [{}]);

    expect(result).toBe(false);
    expect(buyItem).toHaveBeenCalled();
  });
});
