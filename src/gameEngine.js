const {
  startGame,
  getQuests,
  solveQuest,
  runInvestigation,
} = require('./service/client');
const { areAllQuestsHard, pickBestQuest, canGoShopping } = require('./service/questPicker');
const { tryToShop } = require('./service/shopHelper');
const { sleep } = require('./util/util');
const GameState = require('./entity/GameState');

const MAX_SKIPPED_TURNS = 5;

async function runGame() {
  try {
    const game = await startGame();

    if (game == null) {
      console.log('Failed to start game. Check API availability.');
      return;
    }

    const gameState = new GameState(game);
    let skippedTurns = 0;

    while (gameState.isAlive()) {
      if (skippedTurns >= MAX_SKIPPED_TURNS) {
        console.log(`Exiting game due to ${skippedTurns} consecutive skipped turns.`);
        break;
      }

      let quests = await getQuests(gameState.gameId);
      if (!quests) {
        console.log('Failed to fetch quests. Skipping turn.');
        skippedTurns++;
        await sleep(200);
        continue;
      }

      if (areAllQuestsHard(quests) && gameState.gold >= 100) {
        const shopped = await tryToShop(gameState, quests);
        if (shopped) continue;
      }

      const quest = pickBestQuest(quests);
      if (quest) {
        const result = await solveQuest(gameState.gameId, quest.adId);
        if (result) {
          gameState.updateFromQuestResult(result);
          gameState.logState();
        }
      }

      if (!gameState.isAlive()) break;

      quests = await getQuests(gameState.gameId);
      if (!quests) {
        console.log('Failed to fetch quests (post-quest). Skipping turn.');
        skippedTurns++;
        await sleep(200);
        continue;
      }

      let shopped = false;
      if (canGoShopping(quests) || gameState.lives < 2) {
        shopped = await tryToShop(gameState, quests);
      }

      if (!quest && !shopped) {
        const reputation = await runInvestigation(gameState.gameId);
        if (reputation) {
          gameState.updateReputation(reputation);
          gameState.logReputation();
        }
      }

      skippedTurns = 0;
      await sleep(200);
    }

    console.log(`\n Game Over — Final Score: ${gameState.score}`);
  } catch (err) {
    console.error('Unexpected error during game loop:', err.message);
  }
}

module.exports = { runGame };
