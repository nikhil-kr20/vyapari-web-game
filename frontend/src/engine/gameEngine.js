// ─────────────────────────────────────────────────────────────────────────────
// gameEngine.js  –  Pure offline game logic, no network, no DB
// ─────────────────────────────────────────────────────────────────────────────

import TILES, { COLOR_GROUPS, CHANCE_CARDS, CHEST_CARDS } from './boardData.js';

// ── Constants ─────────────────────────────────────────────────────────────────
export const STARTING_BALANCE = 15000;
export const GO_REWARD        = 2000;
export const MAX_HOUSES       = 4;     // 5th = hotel

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Shuffle an array using Fisher–Yates */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Roll a single 6-sided die */
export function rollOneDie() {
  return Math.floor(Math.random() * 6) + 1;
}

/** Roll two dice, return { d1, d2, total, isDouble } */
export function rollDice() {
  const d1 = rollOneDie();
  const d2 = rollOneDie();
  return { d1, d2, total: d1 + d2, isDouble: d1 === d2 };
}

// ── Initial State Builder ─────────────────────────────────────────────────────

/**
 * buildInitialState – creates a fresh game state object
 * @param {Array<{name:string, color:string, isBot:boolean}>} playerDefs
 * @returns GameState
 */
export function buildInitialState(playerDefs) {
  const players = playerDefs.map((p, idx) => ({
    id:           idx,
    name:         p.name,
    color:        p.color,
    avatar:       p.avatar || '👤',
    isBot:        p.isBot || false,
    balance:      STARTING_BALANCE,
    position:     0,
    inJail:       false,
    jailTurns:    0,
    doublesCount: 0,
    jailFreeCards:0,
    isBankrupt:   false,
    properties:   [],    // tile IDs owned
    mortgaged:    [],    // tile IDs mortgaged
    houses:       {},    // { tileId: houseCount (0-5) }
  }));

  return {
    players,
    currentPlayerIdx: 0,
    phase: 'SETUP',              // SETUP | ROLLING | MOVING | LANDED | BUYING | BANKRUPT | GAME_OVER
    diceResult: null,            // { d1, d2, total, isDouble }
    stepsRemaining: 0,
    properties: {},              // { tileId: { ownerId, houses } }
    chanceCards: shuffle(CHANCE_CARDS),
    chestCards:  shuffle(CHEST_CARDS),
    chanceIdx:   0,
    chestIdx:    0,
    log: [],
    winner: null,
    pendingAction: null,         // { type, data } – what must be resolved before turn ends
    freeParkingPot: 0,
    doubleCount: 0,
  };
}

// ── Core Engine Functions ─────────────────────────────────────────────────────

/**
 * startGame – transitions from SETUP to the first player's ROLLING phase
 */
export function startGame(state) {
  return {
    ...state,
    phase: 'ROLLING',
    log:   ['Game started! ' + state.players[0].name + ' goes first.'],
  };
}

/**
 * prepareMove – rolls dice and handles jail/doubles logic.
 * Prepares the state for incremental stepping.
 */
export function prepareMove(state) {
  const player = state.players[state.currentPlayerIdx];
  const dice   = rollDice();
  let newState  = { ...state, diceResult: dice, stepsRemaining: dice.total };
  let log       = [...state.log];

  // ── Jail handling ──────────────────────────────────────────────────────────
  if (player.inJail) {
    if (dice.isDouble) {
      log.push(`${player.name} rolled a double and escaped Jail! (${dice.d1}+${dice.d2})`);
      newState = updatePlayer(newState, player.id, { inJail: false, jailTurns: 0, doublesCount: 0 });
    } else {
      const jailTurns = player.jailTurns + 1;
      if (jailTurns >= 3) {
        log.push(`${player.name} must pay ₹500 bail after 3 turns in jail.`);
        newState = deductMoney(newState, player.id, 500, log);
        newState = updatePlayer(newState, player.id, { inJail: false, jailTurns: 0 });
      } else {
        log.push(`${player.name} is still in Jail (turn ${jailTurns}/3). (${dice.d1}+${dice.d2})`);
        newState = updatePlayer(newState, player.id, { jailTurns });
        return { ...newState, phase: 'END_TURN', log, stepsRemaining: 0 };
      }
    }
  }

  // ── Triple doubles = jail ──────────────────────────────────────────────────
  const doublesCount = dice.isDouble ? player.doublesCount + 1 : 0;
  if (doublesCount >= 3) {
    log.push(`${player.name} rolled 3 doubles in a row – Go to Jail!`);
    newState = updatePlayer(newState, player.id, { doublesCount: 0 });
    newState = sendToJail(newState, player.id, log);
    return { ...newState, log, phase: 'END_TURN', diceResult: dice, stepsRemaining: 0 };
  }

  newState = updatePlayer(newState, player.id, { doublesCount });
  log.push(`${player.name} rolled ${dice.d1}+${dice.d2}=${dice.total}. Moving...`);
  
  return { ...newState, log, phase: 'MOVING' };
}

