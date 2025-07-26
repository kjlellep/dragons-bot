function filterValidQuests(quests) {
  const trapPattern = /steal super awesome diamond/i;

  return quests.filter(q =>
    !trapPattern.test(q.message) &&
    q.encrypted == null
  );
}

function probabilityScore(probability) {
  switch (probability.toLowerCase()) {
    case 'sure thing': return 10;
    case 'walk in the park': return 8;
    case 'piece of cake': return 8;
    case 'quite likely': return 4;
    case 'hmmm....': return 2;
    case 'gamble': return 1;
    case 'risky': return 0;
    case 'playing with fire': return -1;
    case 'suicide mission': return -1;
    default: return -1;
  }
}

module.exports = {
  filterValidQuests,
  probabilityScore,
};
