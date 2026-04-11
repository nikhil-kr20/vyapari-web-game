/* ──────────────────────────────────────────────────────────────────────────
   LogPanel.jsx – Live feed of game events
   ────────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext.jsx';
import './LogPanel.css';

export default function LogPanel() {
  const { state } = useGame();
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state?.log]);

  if (!state) return null;

  return (
    <div className="log-panel">
      <h3 className="log-title">🧾 Ledger</h3>
      <div className="log-content">
        {state.log.map((msg, i) => (
          <div key={i} className="log-msg">
            <span className="log-bullet">•</span> {msg}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
