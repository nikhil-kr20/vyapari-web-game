/* ──────────────────────────────────────────────────────────────────────────
   ActionPanel.jsx – Dice roll + action buttons for the current player
   ────────────────────────────────────────────────────────────────────────── */
import { useGame } from '../context/GameContext.jsx';
import './ActionPanel.css';

export default function ActionPanel() {
  const { state, doRoll, doBuy, doPass, doPayJailFine, doUseJailCard, doEndTurn } = useGame();

  if (!state || state.phase === 'SETUP' || state.phase === 'GAME_OVER') return null;

  const player = state.players[state.currentPlayerIdx];
  if (!player || player.isBot) return null; // bots act automatically

  const inJail    = player.inJail;
  const phase     = state.phase;
  const rolling   = state.isRolling;

  return (
    <div className="action-panel">
      {/* Current Player Banner */}
      <div className="ap-player-banner" style={{ '--pcolor': player.color }}>
        <span className="ap-avatar">{player.avatar}</span>
        <div>
          <div className="ap-name">{player.name}'s Turn</div>
          <div className="ap-balance">₹{player.balance.toLocaleString('en-IN')}</div>
        </div>
        {inJail && <span className="ap-jail-badge">⛓️ In Jail</span>}
        {state.diceResult?.isDouble && <span className="ap-double-badge">🎯 DOUBLE!</span>}
      </div>

      {/* Buttons */}
      <div className="ap-buttons">
        {/* Jail Options */}
        {inJail && phase === 'ROLLING' && (
          <>
            <button className="ap-btn ap-btn--primary" onClick={doRoll} disabled={rolling}>
              {rolling ? '🎲 Rolling...' : '🎲 Roll for Double'}
            </button>
            <button className="ap-btn ap-btn--secondary" onClick={doPayJailFine}>
              💰 Pay ₹500 Bail
            </button>
            {player.jailFreeCards > 0 && (
              <button className="ap-btn ap-btn--secondary" onClick={doUseJailCard}>
                🎫 Use Free Card
              </button>
            )}
          </>
        )}

        {/* Normal Roll */}
        {!inJail && phase === 'ROLLING' && (
          <button className="ap-btn ap-btn--primary ap-btn--roll" onClick={doRoll} disabled={rolling}>
            {rolling ? '🎲 Rolling...' : '🎲 ROLL DICE'}
          </button>
        )}

        {/* Buy/Pass */}
        {phase === 'BUYING' && state.pendingAction && (
          <>
            <button className="ap-btn ap-btn--primary" onClick={doBuy}>
              🏘️ Buy Property
            </button>
            <button className="ap-btn ap-btn--secondary" onClick={doPass}>
              ❌ Pass
            </button>
          </>
        )}

        {/* End Turn */}
        {phase === 'END_TURN' && (
          <button className="ap-btn ap-btn--end" onClick={doEndTurn}>
            ➡️ End Turn
          </button>
        )}
      </div>
    </div>
  );
}
