const HEALING_IDS = ['hpot'];
const BOOSTER_100_IDS = ['cs', 'gas', 'wax', 'tricks', 'wingpot'];
const BOOSTER_300_IDS = ['ch', 'rf', 'iron', 'mtrix', 'wingpotmax'];

const { getShopItems, buyItem } = require('./client');

function isValidItem(item, validIds, cost) {
  return validIds.includes(item.id) && item.cost === cost;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function pickBestItem(items, lives, gold) {
  const healingItem = items.find(item =>
    isValidItem(item, HEALING_IDS, 50)
  );

  const cheapBoosters = items.filter(item =>
    isValidItem(item, BOOSTER_100_IDS, 100)
  );

  const expensiveBoosters = items.filter(item =>
    isValidItem(item, BOOSTER_300_IDS, 300)
  );

  if (lives < 4 && gold >= 50 && healingItem) {
    return healingItem;
  }

  if (gold >= 350 && expensiveBoosters.length > 0) {
    return getRandomItem(expensiveBoosters);
  }
  
  if (gold >= 150 && cheapBoosters.length > 0) {
    return getRandomItem(cheapBoosters);
  }
  
  return null;
}

async function tryToShop(gameState, quests = null) {
  if (gameState.gold >= 50 && gameState.lives < 2) {
    const purchase = await buyItem(gameState.gameId, HEALING_IDS[0]);
    if (purchase) {
      gameState.updateFromShopResult(purchase);
      gameState.logState();
      return true;
    }
  }

  if (quests && gameState.gold >= 100 && gameState.lives >= 2) {
    const items = await getShopItems(gameState.gameId);
    const item = pickBestItem(items, gameState.lives, gameState.gold);
    if (item) {
      const purchase = await buyItem(gameState.gameId, item.id);
      if (purchase) {
        gameState.updateFromShopResult(purchase);
        gameState.logState();
        return true;
      }
    }
  }

  return false;
}

module.exports = { tryToShop, pickBestItem };