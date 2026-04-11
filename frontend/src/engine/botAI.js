// ─────────────────────────────────────────────────────────────────────────────
// botAI.js  –  Simple AI for bot players (auto-decisions)
// ─────────────────────────────────────────────────────────────────────────────

import TILES, { COLOR_GROUPS } from './boardData.js';
import { buyProperty, passProperty, buildHouse, mortgageProperty } from './gameEngine.js';

/**
 * decideBotAction – given the current game state, automatically resolves
 * the current bot player's phase (BUYING → END_TURN, banking actions).
 * Returns an updated state.
 */
export function decideBotAction(state) {
  const bot = state.players[state.currentPlayerIdx];
  if (!bot.isBot) return state;

  let newState = state;

  // ── Buying decision ────────────────────────────────────────────────────────
  if (state.phase === 'BUYING' && state.pendingAction?.type === 'BUY_OFFER') {
    const { tileId } = state.pendingAction;
    const tile = TILES[tileId];

    // Simple rule: always buy if we have 2× the price in reserve
    const shouldBuy = bot.balance >= tile.price * 2;
    newState = shouldBuy ? buyProperty(state) : passProperty(state);
    return newState;
  }

  // ── Building decision ──────────────────────────────────────────────────────
  if (state.phase === 'END_TURN') {
    // Try to build houses on every eligible monopoly
    const propertyTiles = TILES.filter(
      t => t.type === 'property' && bot.properties.includes(t.id) && !bot.mortgaged.includes(t.id)
    );

    for (const tile of propertyTiles) {
      const groupTiles = TILES.filter(t => t.group === tile.group && t.type === 'property');
      const ownsAll    = groupTiles.every(t => newState.properties[t.id]?.ownerId === bot.id);
      const own        = newState.properties[tile.id];
      const houses     = own?.houses || 0;

      // Build if we can afford it and already own all and houses < 3
      if (ownsAll && houses < 3 && bot.balance > tile.houseCost * 3) {
        newState = buildHouse(newState, bot.id, tile.id);
      }
    }

    return newState;
  }

  return newState;
}
