/* ──────────────────────────────────────────────────────────────────────────
   PlayerPanel.jsx – Compact player info card in the bottom HUD
   ────────────────────────────────────────────────────────────────────────── */
import { useGame } from '../context/GameContext.jsx';
import Dice from './Dice.jsx';
import './PlayerPanel.css';

export default function PlayerPanel({ player, isActive }) {
  const { state, doRoll } = useGame();
  
  const showDice = isActive && state?.phase !== 'SETUP' && state?.phase !== 'GAME_OVER';
  const canRoll = isActive && state?.phase === 'ROLLING' && !player.isBot && !state.isRolling;

  const handleDiceClick = () => {
    if (canRoll) {
      doRoll();
    }
  };

  return (
    <div
      className={`player-panel ${isActive ? 'player-panel--active' : ''} ${player.isBankrupt ? 'player-panel--bankrupt' : ''}`}
      style={{ '--pcolor': player.color }}
    >
      <div className="pp-avatar">{player.avatar}</div>
      
      <div className="pp-body">
        <div className="pp-name">
          {player.name}
          {player.isBot && <span className="pp-bot-badge">🤖</span>}
          {player.inJail && <span className="pp-status">⛓️</span>}
          {player.isBankrupt && <span className="pp-status">💀</span>}
        </div>
        <div className="pp-balance">₹{player.balance.toLocaleString('en-IN')}</div>
        
        {player.jailFreeCards > 0 && (
          <div className="pp-jail-card" title="Get Out of Jail Free">🎫×{player.jailFreeCards}</div>
        )}
      </div>

      {showDice && (
        <div 
          className="pp-dice-container" 
          onClick={handleDiceClick}
          style={{ cursor: canRoll ? 'pointer' : 'default' }}
          title={canRoll ? "Click to Roll!" : ""}
        >
          <Dice 
            d1={state.diceResult?.d1 || 1} 
            d2={state.diceResult?.d2 || 1} 
            rolling={state.isRolling} 
          />
        </div>
      )}

      {isActive && !showDice && <div className="pp-active-dot" />}
    </div>
  );
}