/**
 * executeStep – moves the current player one tile forward.
 * Handles passing GO rewards.
 */
export function executeStep(state) {
  const player = state.players[state.currentPlayerIdx];
  if (state.stepsRemaining <= 0) return state;

  const currentPos = player.position;
  const newPos     = (currentPos + 1) % 40;
  let newState     = updatePlayer(state, player.id, { position: newPos });
  let log          = [...newState.log];

  if (newPos === 0) {
    log.push(`${player.name} passed GO and collected ₹${GO_REWARD}!`);
    newState = addMoney(newState, player.id, GO_REWARD);
  }

  return {
    ...newState,
    log,
    stepsRemaining: state.stepsRemaining - 1
  };
}

/**
 * resolveLanding – evaluates the tile where the player actually landed.
 */
export function resolveLanding(state) {
  const player = state.players[state.currentPlayerIdx];
  const dice   = state.diceResult;
  let newState = evaluateLanding(state, player.id, player.position);
  let log      = [...newState.log];

  log.push(`${player.name} landed on ${TILES[player.position].name}`);
  return { ...newState, log };
}



/**
 * evaluateLanding – decides what happens based on which tile was landed on
 */
function evaluateLanding(state, playerId, tileId) {
  const tile   = TILES[tileId];
  const player = state.players.find(p => p.id === playerId);
  let newState  = { ...state };
  let log       = [...state.log];

  switch (tile.type) {
    case 'corner':
      if (tileId === 30) {
        // Go To Jail
        log.push(`${player.name} landed on Go to Jail!`);
        newState = sendToJail(newState, playerId, log);
        return { ...newState, log, phase: 'END_TURN' };
      }
      // GO, Free Parking, Jail (visiting) – nothing happens
      return { ...newState, log, phase: 'END_TURN' };

    case 'tax':
      log.push(`${player.name} pays ${tile.name}: ₹${tile.amount}`);
      newState = deductMoney(newState, playerId, tile.amount, log);
      return { ...newState, log };

    case 'chance':
      return drawCard(newState, playerId, 'chance', log);

    case 'chest':
      return drawCard(newState, playerId, 'chest', log);

    case 'property':
    case 'railway':
    case 'utility': {
      const ownership = state.properties[tileId];
      if (!ownership) {
        // Unowned – offer purchase
        log.push(`${player.name} landed on unowned ${tile.name} (₹${tile.price}).`);
        return {
          ...newState,
          log,
          phase: 'BUYING',
          pendingAction: { type: 'BUY_OFFER', tileId, playerId },
        };
      }
      if (ownership.ownerId === playerId) {
        log.push(`${player.name} owns ${tile.name}.`);
        return { ...newState, log, phase: 'END_TURN' };
      }
      // Owned by another – pay rent
      const owner = newState.players.find(p => p.id === ownership.ownerId);
      if (owner && !owner.isBankrupt) {
        const isMortgaged = owner.mortgaged.includes(tileId);
        if (isMortgaged) {
          log.push(`${tile.name} is mortgaged – no rent due.`);
          return { ...newState, log, phase: 'END_TURN' };
        }
        const rent = calculateRent(newState, tileId, state.diceResult);
        log.push(`${player.name} pays ₹${rent} rent to ${owner.name} for ${tile.name}.`);
        newState = transferMoney(newState, playerId, ownership.ownerId, rent, log);
        return { ...newState, log };
      }
      return { ...newState, log, phase: 'END_TURN' };
    }

    default:
      return { ...newState, log, phase: 'END_TURN' };
  }
}

