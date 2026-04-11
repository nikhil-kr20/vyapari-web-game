/* ──────────────────────────────────────────────────────────────────────────
   Dice.jsx  –  Animated dice with CSS 3D faces
   ────────────────────────────────────────────────────────────────────────── */
import { useState, useEffect } from 'react';
import './Dice.css';

const FACE_DOTS = {
  1: [[50,50]],
  2: [[25,25],[75,75]],
  3: [[25,25],[50,50],[75,75]],
  4: [[25,25],[75,25],[25,75],[75,75]],
  5: [[25,25],[75,25],[50,50],[25,75],[75,75]],
  6: [[25,20],[75,20],[25,50],[75,50],[25,80],[75,80]],
};

function DieFace({ value, rolling }) {
  const dots = FACE_DOTS[value] || FACE_DOTS[1];
  return (
    <div className={`die ${rolling ? 'die--rolling' : ''}`}>
      <div className="die-face">
        {dots.map(([cx, cy], i) => (
          <div
            key={i}
            className="die-dot"
            style={{ left: `${cx}%`, top: `${cy}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Dice({ d1, d2, rolling }) {
  return (
    <div className="dice-pair">
      <DieFace value={d1 || 1} rolling={rolling} />
      <DieFace value={d2 || 1} rolling={rolling} />
    </div>
  );
}
