const {
  filterValidQuests,
  probabilityScore
} = require('../util/questUtil');

const HIGH_RISK_THRESHOLD = 2;
const LOW_RISK_THRESHOLD = 8;
const LONG_EXPIRATION = 3;

function areAllQuestsHard(quests) {
  const filteredQuests = filterValidQuests(quests)
  return filteredQuests.every(q => probabilityScore(q.probability) <= HIGH_RISK_THRESHOLD);
}

function pickBestQuest(quests) {
  const validQuests = filterValidQuests(quests);

  if (validQuests.length === 0) {
    return null;
  }

  return validQuests
    .map(q => {
      const pScore = probabilityScore(q.probability);
      const urgencyBonus = (10 - q.expiresIn);
      const score = pScore * q.reward + urgencyBonus;
      return { ...q, score };
    })
    .sort((a, b) => b.score - a.score)[0];
}

function canGoShopping(inputQuests) {
  const quests = filterValidQuests(inputQuests);

  const easyQuests = quests.filter(q => probabilityScore(q.probability) >= LOW_RISK_THRESHOLD);
  const hardQuests = quests.filter(q => probabilityScore(q.probability) <= HIGH_RISK_THRESHOLD);

  const easyAndLongExpiry = easyQuests.every(q => q.expiresIn >= LONG_EXPIRATION);
  const allHard = quests.length > 0 && hardQuests.length === quests.length;

  if (allHard || easyAndLongExpiry) {
    return true;
  }

  return false;
}

module.exports = { areAllQuestsHard, pickBestQuest, canGoShopping };
