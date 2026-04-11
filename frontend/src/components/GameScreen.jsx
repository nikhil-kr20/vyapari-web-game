/* ──────────────────────────────────────────────────────────────────────────
   GameScreen.jsx – Orchestrates Board, Modals, ActionPanel and HUD
   ────────────────────────────────────────────────────────────────────────── */
import { useGame } from '../context/GameContext.jsx';
import Board from './Board.jsx';
import ActionPanel from './ActionPanel.jsx';
import PlayerPanel from './PlayerPanel.jsx';
import LogPanel from './LogPanel.jsx';
import './GameScreen.css';

export default function GameScreen() {
  const { state } = useGame();

  if (state.phase === 'GAME_OVER') {
    const winner = state.players.find(p => p.id === state.winner);
    return (
      <div className="game-over-screen">
        <div className="winner-card">
          <h1>🏆 GAME OVER</h1>
          <div className="winner-avatar">{winner?.avatar}</div>
          <h2>{winner?.name} WINS!</h2>
          <p>Total wealth: ₹{winner?.balance.toLocaleString('en-IN')}</p>
          <button onClick={() => window.location.reload()} className="play-again-btn">
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      {/* Top HUD - Player List */}
      <div className="hud-top">
        {state.players.map((p, idx) => (
          <PlayerPanel
            key={p.id}
            player={p}
            isActive={idx === state.currentPlayerIdx}
          />
        ))}
      </div>

      <div className="game-layout">
        <div className="board-container">
          <Board />
        </div>

        <div className="side-panel">
          <ActionPanel />
          <div className="side-panel-spacer" />
          <LogPanel />
        </div>
      </div>
    </div>
  );
}
