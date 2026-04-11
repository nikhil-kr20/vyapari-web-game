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
  const { state, quitGame } = useGame();

  if (state.phase === 'GAME_OVER') {
    // ... winner handling
    const winner = state.players.find(p => p.id === state.winner);
    return (
      <div className="game-over-screen">
        <div className="winner-card">
          <h1>🏆 GAME OVER</h1>
          <div className="winner-avatar">{winner?.avatar}</div>
          <h2>{winner?.name} WINS!</h2>
          <p>Total wealth: ₹{winner?.balance.toLocaleString('en-IN')}</p>
          <button onClick={quitGame} className="play-again-btn">
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  // Split players into top and bottom HUDs by odd/even index
  const topPlayers = state.players.filter((_, i) => i % 2 !== 0);
  const bottomPlayers = state.players.filter((_, i) => i % 2 === 0);

  return (
    <div className="game-screen">
      <button className="quit-btn" onClick={quitGame} title="Quit Game">
        ✖
      </button>

      {/* Top HUD - Player List (Evens like Cpu 1, Cpu 2) */}
      <div className="hud-top">
        {topPlayers.map(p => (
          <PlayerPanel
            key={p.id}
            player={p}
            isActive={state.players.findIndex(x => x.id === p.id) === state.currentPlayerIdx}
          />
        ))}
      </div>

      <div className="game-layout">
        <div className="board-container">
          <Board />
        </div>
      </div>

      {/* Bottom HUD - Player List (Odds like You, Cpu 3) */}
      <div className="hud-bottom">
        {bottomPlayers.map(p => (
          <PlayerPanel
            key={p.id}
            player={p}
            isActive={state.players.findIndex(x => x.id === p.id) === state.currentPlayerIdx}
          />
        ))}
        {/* <div className="side-panel">
          <LogPanel />
        </div> */}
      </div>
    </div>
  );
}

