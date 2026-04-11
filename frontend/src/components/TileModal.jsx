/* ──────────────────────────────────────────────────────────────────────────
   TileModal.jsx  –  Detailed tile view overlay
   ────────────────────────────────────────────────────────────────────────── */
import { COLOR_GROUPS } from '../engine/boardData.js';
import './TileModal.css';

export default function TileModal({ tile, onClose }) {
  const group = tile.group ? COLOR_GROUPS[tile.group] : null;

  return (
    <div className="tm-overlay" onClick={onClose}>
      <div className="tm-card" onClick={e => e.stopPropagation()}>
        <button className="tm-close" onClick={onClose}>✖</button>
        
        {/* Header with Title and Type */}
        <div className="tm-header" style={{ '--group-color': group?.color || '#333' }}>
          {group && <div className="tm-group-label">{group.label}</div>}
          <div className="tm-name">{tile.name}</div>
        </div>

        <div className="tm-body">
          {tile.type === 'property' && (
            <div className="tm-rent-list">
              <div className="tm-rent-row">
                <span>Rent</span>
                <span>₹{tile.rent[0]}</span>
              </div>
              <div className="tm-rent-row">
                <span>With 1 House</span>
                <span>₹{tile.rent[1]}</span>
              </div>
              <div className="tm-rent-row">
                <span>With 2 Houses</span>
                <span>₹{tile.rent[2]}</span>
              </div>
              <div className="tm-rent-row">
                <span>With 3 Houses</span>
                <span>₹{tile.rent[3]}</span>
              </div>
              <div className="tm-rent-row">
                <span>With 4 Houses</span>
                <span>₹{tile.rent[4]}</span>
              </div>
              <div className="tm-rent-row hotel">
                <span>With HOTEL</span>
                <span>₹{tile.rent[5]}</span>
              </div>
            </div>
          )}

          {tile.type === 'railway' && (
             <div className="tm-rent-list">
               <p className="tm-desc">Rent is based on owner's total railways.</p>
               <div className="tm-rent-row"><span>1 Railway</span><span>₹250</span></div>
               <div className="tm-rent-row"><span>2 Railways</span><span>₹500</span></div>
               <div className="tm-rent-row"><span>3 Railways</span><span>₹1,000</span></div>
               <div className="tm-rent-row"><span>4 Railways</span><span>₹2,000</span></div>
             </div>
          )}

          {tile.type === 'utility' && (
             <div className="tm-rent-list">
               <p className="tm-desc">Rent is multiplier of dice result.</p>
               <div className="tm-rent-row"><span>If 1 Utility owned</span><span>4x Dice</span></div>
               <div className="tm-rent-row"><span>If 2 Utilities owned</span><span>10x Dice</span></div>
             </div>
          )}

          <div className="tm-footer">
            {tile.price && (
               <div className="tm-info-bit">
                 <label>PRICE</label>
                 <span>₹{tile.price}</span>
               </div>
            )}
            {tile.houseCost && (
              <div className="tm-info-bit">
                <label>BUILD COST</label>
                <span>₹{tile.houseCost} / House</span>
              </div>
            )}
            {tile.mortgage && (
              <div className="tm-info-bit">
                <label>MORTGAGE</label>
                <span>₹{tile.mortgage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
