/* ──────────────────────────────────────────────────────────────────────────
   BoardCenter.jsx  –  The 9x9 center of the board (dice, logo, cards)
   ────────────────────────────────────────────────────────────────────────── */
import './BoardCenter.css';

export default function BoardCenter() {
  return (
    <div className="board-center">
      <div className="board-center-logo">
        <span className="bc-rupee">₹</span>
        <div className="bc-title">VYAPARI</div>
        <div className="bc-sub">Business Board Game</div>
      </div>
    </div>
  );
}
