
const GameState = require('../../src/entity/GameState');

describe('GameState', () => {
  const initialData = {
    gameId: 'abc123',
    lives: 3,
    gold: 150,
    level: 2,
    score: 400,
    highScore: 800,
    turn: 5
  };

  let state;
  beforeEach(() => {
    state = new GameState(initialData);
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('initializes correctly', () => {
    expect(state.gameId).toBe('abc123');
    expect(state.lives).toBe(3);
    expect(state.gold).toBe(150);
    expect(state.level).toBe(2);
    expect(state.score).toBe(400);
    expect(state.highScore).toBe(800);
    expect(state.turn).toBe(5);
    expect(state.peopleReputation).toBeNull();
  });

  test('updateFromQuestResult sets lives, gold, score, and turn', () => {
    state.updateFromQuestResult({ lives: 2, gold: 100, score: 420, turn: 6 });
    expect(state.lives).toBe(2);
    expect(state.gold).toBe(100);
    expect(state.score).toBe(420);
    expect(state.turn).toBe(6);
  });

  test('updateFromShopResult sets lives, gold, level, and turn', () => {
    state.updateFromShopResult({ lives: 4, gold: 90, level: 3, turn: 7 });
    expect(state.lives).toBe(4);
    expect(state.gold).toBe(90);
    expect(state.level).toBe(3);
    expect(state.turn).toBe(7);
  });

  test('updateReputation updates rep fields and increments turn', () => {
    state.updateReputation({ people: 10, state: 15, underworld: 5 });
    expect(state.peopleReputation).toBe(10);
    expect(state.stateReputation).toBe(15);
    expect(state.underworldReputation).toBe(5);
    expect(state.turn).toBe(6);
  });

  test('isAlive returns true if lives > 0, false otherwise', () => {
    expect(state.isAlive()).toBe(true);
    state.lives = 0;
    expect(state.isAlive()).toBe(false);
  });

  test('canAfford returns true if gold >= amount', () => {
    expect(state.canAfford(100)).toBe(true);
    expect(state.canAfford(200)).toBe(false);
  });

  test('logState logs formatted string', () => {
    state.logState();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Turn: 5 | Score: 400 | Gold: 150 | Lives: 3 | Level: 2')
    );
  });

  test('logReputation logs formatted string after update', () => {
    state.updateReputation({ people: 5, state: 3, underworld: 1 });
    state.logReputation();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Reputation  | People: 5 | State: 3 | Underworld: 1')
    );
  });
});
