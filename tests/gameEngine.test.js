jest.mock('../src/service/client');
jest.mock('../src/service/questPicker');
jest.mock('../src/service/shopHelper');
jest.mock('../src/util/util', () => ({ sleep: jest.fn() }));

const {
  startGame,
  getQuests,
  solveQuest,
  runInvestigation
} = require('../src/service/client');
const {
  areAllQuestsHard,
  pickBestQuest,
  canGoShopping
} = require('../src/service/questPicker');
const { tryToShop } = require('../src/service/shopHelper');
const GameState = require('../src/entity/GameState');
const { runGame } = require('../src/gameEngine');

const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('runGame (integration test)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('runs full game loop through shopping, questing, investigation, and game over', async () => {
    const gameStartData = {
      gameId: 'mockGame',
      lives: 3,
      gold: 300,
      level: 1,
      score: 0,
      highScore: 0,
      turn: 0
    };

    startGame.mockResolvedValue(gameStartData);

    getQuests
      .mockResolvedValueOnce([{ adId: 'q1', probability: 'Suicide mission' }])
      .mockResolvedValueOnce([{ adId: 'q2', probability: 'sure thing', reward: 100, expiresIn: 2 }])
      .mockResolvedValueOnce([{ adId: 'q3', probability: 'sure thing', reward: 100, expiresIn: 1 }])
      .mockResolvedValueOnce([{ adId: 'q4', encrypted: 2 }])
      .mockResolvedValueOnce([{ adId: 'q4', encrypted: 2 }])
      .mockResolvedValueOnce([{ adId: 'q5', probability: 'walk in the park', reward: 100, expiresIn: 3 }]);

    areAllQuestsHard
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false);

    pickBestQuest
      .mockReturnValueOnce({ adId: 'q2' })
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({ adId: 'q5' });

    solveQuest
      .mockResolvedValueOnce({ lives: 3, gold: 350, score: 100, turn: 2 })
      .mockResolvedValueOnce({ lives: 0, gold: 400, score: 200, turn: 4 });

    canGoShopping
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    tryToShop
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    runInvestigation.mockResolvedValue({ people: 2, state: 3, underworld: 1 });

    await runGame();

    expect(startGame).toHaveBeenCalled();
    expect(tryToShop).toHaveBeenCalledTimes(2);
    expect(solveQuest).toHaveBeenCalledTimes(2);
    expect(runInvestigation).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Game Over — Final Score: 200')
    );
  });

  test('fails to start game', async () => {

    startGame.mockResolvedValue(null);

    await runGame();

    expect(startGame).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to start game. Check API availability.')
    );
  });

  test('exits after max skipped turns due to repeated getQuests failures', async () => {
    const gameStartData = {
      gameId: 'mockGame',
      lives: 3,
      gold: 300,
      level: 1,
      score: 0,
      highScore: 0,
      turn: 0
    };

    startGame.mockResolvedValue(gameStartData);
    getQuests
      .mockResolvedValueOnce([{ adId: 'q1', encrypted: 2 }])
      .mockResolvedValue(null);

    await runGame();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to fetch quests. Skipping turn.')
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to fetch quests (post-quest). Skipping turn.')
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Exiting game due to 5 consecutive skipped turns.')
    );
  });
});
