class GameState {
  constructor(initialData) {
    this.gameId = initialData.gameId;
    this.lives = initialData.lives;
    this.gold = initialData.gold;
    this.level = initialData.level;
    this.score = initialData.score;
    this.highScore = initialData.highScore;
    this.turn = initialData.turn;
    this.peopleReputation = null;
    this.stateReputation = null;
    this.underworldReputation = null;
  }

  updateFromQuestResult(result) {
    this.lives = result.lives;
    this.gold = result.gold;
    this.score = result.score;
    this.turn = result.turn;
  }

  updateFromShopResult(result) {
    this.lives = result.lives;
    this.gold = result.gold;
    this.level = result.level;
    this.turn = result.turn;
  }

  updateReputation(repData) {
    this.peopleReputation = repData.people;
    this.stateReputation = repData.state;
    this.underworldReputation = repData.underworld;
    this.turn += 1;
  }

  isAlive() {
    return this.lives > 0;
  }

  canAfford(amount) {
    return this.gold >= amount;
  }

  logState() {
    console.log([
      `Turn: ${this.turn}`,
      `Score: ${this.score}`,
      `Gold: ${this.gold}`,
      `Lives: ${this.lives}`,
      `Level: ${this.level}`,
    ].join(` | `));
  }

  logReputation() {
    console.log([
      `Reputation `,
      `People: ${this.peopleReputation}`,
      `State: ${this.stateReputation}`,
      `Underworld: ${this.underworldReputation}`,

    ].join(` | `));
  }
}

module.exports = GameState;
