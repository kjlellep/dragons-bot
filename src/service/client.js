const axios = require('axios');

const API = 'https://dragonsofmugloar.com/api/v2';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 300;

async function safeRequest(fn, description = 'Request', retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (err) {
      console.error(`${description} failed (attempt ${attempt}): ${err.message}`);
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
      } else {
        console.error(`${description} failed after ${retries} attempts.`);
        return null;
      }
    }
  }
}

async function startGame() {
  return await safeRequest(
    () => axios.post(`${API}/game/start`).then(res => res.data),
    `Starting new game`
  );
}

async function getQuests(gameId) {
  return await safeRequest(
    () => axios.get(`${API}/${gameId}/messages`).then(res => res.data),
    `Getting quests for game ${gameId}`
  );
}

async function solveQuest(gameId, adId) {
  return await safeRequest(
    () => axios.post(`${API}/${gameId}/solve/${adId}`).then(res => res.data),
    `Solving quest ${adId}`
  );
}

async function getShopItems(gameId) {
  return await safeRequest(
    () => axios.get(`${API}/${gameId}/shop`).then(res => res.data),
    `Getting shop items for game ${gameId}`
  );
}

async function buyItem(gameId, itemId) {
  return await safeRequest(
    () => axios.post(`${API}/${gameId}/shop/buy/${itemId}`).then(res => res.data),
    `Buying item ${itemId}`
  );
}

async function runInvestigation(gameId) {
  return await safeRequest(
    () => axios.post(`${API}/${gameId}/investigate/reputation`).then(res => res.data),
    `Investigating reputation for game ${gameId}`
  );
}

module.exports = {
  startGame,
  getQuests,
  solveQuest,
  getShopItems,
  buyItem,
  runInvestigation,
  safeRequest
};
