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

  const hasOptions = (inJail && phase === 'ROLLING') || (phase === 'BUYING' && state.pendingAction) || (phase === 'END_TURN');
  if (!hasOptions) return null;

  return (
    <div className="action-panel ap--center">
      <div className="ap-buttons">
        {/* Jail Options */}
        {inJail && phase === 'ROLLING' && (
          <>
            <button className="ap-btn ap-btn--secondary" onClick={doPayJailFine}>
              💰 Pay ₹500 Bail
            </button>
            {player.jailFreeCards > 0 && (
              <button className="ap-btn ap-btn--secondary" onClick={doUseJailCard}>
                🎫 Use Free Card
              </button>
            )}
            <div style={{fontSize: '0.8rem', color: '#555', textAlign: 'center'}}>Hint: Click your Dice to roll for a double!</div>
          </>
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