/**
 * calculateRent – rent based on tile type + houses + monopoly
 */
export function calculateRent(state, tileId, diceResult) {
  const tile      = TILES[tileId];
  const ownership = state.properties[tileId];
  if (!ownership) return 0;

  const ownerId = ownership.ownerId;
  const houses  = ownership.houses || 0;

  if (tile.type === 'utility') {
    // Count utilities owned by same player
    const utilTiles  = TILES.filter(t => t.type === 'utility');
    const ownedCount = utilTiles.filter(t => state.properties[t.id]?.ownerId === ownerId).length;
    const multiplier = ownedCount === 2 ? 10 : 4;
    return (diceResult ? diceResult.total : 7) * multiplier * 10;
  }

  if (tile.type === 'railway') {
    const railTiles  = TILES.filter(t => t.type === 'railway');
    const ownedCount = railTiles.filter(t => state.properties[t.id]?.ownerId === ownerId).length;
    return tile.rent[ownedCount - 1];
  }

  // Property
  if (houses === 0) {
    // Check monopoly (double rent if full color set owned)
    const groupTiles = TILES.filter(t => t.group === tile.group);
    const monopoly   = groupTiles.every(t => state.properties[t.id]?.ownerId === ownerId
                                          && !(state.players.find(p=>p.id===ownerId)?.mortgaged?.includes(t.id)));
    return monopoly ? tile.rent[0] * 2 : tile.rent[0];
  }
  return tile.rent[Math.min(houses, 5)];
}

/**
 * drawCard – draw a Chance or Community Chest card and execute its effect
 */
function drawCard(state, playerId, deck, log) {
  const player    = state.players.find(p => p.id === playerId);
  const isChance  = deck === 'chance';
  const cards     = isChance ? state.chanceCards : state.chestCards;
  const idx       = isChance ? state.chanceIdx   : state.chestIdx;
  const card      = cards[idx % cards.length];
  const nextIdx   = idx + 1;

  log.push(`${player.name} drew: "${card.text}"`);

  let newState = {
    ...state,
    ...(isChance ? { chanceIdx: nextIdx } : { chestIdx: nextIdx }),
    log,
  };

  switch (card.action) {
    case 'GOTO': {
      const target   = card.target;
      const passedGO = target < player.position;
      if (passedGO && card.collect) {
        newState = addMoney(newState, playerId, GO_REWARD);
        log.push(`${player.name} collected ₹${GO_REWARD} for passing GO!`);
      }
      newState = updatePlayer(newState, playerId, { position: target });
      newState = evaluateLanding(newState, playerId, target);
      return newState;
    }
    case 'EARN':
      newState = addMoney(newState, playerId, card.amount);
      break;
    case 'PAY':
      newState = deductMoney(newState, playerId, card.amount, log);
      break;
    case 'JAIL':
      newState = sendToJail(newState, playerId, log);
      return { ...newState, log, phase: 'END_TURN' };
    case 'JAIL_FREE':
      newState = updatePlayer(newState, playerId, { jailFreeCards: player.jailFreeCards + 1 });
      break;
    case 'MOVE': {
      const newPos = ((player.position + card.amount) + 40) % 40;
      newState = updatePlayer(newState, playerId, { position: newPos });
      newState = evaluateLanding(newState, playerId, newPos);
      return newState;
    }
    case 'COLLECT_ALL': {
      let collected = 0;
      newState.players.forEach(p => {
        if (p.id !== playerId && !p.isBankrupt) {
          newState = deductMoney(newState, p.id, card.amount, log);
          collected += card.amount;
        }
      });
      newState = addMoney(newState, playerId, collected);
      break;
    }
    case 'REPAIR': {
      let total = 0;
      Object.entries(newState.properties).forEach(([tid, own]) => {
        if (own.ownerId === playerId) {
          const h = own.houses || 0;
          total += h < 5 ? h * card.house : card.hotel;
        }
      });
      if (total > 0) newState = deductMoney(newState, playerId, total, log);
      break;
    }
    default: break;
  }

  return { ...newState, log, phase: 'END_TURN' };
}

/**
 * buyProperty – current player purchases the tile they landed on
 */
