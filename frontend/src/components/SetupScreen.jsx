/* ──────────────────────────────────────────────────────────────────────────
   SetupScreen.jsx  –  Player configuration before the game starts
   ────────────────────────────────────────────────────────────────────────── */
import { useState } from 'react';
import { useGame } from '../context/GameContext.jsx';
import './SetupScreen.css';

const PLAYER_COLORS  = ['#e53935','#1e88e5','#43a047','#fb8c00','#8e24aa','#00acc1'];
const PLAYER_AVATARS = ['🦊','🐯','🦁','🐻','🐺','🦄'];
const PLAYER_NAMES   = ['Red', 'Blue', 'Green', 'Orange', 'Purple', 'Cyan'];

export default function SetupScreen() {
  const { setupGame, doStartGame } = useGame();

  const [players, setPlayers] = useState([
    { name: 'Player 1', color: PLAYER_COLORS[0], avatar: PLAYER_AVATARS[0], isBot: false },
    { name: 'Player 2', color: PLAYER_COLORS[1], avatar: PLAYER_AVATARS[1], isBot: false },
  ]);

  function addPlayer() {
    if (players.length >= 6) return;
    const idx = players.length;
    setPlayers([...players, {
      name: `Player ${idx + 1}`,
      color: PLAYER_COLORS[idx],
      avatar: PLAYER_AVATARS[idx],
      isBot: false,
    }]);
  }

  function removePlayer(idx) {
    if (players.length <= 2) return;
    setPlayers(players.filter((_, i) => i !== idx));
  }

  function toggleBot(idx) {
    const updated = [...players];
    updated[idx] = { ...updated[idx], isBot: !updated[idx].isBot };
    setPlayers(updated);
  }

  function updateName(idx, name) {
    const updated = [...players];
    updated[idx] = { ...updated[idx], name };
    setPlayers(updated);
  }

  function handleStart() {
    setupGame(players);
    doStartGame();
  }

  return (
    <div className="setup-screen">
      <div className="setup-card">

        {/* Header */}
        <div className="setup-header">
          <div className="setup-logo">🏪</div>
          <h1 className="setup-title">VYAPARI</h1>
          <p className="setup-subtitle">Business Board Game</p>
        </div>

        {/* Players */}
        <div className="setup-players">
          <h2 className="setup-section-title">Players ({players.length}/6)</h2>
          {players.map((p, idx) => (
            <div key={idx} className="setup-player-row" style={{ '--pcolor': p.color }}>
              <span className="setup-avatar">{p.avatar}</span>
              <input
                className="setup-name-input"
                value={p.name}
                onChange={e => updateName(idx, e.target.value)}
                maxLength={14}
              />
              <button
                className={`setup-bot-btn ${p.isBot ? 'active' : ''}`}
                onClick={() => toggleBot(idx)}
                title={p.isBot ? 'Bot AI' : 'Human'}
              >
                {p.isBot ? '🤖' : '👤'}
              </button>
              {players.length > 2 && (
                <button className="setup-remove-btn" onClick={() => removePlayer(idx)}>✕</button>
              )}
            </div>
          ))}

          {players.length < 6 && (
            <button className="setup-add-btn" onClick={addPlayer}>
              + Add Player
            </button>
          )}
        </div>

        {/* Start */}
        <button className="setup-start-btn" onClick={handleStart}>
          🎲 START GAME
        </button>

        <p className="setup-note">Starting Balance: ₹15,000 each</p>
      </div>
    </div>
  );
}
