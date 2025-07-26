# Dragons of Mugloar Bot

A Node.js game-playing bot for the [Dragons of Mugloar](https://dragonsofmugloar.com) developer test assignment. This bot automates gameplay using the public game API and strives to achieve high scores through intelligent decision-making.

## Key Features

- Fully automated gameplay via the public Dragons of Mugloar API
- Designed to score intelligently through strategic decision-making
- Robust and failsafe logic with retry handling and turn-by-turn state tracking
- Fully covered by unit and integration tests using Jest

### Gameplay Logic

The bot plays the game using a looped decision algorithm that includes:

- **Quest Filtering**  
  Filters out:
  - Trap quests, identified by specific message patterns (e.g., "steal super awesome diamond")
  - Encrypted quests, which are ignored entirely

- **Quest Selection**  
  Chooses the best quest based on a scoring formula that considers:
  - Probability (e.g., "sure thing" scores higher than "risky")
  - Reward value
  - Urgency bonus, where quests that expire sooner are prioritized

- **Shopping Strategy**  
  Shopping is done when lives are low (below 2) or when quests are too hard and easy quests don't expire soon. Gold is used to:
  - Buy healing potions to build health buffer
  - Purchase boosters (either 100 or 300 gold)

- **Reputation Investigation**  
  When no suitable quests are available and shopping is not available, the bot runs an investigation. This action consumes a turn, thus potentially making better quests available.

- **Failsafe Handling**  
  The game loop ensures that in all edge cases (e.g., no quests, shop returns null, server hiccups), the bot safely continues or exits without crashing.

## Typical Scores

The bot achieves scores typically ranging between **3,000 and 16,000 points**, depending on in-game randomness.

### Fun Fact:
In one rare run, the bot reached:

```bash
Turn: 32,626 | Score: 1,019,751,216 | Gold: 1,013,556,416 | Lives: 4 | Level: 40,617
```

demonstrating just how far it can go with favorable RNG and stable decision-making. The run was ended manually after a couple of hours working.

## Project Structure

```
src/
  entity/            # Game state class
  service/           # API wrappers and core logic
  util/              # Utility helpers (e.g., sleep, string generation)
  gameEngine.js      # Main gameplay loop

tests/
  entity/            # Tests for GameState
  service/           # Tests for API and logic modules
  util/              # Utility function tests
  gameEngine.test.js # Integration test for the main loop
```

## Quick Start Guide for local setup

The following commands are intended for a Unix-style shell environment such as WSL2 (Windows Subsystem for Linux), native Linux, or MacOS.

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Clone the repository

```bash
git clone https://github.com/kjlellep/symfony-anagram.git
cd dragons-bot
```

### Installation

```bash
npm install
```

### Run Tests

```bash
npm test
```

### Run the Bot

```bash
npm start
```

### Console Output

During execution, the bot prints one line per turn with key game stats:

```bash
Turn: 12 | Score: 355 | Gold: 155 | Lives: 4 | Level: 1
```

If no quest was taken and shopping was skipped, the bot will instead run a reputation investigation and print the result:

```bash
Reputation  | People: 4 | State: 3 | Underworld: 2
```

This output provides real-time insight into the bot’s status and decisions.

## Notes

- All HTTP requests are retried up to 3 times using a centralized `safeRequest()` function.
- No comments were added to the source code intentionally. Logic is expressed through naming, consistent structure, and tests.

---

### Author
Built by Karl-Jonathan Lellep