export function buyProperty(state) {
  const { tileId, playerId } = state.pendingAction || {};
  if (!tileId && tileId !== 0) return state;

  const tile   = TILES[tileId];
  const player = state.players.find(p => p.id === playerId);
  let newState  = state;
  let log       = [...state.log];

  if (player.balance < tile.price) {
    log.push(`${player.name} can't afford ${tile.name}!`);
    return { ...newState, log, phase: 'END_TURN', pendingAction: null };
  }

  newState = deductMoney(newState, playerId, tile.price, log);
  newState = updatePlayer(newState, playerId, { properties: [...player.properties, tileId] });
  newState = {
    ...newState,
    properties: {
      ...newState.properties,
      [tileId]: { ownerId: playerId, houses: 0 },
    },
    pendingAction: null,
    log,
    phase: 'END_TURN',
  };
  log.push(`${player.name} bought ${tile.name} for ₹${tile.price}!`);
  return { ...newState, log };
}

/**
 * passProperty – decline to buy, move on
 */
export function passProperty(state) {
  return { ...state, pendingAction: null, phase: 'END_TURN' };
}

/**
 * buildHouse – build a house/hotel on a property
 */
export function buildHouse(state, playerId, tileId) {
  const tile    = TILES[tileId];
  const player  = state.players.find(p => p.id === playerId);
  const own     = state.properties[tileId];
  let log       = [...state.log];

  if (!own || own.ownerId !== playerId) return state;

  // Must own full color group
  const groupTiles = TILES.filter(t => t.group === tile.group && t.type === 'property');
  const ownsAll    = groupTiles.every(t => state.properties[t.id]?.ownerId === playerId);
  if (!ownsAll) {
    log.push(`${player.name} must own all ${COLOR_GROUPS[tile.group].label} properties first.`);
    return { ...state, log };
  }

  const currentHouses = own.houses || 0;
  if (currentHouses >= 5) {
    log.push(`${tile.name} already has a hotel!`);
    return { ...state, log };
  }

  if (player.balance < tile.houseCost) {
    log.push(`${player.name} can't afford to build on ${tile.name}.`);
    return { ...state, log };
  }

  let newState = deductMoney(state, playerId, tile.houseCost, log);
  newState = {
    ...newState,
    properties: {
      ...newState.properties,
      [tileId]: { ...own, houses: currentHouses + 1 },
    },
    log,
  };
  const label = currentHouses + 1 === 5 ? 'Hotel' : `House #${currentHouses + 1}`;
  log.push(`${player.name} built ${label} on ${tile.name} for ₹${tile.houseCost}!`);
  return { ...newState, log };
}

/**
 * mortgageProperty – flip a property face-down for mortgage value
 */
export function mortgageProperty(state, playerId, tileId) {
  const tile   = TILES[tileId];
  const player = state.players.find(p => p.id === playerId);
  const own    = state.properties[tileId];
  let log      = [...state.log];

  if (!own || own.ownerId !== playerId) return state;
  if (player.mortgaged.includes(tileId)) {
    log.push(`${tile.name} is already mortgaged.`);
    return { ...state, log };
  }

  if ((own.houses || 0) > 0) {
    log.push(`Sell all houses on ${tile.name} before mortgaging.`);
    return { ...state, log };
  }

  const newState = addMoney(state, playerId, tile.mortgage);
  const updated  = updatePlayer(newState, playerId, { mortgaged: [...player.mortgaged, tileId] });
  log.push(`${player.name} mortgaged ${tile.name} for ₹${tile.mortgage}.`);
  return { ...updated, log };
}

/**
 * unmortgageProperty – buy back a mortgaged property (+10%)
 */
export function unmortgageProperty(state, playerId, tileId) {
  const tile   = TILES[tileId];
  const player = state.players.find(p => p.id === playerId);
  let log      = [...state.log];

  if (!player.mortgaged.includes(tileId)) return state;
  const cost = Math.floor(tile.mortgage * 1.1);
  if (player.balance < cost) {
    log.push(`${player.name} can't afford to unmortgage ${tile.name} (₹${cost}).`);
    return { ...state, log };
  }

  let newState = deductMoney(state, playerId, cost, log);
  newState = updatePlayer(newState, playerId, {
    mortgaged: player.mortgaged.filter(id => id !== tileId),
  });
  log.push(`${player.name} unmortgaged ${tile.name} for ₹${cost}.`);
  return { ...newState, log };
}

