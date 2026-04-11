/* ──────────────────────────────────────────────────────────────────────────
   Board.jsx  –  The 40-tile game board rendered as a CSS Grid
   ────────────────────────────────────────────────────────────────────────── */
import TILES, { COLOR_GROUPS } from '../engine/boardData.js';
import { useGame } from '../context/GameContext.jsx';
import Tile from './Tile.jsx';
import Tokens from './Tokens.jsx';
import BoardCenter from './BoardCenter.jsx';
import './Board.css';

// Pre-compute grid positions for each tile (0-39)
// Board layout:
//   Bottom row  (tile 0–10)  : row 11, col 1–11  (left→right)
//   Left column (tile 11–19) : col 1, row 10–2   (bottom→top)
//   Top row     (tile 20–30) : row 1, col 1–11   (left→right)
//   Right col   (tile 31–39) : col 11, row 2–10  (top→bottom)

function getTileGridStyle(tileId) {
  if (tileId <= 10) {
    // Bottom row: tile 0 = col 11, tile 10 = col 1
    const col = 11 - tileId;
    return { gridRow: 11, gridColumn: col };
  }
  if (tileId <= 19) {
    // Left column: tile 11 = row 10, tile 19 = row 2
    const row = 21 - tileId;
    return { gridRow: row, gridColumn: 1 };
  }
  if (tileId <= 30) {
    // Top row: tile 20 = col 1, tile 30 = col 11
    const col = tileId - 19;
    return { gridRow: 1, gridColumn: col };
  }
  // Right column: tile 31 = row 2, tile 39 = row 10
  const row = tileId - 29;
  return { gridRow: row, gridColumn: 11 };
}

/** Which edge is this tile on? (for rotation) */
function getEdge(tileId) {
  if (tileId === 0 || tileId === 10 || tileId === 20 || tileId === 30) return 'corner';
  if (tileId <= 9)  return 'bottom';
  if (tileId <= 19) return 'left';
  if (tileId <= 29) return 'top';
  return 'right';
}

export default function Board() {
  const { state } = useGame();

  return (
    <div className="board-wrapper">
      <div className="board-grid">
        {TILES.map(tile => {
          const gridStyle = getTileGridStyle(tile.id);
          const edge      = getEdge(tile.id);
          const owner     = state?.properties?.[tile.id];
          const ownerPlayer = owner ? state.players.find(p => p.id === owner.ownerId) : null;
          const houses    = owner?.houses || 0;

          return (
            <Tile
              key={tile.id}
              tile={tile}
              edge={edge}
              style={gridStyle}
              ownerColor={ownerPlayer?.color}
              houses={houses}
            />
          );
        })}

        {/* Board center */}
        <BoardCenter />

        {/* Player tokens overlaid on board */}
        {state && <Tokens />}
      </div>
    </div>
  );
}
