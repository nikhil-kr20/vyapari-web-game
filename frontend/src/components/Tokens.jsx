/* ──────────────────────────────────────────────────────────────────────────
   Tokens.jsx  –  Players' game pieces rendered absolutely over the board
   ────────────────────────────────────────────────────────────────────────── */
import { useGame } from '../context/GameContext.jsx';
import './Tokens.css';

// Returns CSS left%, top% for a tile position on the 11x11 grid
// Grid cells are index 0-10 (11 total)
function getTileCenter(tileId) {
  let col, row;

  if (tileId <= 10) {
    // Bottom row: tileId 0 = col 10, tileId 10 = col 0
    col = 10 - tileId;
    row = 10;
  } else if (tileId <= 19) {
    // Left column: tileId 11 = row 9, tileId 19 = row 1
    col = 0;
    row = 20 - tileId;
  } else if (tileId <= 30) {
    // Top row: tileId 20 = col 0, tileId 30 = col 10
    col = tileId - 20;
    row = 0;
  } else {
    // Right column: tileId 31 = row 1, tileId 39 = row 9
    col = 10;
    row = tileId - 30;
  }

  // Convert grid cell (0-10) to percentage within the board
  // Corners = 70px (about 11.27% for 70/620 on ~700px board)
  // We approximate: corner = 10% of board, inner cells = ~8.9% each
  const corners = [0, 10];
  function cellPct(idx, axis) {
    // Corner columns/rows = 70px; inner = 1fr
    // Total = 70 + 9*innerFr + 70 = 700 assumed
    const CORNER_FRAC = 70 / 700;
    const INNER_FRAC  = (700 - 140) / (700 * 9);
    if (idx === 0)  return (CORNER_FRAC / 2) * 100;
    if (idx === 10) return (1 - CORNER_FRAC / 2) * 100;
    return (CORNER_FRAC + (idx - 0.5) * INNER_FRAC * 700 / 700) * 100;
  }

  const left = ((col === 0 ? 0.07 : col === 10 ? 0.93 : (0.14 + (col - 1) * (0.72 / 9) + 0.04))) * 100;
  const top  = ((row === 0 ? 0.07 : row === 10 ? 0.93 : (0.14 + (row - 1) * (0.72 / 9) + 0.04))) * 100;

  return { left: `${left.toFixed(1)}%`, top: `${top.toFixed(1)}%` };
}

// Small offset so tokens don't stack on top of each other
const OFFSETS = [
  { dx: -8, dy: -8 },
  { dx:  8, dy: -8 },
  { dx: -8, dy:  8 },
  { dx:  8, dy:  8 },
  { dx:  0, dy: -8 },
  { dx:  0, dy:  8 },
];

export default function Tokens() {
  const { state } = useGame();
  if (!state) return null;

  return (
    <>
      {state.players.map((player, pIdx) => {
        if (player.isBankrupt) return null;
        const { left, top } = getTileCenter(player.position);
        const offset = OFFSETS[pIdx] || { dx: 0, dy: 0 };

        return (
          <div
            key={player.id}
            className="token"
            style={{
              left,
              top,
              transform: `translate(calc(-50% + ${offset.dx}px), calc(-50% + ${offset.dy}px))`,
              borderColor: player.color,
            }}
            title={player.name}
          >
            <span className="token-avatar">{player.avatar}</span>
          </div>
        );
      })}
    </>
  );
}
