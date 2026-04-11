/* ──────────────────────────────────────────────────────────────────────────
   Tile.jsx  –  Individual board tile renderer
   ────────────────────────────────────────────────────────────────────────── */
import { COLOR_GROUPS } from '../engine/boardData.js';
import './Tile.css';

const HOUSE_DOTS = ['', '🏠', '🏠🏠', '🏠🏠🏠', '🏠🏠🏠🏠', '🏨'];

export default function Tile({ tile, edge, style, ownerColor, houses, onClick }) {
  const isCorner = edge === 'corner';
  const group    = tile.group ? COLOR_GROUPS[tile.group] : null;

  return (
    <div
      className={`tile tile--${edge}`}
      style={{ ...style, cursor: 'pointer' }}
      title={tile.name}
      onClick={onClick}
    >
      {/* Color band for properties */}
      {group && tile.type === 'property' && (
        <div
          className="tile-color-band"
          style={{ background: group.color }}
        />
      )}

      <div className="tile-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minWidth: 0, minHeight: 0 }}>
      
        {/* Icon for corners, chance, chest, tax, railway, utility */}
        {(tile.icon || !group) && (
          <span className="tile-icon">{tile.icon || (tile.type === 'railway' ? '🚂' : tile.type === 'utility' ? '⚡' : '?')}</span>
        )}

        {/* Name */}
        <span className="tile-name">{tile.name}</span>

        {/* Price */}
        {tile.price && (
          <span className="tile-price">₹{tile.price}</span>
        )}

        {/* Houses / Hotel */}
        {houses > 0 && (
          <span className="tile-houses" style={{ color: ownerColor || '#0d6661' }}>
            {HOUSE_DOTS[Math.min(houses, 5)]}
          </span>
        )}
      </div>

      {/* Owner color indicator strip */}
      {ownerColor && tile.type !== 'corner' && (
        <div className="tile-owner-strip" style={{ background: ownerColor }} />
      )}
    </div>
  );
}