/**
 * payJailFine – pay ₹500 to leave jail voluntarily
 */
export function payJailFine(state) {
  const player = state.players[state.currentPlayerIdx];
  if (!player.inJail) return state;
  let newState = deductMoney(state, player.id, 500, [...state.log]);
  newState = updatePlayer(newState, player.id, { inJail: false, jailTurns: 0 });
  const log = [...newState.log, `${player.name} paid ₹500 to leave jail.`];
  return { ...newState, log, phase: 'ROLLING' };
}

/**
 * useJailFreeCard – Use a get-out-of-jail-free card
 */
export function useJailFreeCard(state) {
  const player = state.players[state.currentPlayerIdx];
  if (!player.inJail || player.jailFreeCards === 0) return state;
  const newState = updatePlayer(state, player.id, {
    inJail: false, jailTurns: 0,
    jailFreeCards: player.jailFreeCards - 1,
  });
  const log = [...newState.log, `${player.name} used a Get Out of Jail Free card!`];
  return { ...newState, log, phase: 'ROLLING' };
}

/**
 * endTurn – advances to the next active player
 */
export function endTurn(state) {
  const players      = state.players;
  const current      = state.currentPlayerIdx;
  let   nextIdx      = (current + 1) % players.length;
  let   loopGuard    = 0;

  while (players[nextIdx].isBankrupt && loopGuard < players.length) {
    nextIdx   = (nextIdx + 1) % players.length;
    loopGuard++;
  }

  // Check game over
  const active = players.filter(p => !p.isBankrupt);
  if (active.length === 1) {
    return { ...state, phase: 'GAME_OVER', winner: active[0].id };
  }

  const nextPlayer = players[nextIdx];
  const log = [...state.log, `─── ${nextPlayer.name}'s turn ───`];

  return {
    ...state,
    currentPlayerIdx: nextIdx,
    phase: 'ROLLING',
    diceResult: null,
    pendingAction: null,
    doubleCount: 0,
    log,
  };
}

// ── Money Helpers ─────────────────────────────────────────────────────────────

function addMoney(state, playerId, amount) {
  return updatePlayer(state, playerId, {
    balance: state.players.find(p => p.id === playerId).balance + amount,
  });
}

function deductMoney(state, playerId, amount, log) {
  const player = state.players.find(p => p.id === playerId);
  const newBal = player.balance - amount;
  let newState = updatePlayer(state, playerId, { balance: newBal });
  if (newBal < 0) {
    newState = handleBankruptcy(newState, playerId, log);
  }
  return newState;
}

function transferMoney(state, fromId, toId, amount, log) {
  let newState = deductMoney(state, fromId, amount, log);
  newState     = addMoney(newState, toId, amount);
  return { ...newState, phase: 'END_TURN' };
}

/**
 * handleBankruptcy – marks player as bankrupt, returns assets to bank
 */
function handleBankruptcy(state, playerId, log) {
  const player = state.players.find(p => p.id === playerId);
  log.push(`💀 ${player.name} is BANKRUPT!`);

  // Return all properties to bank (unowned)
  const newProperties = { ...state.properties };
  player.properties.forEach(tid => {
    delete newProperties[tid];
  });

  const newState = updatePlayer(state, playerId, {
    isBankrupt: true,
    balance: 0,
    properties: [],
    mortgaged: [],
    houses: {},
  });

  // Check winner
  const stillActive = newState.players.filter(p => !p.isBankrupt);
  if (stillActive.length === 1) {
    return { ...newState, properties: newProperties, log, phase: 'GAME_OVER', winner: stillActive[0].id };
  }

  return { ...newState, properties: newProperties, log, phase: 'END_TURN' };
}

/** sendToJail – moves player to tile 10 (Jail) */
function sendToJail(state, playerId, log) {
  log.push(`${state.players.find(p=>p.id===playerId).name} goes to Jail!`);
  return updatePlayer(state, playerId, { position: 10, inJail: true, jailTurns: 0, doublesCount: 0 });
}

/** Pure immutable player updater */
function updatePlayer(state, playerId, updates) {
  return {
    ...state,
    players: state.players.map(p => p.id === playerId ? { ...p, ...updates } : p),
  };
}
