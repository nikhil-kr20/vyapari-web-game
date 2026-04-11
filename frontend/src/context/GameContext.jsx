// ─────────────────────────────────────────────────────────────────────────────
// GameContext.jsx  –  Global React state using useReducer + Context
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  buildInitialState,
  startGame,
  performRoll,
  buyProperty,
  passProperty,
  buildHouse,
  mortgageProperty,
  unmortgageProperty,
  payJailFine,
  useJailFreeCard,
  endTurn,
} from '../engine/gameEngine.js';
import { decideBotAction } from '../engine/botAI.js';

// ── Context ────────────────────────────────────────────────────────────────────
const GameContext = createContext(null);

// ── Reducer ────────────────────────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {

    case 'SETUP_GAME': {
      const fresh = buildInitialState(action.players);
      return fresh;
    }

    case 'START_GAME':
      return startGame(state);

    case 'SET_ROLLING':
      return { ...state, isRolling: action.payload };

    case 'ROLL_DICE': {
      let next = performRoll(state);
      // If landed → bot turn, run bot logic
      next = runBotIfNeeded(next);
      return next;
    }

    case 'BUY_PROPERTY':
      return runBotIfNeeded(buyProperty(state));

    case 'PASS_PROPERTY':
      return runBotIfNeeded(passProperty(state));

    case 'BUILD_HOUSE': {
      const { playerId, tileId } = action;
      return buildHouse(state, playerId, tileId);
    }

    case 'MORTGAGE': {
      const { playerId, tileId } = action;
      return mortgageProperty(state, playerId, tileId);
    }

    case 'UNMORTGAGE': {
      const { playerId, tileId } = action;
      return unmortgageProperty(state, playerId, tileId);
    }

    case 'PAY_JAIL_FINE':
      return payJailFine(state);

    case 'USE_JAIL_FREE_CARD':
      return useJailFreeCard(state);

    case 'END_TURN': {
      let next = endTurn(state);
      // Auto-roll for bots
      next = runBotIfNeeded(next);
      return next;
    }

    case 'ADD_LOG':
      return { ...state, log: [...state.log, action.message] };

    default:
      return state;
  }
}

/** After any state change, if the current player is a bot, execute their turn automatically */
function runBotIfNeeded(state) {
  const current = state.players?.[state.currentPlayerIdx];
  if (!current || !current.isBot || state.phase === 'GAME_OVER' || state.phase === 'SETUP') {
    return state;
  }

  // Bot is in ROLLING – auto-roll
  if (state.phase === 'ROLLING') {
    let next = performRoll(state);
    next = decideBotAction(next);
    if (next.phase === 'END_TURN') {
      next = endTurn(next);
      return runBotIfNeeded(next);
    }
    return next;
  }

  // Bot needs to decide on buying
  if (state.phase === 'BUYING') {
    let next = decideBotAction(state);
    if (next.phase === 'END_TURN') {
      next = endTurn(next);
      return runBotIfNeeded(next);
    }
    return next;
  }

  // Bot on END_TURN – may build, then end
  if (state.phase === 'END_TURN') {
    let next = decideBotAction(state);
    next = endTurn(next);
    return runBotIfNeeded(next);
  }

  return state;
}

// ── Provider ───────────────────────────────────────────────────────────────────
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null);

  const setupGame       = useCallback((players) => dispatch({ type: 'SETUP_GAME', players }), []);
  const doStartGame     = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  
  const doRoll          = useCallback(() => {
    dispatch({ type: 'SET_ROLLING', payload: true });
    setTimeout(() => {
      dispatch({ type: 'ROLL_DICE' });
      dispatch({ type: 'SET_ROLLING', payload: false });
    }, 600);
  }, []);

  const doBuy           = useCallback(() => dispatch({ type: 'BUY_PROPERTY' }), []);
  const doPass          = useCallback(() => dispatch({ type: 'PASS_PROPERTY' }), []);
  const doBuildHouse    = useCallback((pid, tid) => dispatch({ type: 'BUILD_HOUSE', playerId: pid, tileId: tid }), []);
  const doMortgage      = useCallback((pid, tid) => dispatch({ type: 'MORTGAGE', playerId: pid, tileId: tid }), []);
  const doUnmortgage    = useCallback((pid, tid) => dispatch({ type: 'UNMORTGAGE', playerId: pid, tileId: tid }), []);
  const doPayJailFine   = useCallback(() => dispatch({ type: 'PAY_JAIL_FINE' }), []);
  const doUseJailCard   = useCallback(() => dispatch({ type: 'USE_JAIL_FREE_CARD' }), []);
  const doEndTurn       = useCallback(() => dispatch({ type: 'END_TURN' }), []);

  return (
    <GameContext.Provider value={{
      state,
      setupGame,
      doStartGame,
      doRoll,
      doBuy,
      doPass,
      doBuildHouse,
      doMortgage,
      doUnmortgage,
      doPayJailFine,
      doUseJailCard,
      doEndTurn,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
