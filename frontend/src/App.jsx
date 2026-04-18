import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  Dices, MapPin, Wallet, History, AlertCircle, X, Check, ArrowRight, Users,
  User, Bot, Play, Train, Lightbulb, Droplets, HelpCircle, Briefcase,
  Coins, Car, ShieldAlert, ArrowRightSquare, Home, Hotel, Building,
  RefreshCw, LogOut, ShoppingCart, Repeat, Save, CreditCard, Minus, Plus
} from 'lucide-react';

// --- INJECT ANIMATION LIBRARIES ---
const loadScript = (url) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${url}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

// --- HELPER CONSTANTS & FUNCTIONS (OUTSIDE COMPONENT) ---
const BOARD_DATA = [
  { id: 0, type: 'corner', name: 'GO', icon: '🏁', reward: 2000 },
  { id: 1, type: 'chest', name: 'Community Chest', icon: '📦' },
  { id: 2, type: 'property', name: 'Pune', group: 'BROWN', price: 600, houseCost: 500, mortgage: 300, rent: [20, 100, 300, 900, 1600, 2500] },
  { id: 3, type: 'property', name: 'Nagpur', group: 'BROWN', price: 600, houseCost: 500, mortgage: 300, rent: [40, 200, 600, 1800, 3200, 4500] },
  { id: 4, type: 'tax', name: 'Income Tax', icon: '💸', amount: 2000 },
  { id: 5, type: 'railway', name: 'Mumbai Central', group: 'RAILWAY', price: 2000, mortgage: 1000, rent: [750, 1000, 2000, 4000] },
  { id: 6, type: 'property', name: 'Surat', group: 'LIGHT_BLUE', price: 1000, houseCost: 500, mortgage: 500, rent: [60, 300, 900, 2700, 4000, 5500] },
  { id: 7, type: 'chance', name: 'Surprise', icon: '❓' },
  { id: 8, type: 'property', name: 'Vadodara', group: 'LIGHT_BLUE', price: 1000, houseCost: 500, mortgage: 500, rent: [60, 300, 900, 2700, 4000, 5500] },
  { id: 9, type: 'property', name: 'Ahmedabad', group: 'LIGHT_BLUE', price: 1200, houseCost: 500, mortgage: 600, rent: [80, 400, 1000, 3000, 4500, 6000] },
  { id: 10, type: 'corner', name: 'Jail', icon: '🏛️' },
  { id: 11, type: 'utility', name: 'Electric Co.', group: 'UTILITY', price: 1500, mortgage: 750 },
  { id: 12, type: 'property', name: 'Nashik', group: 'PINK', price: 1400, houseCost: 1000, mortgage: 700, rent: [100, 500, 1500, 4500, 6250, 7500] },
  { id: 13, type: 'property', name: 'Aurangabad', group: 'PINK', price: 1400, houseCost: 1000, mortgage: 700, rent: [100, 500, 1500, 4500, 6250, 7500] },
  { id: 14, type: 'property', name: 'Indore', group: 'PINK', price: 1600, houseCost: 1000, mortgage: 800, rent: [120, 600, 1800, 5000, 7000, 9000] },
  { id: 15, type: 'railway', name: 'Howrah Express', group: 'RAILWAY', price: 2000, mortgage: 1000, rent: [750, 1000, 2000, 4000] },
  { id: 16, type: 'chest', name: 'Community Chest', icon: '📦' },
  { id: 17, type: 'property', name: 'Patna', group: 'ORANGE', price: 1800, houseCost: 1000, mortgage: 900, rent: [140, 700, 2000, 5500, 7500, 9500] },
  { id: 18, type: 'property', name: 'Bhopal', group: 'ORANGE', price: 1800, houseCost: 1000, mortgage: 900, rent: [140, 700, 2000, 5500, 7500, 9500] },
  { id: 19, type: 'property', name: 'Lucknow', group: 'ORANGE', price: 2000, houseCost: 1000, mortgage: 1000, rent: [160, 800, 2200, 6000, 8000, 10000] },
  { id: 20, type: 'corner', name: 'Free Parking', icon: '🅿️' },
  { id: 21, type: 'property', name: 'Jaipur', group: 'RED', price: 2200, houseCost: 1500, mortgage: 1100, rent: [180, 900, 2500, 7000, 8750, 10500] },
  { id: 22, type: 'chance', name: 'Surprise', icon: '❓' },
  { id: 23, type: 'property', name: 'Hyderabad', group: 'RED', price: 2200, houseCost: 1500, mortgage: 1100, rent: [180, 900, 2500, 7000, 8750, 10500] },
  { id: 24, type: 'property', name: 'Chennai', group: 'RED', price: 2400, houseCost: 1500, mortgage: 1200, rent: [200, 1000, 3000, 9000, 11000, 12750] },
  { id: 25, type: 'railway', name: 'Rajdhani Exp.', group: 'RAILWAY', price: 2000, mortgage: 1000, rent: [750, 1000, 2000, 4000] },
  { id: 26, type: 'utility', name: 'Water Works', group: 'UTILITY', price: 1500, mortgage: 750 },
  { id: 27, type: 'property', name: 'Kolkata', group: 'YELLOW', price: 2600, houseCost: 1500, mortgage: 1300, rent: [220, 1100, 3300, 8000, 9750, 11500] },
  { id: 28, type: 'property', name: 'Bengaluru', group: 'YELLOW', price: 2600, houseCost: 1500, mortgage: 1300, rent: [220, 1100, 3300, 8000, 9750, 11500] },
  { id: 29, type: 'property', name: 'Pune Tech', group: 'YELLOW', price: 2800, houseCost: 1500, mortgage: 1400, rent: [240, 1200, 3600, 8500, 10250, 12000] },
  { id: 30, type: 'corner', name: 'Go To Jail', icon: '👮' },
  { id: 31, type: 'property', name: 'Srinagar', group: 'GREEN', price: 3000, houseCost: 2000, mortgage: 1500, rent: [260, 1300, 3900, 9000, 11000, 12750] },
  { id: 32, type: 'property', name: 'Chandigarh', group: 'GREEN', price: 3000, houseCost: 2000, mortgage: 1500, rent: [260, 1300, 3900, 9000, 11000, 12750] },
  { id: 33, type: 'chest', name: 'Community Chest', icon: '📦' },
  { id: 34, type: 'property', name: 'Amritsar', group: 'GREEN', price: 3200, houseCost: 2000, mortgage: 1600, rent: [280, 1500, 4500, 10000, 12000, 14000] },
  { id: 35, type: 'railway', name: 'Shatabdi Exp.', group: 'RAILWAY', price: 2000, mortgage: 1000, rent: [750, 1000, 2000, 4000] },
  { id: 36, type: 'chance', name: 'Surprise', icon: '❓' },
  { id: 37, type: 'property', name: 'Mumbai BKC', group: 'DARK_BLUE', price: 3500, houseCost: 2000, mortgage: 1750, rent: [350, 1750, 5000, 11000, 13000, 15000] },
  { id: 38, type: 'tax', name: 'Luxury Tax', icon: '💎', amount: 750 },
  { id: 39, type: 'property', name: 'Delhi CP', group: 'DARK_BLUE', price: 4000, houseCost: 2000, mortgage: 2000, rent: [500, 2000, 6000, 14000, 17000, 20000] },
];

const PARKING_BASE_BONUS = 500;
const PARKING_MULTIPLIERS = [1, 1, 1, 2, 2, 3, 4];
const LOAN_PROPERTY_WEIGHT = 0.7;
const LOAN_BALANCE_WEIGHT = 0.3;
const LOAN_RATE_PER_TURN = 0.05;

const createParkingReward = () => {
  const multiplier = PARKING_MULTIPLIERS[Math.floor(Math.random() * PARKING_MULTIPLIERS.length)];
  return { amount: PARKING_BASE_BONUS * multiplier, multiplier };
};

const CARDS = {
  CHANCE: [
    { text: "Advance to GO. Collect ₹2000.", action: (p) => ({ type: 'MOVE_TO', pos: 0 }) },
    { text: "Go directly to Jail. Do not pass GO.", action: (p) => ({ type: 'GOTO_JAIL' }) },
    { text: "Get Out of Jail Free.", action: (p) => ({ type: 'GET_OUT_OF_JAIL_FREE' }) },
    { text: "Won a lottery! Collect ₹2500.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 2500 }) },
    { text: "Property value surge. Collect ₹3000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 3000 }) },
    { text: "Insurance dividend. Collect ₹1000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 1000 }) },
    { text: "Business expansion successful. Collect ₹5000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 5000 }) },
    { text: "Consultancy fee received. Collect ₹1200.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 1200 }) },
    { text: "Inheritance from distant relative. Collect ₹4000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 4000 }) },
    { text: "Smart stock investment. Collect ₹2000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 2000 }) },
    { text: "Tax refund bonus. Collect ₹800.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 800 }) },
    { text: "Repaired luxury car. Pay ₹2000.", action: (p) => ({ type: 'PAY_BANK', amount: 2000 }) },
    { text: "Legal fees for property dispute. Pay ₹1500.", action: (p) => ({ type: 'PAY_BANK', amount: 1500 }) },
    { text: "Medical emergency billing. Pay ₹3000.", action: (p) => ({ type: 'PAY_BANK', amount: 3000 }) },
    { text: "Charity donation commitment. Pay ₹1000.", action: (p) => ({ type: 'PAY_BANK', amount: 1000 }) },
    { text: "Lost a bet at the races. Pay ₹500.", action: (p) => ({ type: 'PAY_BANK', amount: 500 }) },
    { text: "Property renovation costs. Pay ₹2500.", action: (p) => ({ type: 'PAY_BANK', amount: 2500 }) },
    { text: "Failed startup investment. Pay ₹4000.", action: (p) => ({ type: 'PAY_BANK', amount: 4000 }) },
    { text: "Speeding fine! Pay ₹1500.", action: (p) => ({ type: 'PAY_BANK', amount: 1500 }) },
    { text: "Drunk driving fine. Pay ₹2000.", action: (p) => ({ type: 'PAY_BANK', amount: 2000 }) },
  ],
  CHEST: [
    { text: "Bank error in your favor. Collect ₹2000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 2000 }) },
    { text: "Doctor's fee. Pay ₹500.", action: (p) => ({ type: 'PAY_BANK', amount: 500 }) },
    { text: "Income tax refund. Collect ₹200.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 200 }) },
    { text: "Go to Jail. Go directly to jail.", action: (p) => ({ type: 'GOTO_JAIL' }) },
    { text: "Get Out of Jail Free.", action: (p) => ({ type: 'GET_OUT_OF_JAIL_FREE' }) },
    { text: "Sale of personal property. Collect ₹2000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 2000 }) },
    { text: "Community service award. Collect ₹500.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 500 }) },
    { text: "Holiday fund matures. Collect ₹1000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 1000 }) },
    { text: "Life insurance matures. Collect ₹1000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 1000 }) },
    { text: "School fees for children. Pay ₹1500.", action: (p) => ({ type: 'PAY_BANK', amount: 1500 }) },
    { text: "Hospital bill. Pay ₹1000.", action: (p) => ({ type: 'PAY_BANK', amount: 1000 }) },
    { text: "Annual subscription renewal. Pay ₹500.", action: (p) => ({ type: 'PAY_BANK', amount: 500 }) },
    { text: "Inheritance processing fee. Pay ₹1200.", action: (p) => ({ type: 'PAY_BANK', amount: 1200 }) },
    { text: "Unexpected house repairs. Pay ₹2500.", action: (p) => ({ type: 'PAY_BANK', amount: 2500 }) },
    { text: "Parking ticket fine. Pay ₹300.", action: (p) => ({ type: 'PAY_BANK', amount: 300 }) },
  ]
};

const GROUP_COLORS = {
  BROWN: '#8B4513', LIGHT_BLUE: '#87CEEB', PINK: '#FF69B4', ORANGE: '#FFA500',
  RED: '#FF0000', YELLOW: '#FFD700', GREEN: '#008000', DARK_BLUE: '#00008B',
};

const getGroupColor = (group) => GROUP_COLORS[group] || null;

const getGridStyle = (id) => {
  if (id === 0) return { gridColumn: 11, gridRow: 11 };
  if (id >= 1 && id <= 9) return { gridColumn: 11 - id, gridRow: 11 };
  if (id === 10) return { gridColumn: 1, gridRow: 11 };
  if (id >= 11 && id <= 19) return { gridColumn: 1, gridRow: 11 - (id - 10) };
  if (id === 20) return { gridColumn: 1, gridRow: 1 };
  if (id >= 21 && id <= 29) return { gridColumn: 1 + (id - 20), gridRow: 1 };
  if (id === 30) return { gridColumn: 11, gridRow: 1 };
  if (id >= 31 && id <= 39) return { gridColumn: 11, gridRow: 1 + (id - 30) };
  return {};
};

const getOwnershipMarkerClass = (id) => {
  if (id >= 1 && id <= 9) return 'own-bottom';
  if (id >= 11 && id <= 19) return 'own-left';
  if (id >= 21 && id <= 29) return 'own-top';
  if (id >= 31 && id <= 39) return 'own-right';
  return 'hidden';
};

const getPawnStackStyle = (index, total) => {
  if (total <= 1) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  const positions = [
    { top: '35%', left: '35%', transform: 'translate(-50%, -50%)' },
    { top: '35%', left: '65%', transform: 'translate(-50%, -50%)' },
    { top: '65%', left: '35%', transform: 'translate(-50%, -50%)' },
    { top: '65%', left: '65%', transform: 'translate(-50%, -50%)' }
  ];
  return positions[index % 4] || positions[0];
};

// --- PURE UI COMPONENTS ---
const PawnIcon = ({ colorClass, size = "w-4 h-4", id }) => {
  const colorMap = {
    'bg-red-500': '#ef4444',
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e',
    'bg-yellow-500': '#eab308',
  };
  const fillColor = colorMap[colorClass] || '#334155';
  // size class like "w-4 h-4" → parse px
  const sizeMap = {
    'w-4 h-4': '16px', 'w-5 h-5': '20px', 'w-6 h-6': '24px',
    'w-7 h-7': '28px', 'w-8 h-8': '32px', 'w-16 h-16': '64px',
  };
  const [wClass] = size.split(' ');
  const pixelSize = sizeMap[size] || (wClass.includes('[') ? wClass.replace('w-[','').replace(']','') : '24px');
  return (
    <svg
      id={id}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{
        color: fillColor,
        width: pixelSize,
        height: pixelSize,
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
        flexShrink: 0,
      }}
    >
      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5.7.5 1.2 1.2 1.5 2h.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1.2l-1.3 6h2.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h2.5l-1.3-6H6a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h.5c.3-.8.8-1.5 1.5-2-1.2-.7-2-2-2-3.5a4 4 0 0 1 4-4z" />
    </svg>
  );
};

const Die = ({ value, isRolling }) => {
  const [fakeValue, setFakeValue] = useState(value);
  useEffect(() => {
    let interval;
    if (isRolling) {
      interval = setInterval(() => { setFakeValue(Math.floor(Math.random() * 6) + 1); }, 30);
    } else {
      setFakeValue(value);
    }
    return () => clearInterval(interval);
  }, [isRolling, value]);

  const dots = {
    1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
  };

  const currentVal = isRolling ? fakeValue : value;

  return (
    <div className={`die${isRolling ? ' rolling' : ''}`}
      style={!isRolling ? { cursor: 'pointer' } : {}}
    >
      <div className="die-grid">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="die-cell">
            {dots[currentVal]?.includes(i) && <div className="die-dot" />}
          </div>
        ))}
      </div>
    </div>
  );
};

const DiceArea = ({ isActive, isRolling, onRoll, dice, canRoll }) => (
  <div
    onClick={isActive && !isRolling && canRoll ? onRoll : undefined}
    className={`dice-area${isActive ? ' active' : ' inactive'}${isRolling ? ' rolling' : ''}${canRoll ? ' can-float' : ''}`}
  >
    <div className="dice-row">
      <Die value={dice[0]} isRolling={isRolling} />
      <Die value={dice[1]} isRolling={isRolling} />
    </div>
  </div>
);

const FloatingNotifications = ({ logs, playerId }) => {
  const playerLogs = logs.filter(log => log.playerId === playerId);
  return (
    <div className="float-notif-container">
      {playerLogs.map(log => (
        <div key={log.id} className="float-notif">
          {log.text}
        </div>
      ))}
    </div>
  );
};

const PlayerCard = ({ player, isActive, logs, onClick }) => (
  <div className="player-card-wrap">
    <div
      onClick={onClick}
      className={`player-card${isActive ? ' active' : ' inactive'}`}
    >
      <div className="player-card-header">
        <PawnIcon colorClass={player.color} size="w-5 h-5" />
        <span className={`player-name${isActive ? ' active' : ' inactive'}`}>
          {player.name} {player.inJail && <ShieldAlert size={14} style={{ display: 'inline', color: '#ef4444', marginLeft: '0.25rem' }} />}
        </span>
      </div>
      <div className={`player-money${isActive ? ' active' : ' inactive'}`}>
        <Wallet size={18} /> ₹{player.money}
      </div>
    </div>
  </div>
);

// --- MAIN APP ---
export default function App() {
  const [appState, setAppState] = useState('setup');
  const [playerCount, setPlayerCount] = useState(2);
  const [gameMode, setGameMode] = useState('bot');
  const [startingMoney, setStartingMoney] = useState(15000);

  const [gameState, setGameState] = useState({
    players: [],
    properties: {},
    bank: { houses: 32, hotels: 12, parking: createParkingReward() },
    currentTurn: 0,
    turnSerial: 0,
    phase: 'ROLL',
    dice: [1, 1]
  });

  const { players, properties, bank, currentTurn: turn, turnSerial, phase, dice } = gameState;

  const setPlayers = (updater) => setGameState(prev => ({ ...prev, players: typeof updater === 'function' ? updater(prev.players) : updater }));
  const setProperties = (updater) => setGameState(prev => ({ ...prev, properties: typeof updater === 'function' ? updater(prev.properties) : updater }));
  const setBank = (updater) => setGameState(prev => ({ ...prev, bank: typeof updater === 'function' ? updater(prev.bank) : updater }));
  const setPhase = (updater) => setGameState(prev => ({ ...prev, phase: typeof updater === 'function' ? updater(prev.phase) : updater }));

  const [tradeState, setTradeState] = useState(null);
  const [selectorTarget, setSelectorTarget] = useState(null);
  const [auctionState, setAuctionState] = useState(null);
  const [doublesCount, setDoublesCount] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [floatingLogs, setFloatingLogs] = useState([]);
  const [transferModal, setTransferModal] = useState(null); // { from, to, amount, description }
  const [manageModal, setManageModal] = useState(false);
  const [loanModal, setLoanModal] = useState(false);
  const [bankruptcyModal, setBankruptcyModal] = useState(false);
  const [bankruptcyPlayerId, setBankruptcyPlayerId] = useState(null);
  const [pendingManage, setPendingManage] = useState({ propId: null, action: null });
  const [loanDraft, setLoanDraft] = useState({ takeAmount: '', repayAmount: '' });
  const [playerDescriptionModal, setPlayerDescriptionModal] = useState(false);
  const [selectedPlayerForDescriptionId, setSelectedPlayerForDescriptionId] = useState(null);
  const [nameModal, setNameModal] = useState(false);
  const [customNames, setCustomNames] = useState(['', '', '', '']);

  useEffect(() => {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js');
  }, []);

  useEffect(() => {
    if (floatingLogs.length > 0) {
      const timer = setTimeout(() => {
        setFloatingLogs(prev => prev.filter(log => Date.now() - log.id < 3000));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [floatingLogs]);

  const addLog = (msg, playerId = null) => {
    const pid = playerId || players[turn]?.id;
    setFloatingLogs(prev => [...prev, { id: Date.now(), text: msg, playerId: pid }]);
  };

  // Show a centred transfer popup for 2 seconds.
  // from/to: { name, color } | 'BANK'
  const showTransfer = (from, to, amount, description = '') => {
    setTransferModal({ from, to, amount, description, id: Date.now() });
    setTimeout(() => setTransferModal(null), 2000);
  };

  const activePlayer = players[turn] || {};
  const selectedPlayerForDescription = players.find(player => player.id === selectedPlayerForDescriptionId) || null;

  const getPlayerPropertyWorth = (playerId) => {
    return Object.entries(properties).reduce((sum, [propId, propState]) => {
      if (propState.ownerId !== playerId || propState.mortgaged) return sum;
      const tile = BOARD_DATA[Number(propId)];
      if (!tile?.price) return sum;
      return sum + tile.price;
    }, 0);
  };

  const getOutstandingLoan = (player) => Math.floor(player?.loan?.principal || 0);

  const getLoanLimit = (player) => {
    if (!player?.id) return 0;
    const propertyWorth = getPlayerPropertyWorth(player.id);
    const weighted = (propertyWorth * LOAN_PROPERTY_WEIGHT) + (player.money * LOAN_BALANCE_WEIGHT);
    return Math.max(0, Math.floor(weighted));
  };

  const getAvailableLoan = (player) => {
    const limit = getLoanLimit(player);
    const outstanding = getOutstandingLoan(player);
    return Math.max(0, limit - outstanding);
  };

  const getPlayerMortgageableProperties = (playerId) => {
    return Object.entries(properties).filter(([id, p]) => {
      if (p.ownerId !== playerId) return false;
      const tile = BOARD_DATA[id];
      return !p.mortgaged || (tile.type === 'property' && (p.houses > 0 || p.hotel));
    }).length;
  };

  const outstandingLoan = getOutstandingLoan(activePlayer);
  const availableLoanAmount = getAvailableLoan(activePlayer);
  const takeSliderValue = Math.min(availableLoanAmount, Math.max(0, parseInt(loanDraft.takeAmount, 10) || 0));
  const projectedOutstandingLoan = outstandingLoan + takeSliderValue;
  const projectedMoneyAfterTake = (activePlayer.money || 0) + takeSliderValue;
  const maxRepayAmount = Math.min(projectedMoneyAfterTake, projectedOutstandingLoan);
  const repaySliderValue = Math.min(maxRepayAmount, Math.max(0, parseInt(loanDraft.repayAmount, 10) || 0));
  const nextTurnLoanTotal = Math.ceil(projectedOutstandingLoan * (1 + LOAN_RATE_PER_TURN));

  const selectedPlayerOwnedProperties = selectedPlayerForDescription
    ? Object.entries(properties).filter(([, propertyState]) => propertyState.ownerId === selectedPlayerForDescription.id)
    : [];
  const selectedPlayerOutstandingLoan = getOutstandingLoan(selectedPlayerForDescription);
  const selectedPlayerNextTurnLoanTotal = Math.ceil(selectedPlayerOutstandingLoan * (1 + LOAN_RATE_PER_TURN));
  const selectedPlayerLoanInterestNextTurn = Math.max(0, selectedPlayerNextTurnLoanTotal - selectedPlayerOutstandingLoan);

  const releaseExpiredMortgagesOnRoll = (playerId) => {
    const expired = Object.entries(properties).filter(([propId, propState]) => (
      propState.ownerId === playerId &&
      propState.mortgaged &&
      (propState.mortgageTurns || 0) >= 3
    ));

    if (expired.length === 0) return;

    setProperties(prev => {
      const updated = { ...prev };
      expired.forEach(([propId]) => { delete updated[propId]; });
      return updated;
    });

    expired.forEach(([propId]) => {
      const tile = BOARD_DATA[Number(propId)];
      addLog(`${tile?.name || 'Property'} became public`, playerId);
    });
  };

  useEffect(() => {
    if (phase !== 'ROLL' || !activePlayer?.id) return;

    const mortgagedForPlayer = Object.entries(properties).filter(([, propState]) => (
      propState.ownerId === activePlayer.id && propState.mortgaged
    ));

    if (mortgagedForPlayer.length === 0) return;

    const secondTurnNames = [];
    const thirdTurnNames = [];

    mortgagedForPlayer.forEach(([propId, propState]) => {
      const nextTurnCount = (propState.mortgageTurns || 0) + 1;
      const tileName = BOARD_DATA[Number(propId)]?.name || 'Property';
      if (nextTurnCount === 2) secondTurnNames.push(tileName);
      if (nextTurnCount >= 3) thirdTurnNames.push(tileName);
    });

    setProperties(prev => {
      const updated = { ...prev };
      Object.entries(updated).forEach(([propId, propState]) => {
        if (propState.ownerId === activePlayer.id && propState.mortgaged) {
          updated[propId] = { ...propState, mortgageTurns: (propState.mortgageTurns || 0) + 1 };
        }
      });
      return updated;
    });

    if (secondTurnNames.length > 0) addLog(`Mortgage warning (${secondTurnNames.join(', ')})`, activePlayer.id);
    if (thirdTurnNames.length > 0) addLog(`Final warning (${thirdTurnNames.join(', ')})`, activePlayer.id);
  }, [turnSerial, phase]);

  useEffect(() => {
    if (phase !== 'ROLL' || !activePlayer?.id) return;
    if (activePlayer.money < 0) {
      setBankruptcyPlayerId(activePlayer.id);
      setBankruptcyModal(true);
      if (activePlayer.isBot) setTimeout(() => declareBankruptcy(), 1000);
    }
  }, [turnSerial, phase, activePlayer?.money, activePlayer?.id]);

  const accrueLoanInterestForRoll = (playerId) => {
    const playerRecord = players.find(p => p.id === playerId);
    const principal = playerRecord?.loan?.principal || 0;
    if (principal <= 0) return;

    const nextPrincipal = Math.ceil(principal * (1 + LOAN_RATE_PER_TURN));
    const interestAdded = nextPrincipal - principal;

    setPlayers(prev => {
      const up = [...prev];
      const idx = up.findIndex(p => p.id === playerId);
      if (idx === -1) return up;
      const currentLoan = up[idx].loan || { principal: 0, ratePerTurn: LOAN_RATE_PER_TURN, turnsAccrued: 0 };
      up[idx].loan = { ...currentLoan, principal: nextPrincipal, ratePerTurn: LOAN_RATE_PER_TURN, turnsAccrued: (currentLoan.turnsAccrued || 0) + 1 };
      return up;
    });
    showTransfer({ name: player.name, color: player.color }, 'BANK', interestAdded, 'Loan Interest');
  };

  const takeLoan = () => {
    const amount = Math.max(0, parseInt(loanDraft.takeAmount, 10) || 0);
    if (!amount) return addLog('Enter a valid amount', activePlayer.id);
    const available = getAvailableLoan(activePlayer);
    if (amount > available) return addLog(`Max loan: Rs. ${available}`, activePlayer.id);

    setPlayers(prev => {
      const up = [...prev];
      const idx = up.findIndex(p => p.id === activePlayer.id);
      if (idx === -1) return up;
      const currentLoan = up[idx].loan || { principal: 0, ratePerTurn: LOAN_RATE_PER_TURN, turnsAccrued: 0 };
      up[idx].money += amount;
      up[idx].loan = { ...currentLoan, principal: (currentLoan.principal || 0) + amount, ratePerTurn: LOAN_RATE_PER_TURN };
      return up;
    });

    setLoanDraft(prev => ({ ...prev, takeAmount: '' }));
    showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, amount, 'Loan Taken');
  };

  const repayLoan = () => {
    const amount = Math.max(0, parseInt(loanDraft.repayAmount, 10) || 0);
    if (!amount) return addLog('Enter a valid amount', activePlayer.id);
    const outstanding = getOutstandingLoan(activePlayer);
    if (outstanding <= 0) return addLog('No active loan', activePlayer.id);
    if (activePlayer.money < amount) return addLog('Not enough money', activePlayer.id);
    const payment = Math.min(amount, outstanding);

    setPlayers(prev => {
      const up = [...prev];
      const idx = up.findIndex(p => p.id === activePlayer.id);
      if (idx === -1) return up;
      const currentLoan = up[idx].loan || { principal: 0, ratePerTurn: LOAN_RATE_PER_TURN, turnsAccrued: 0 };
      up[idx].money -= payment;
      up[idx].loan = { ...currentLoan, principal: Math.max(0, (currentLoan.principal || 0) - payment), ratePerTurn: LOAN_RATE_PER_TURN };
      return up;
    });

    setLoanDraft(prev => ({ ...prev, repayAmount: '' }));
    showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', payment, 'Loan Repayment');
  };

  const checkBankruptcy = (playerId, newMoney) => {
    if (newMoney < 0) {
      setBankruptcyPlayerId(playerId);
      setBankruptcyModal(true);
      return true;
    }
    return false;
  };

  const movePlayerStepByStep = async (steps, triggerAction = true) => {
    setPhase('MOVE');
    await new Promise(r => setTimeout(r, 500));
    let currentSteps = 0;
    let passedGo = false;
    const moveOneStep = () => {
      return new Promise((resolve) => {
        setPlayers(prev => {
          const up = [...prev];
          const pIndex = up.findIndex(p => p.id === activePlayer.id);
          if (pIndex === -1) return up;
          const newPos = (up[pIndex].position + 1) % 40;
          up[pIndex].position = newPos;
          if (window.gsap) window.gsap.fromTo(`#pawn-${up[pIndex].id}`, { y: 0 }, { y: -20, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.out" });
          if (newPos === 0 && triggerAction && !passedGo) {
            passedGo = true;
            up[pIndex].money += 2000;
            showTransfer('BANK', { name: up[pIndex].name, color: up[pIndex].color }, 2000, 'Passed GO!');
          }
          return up;
        });
        setTimeout(resolve, 300);
      });
    };
    while (currentSteps < steps) { await moveOneStep(); currentSteps++; }
    if (triggerAction) {
      setTimeout(() => { const upPlayer = players.find(p => p.id === activePlayer.id); if (upPlayer) handleLanding(upPlayer.position); }, 500);
    }
  };

  const jumpToJail = () => {
    setPlayers(prev => {
      const up = [...prev];
      const pIdx = up.findIndex(p => p.id === activePlayer.id);
      if (pIdx > -1) { up[pIdx].position = 10; up[pIdx].inJail = true; up[pIdx].jailTurns = 0; }
      return up;
    });
    setPhase('MANAGE');
  };

  const payJailFine = () => {
    if (activePlayer.money >= 500) {
      payBank(500, "Jail Fine");
      setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === activePlayer.id); if (idx > -1) { up[idx].inJail = false; up[idx].jailTurns = 0; } return up; });
      addLog(`Paid fine to escape!`, activePlayer.id);
    } else addLog(`Not enough money!`, activePlayer.id);
  };

  const useJailCard = () => {
    if (activePlayer.getOutOfJailFree > 0) {
      setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === activePlayer.id); if (idx > -1) { up[idx].inJail = false; up[idx].jailTurns = 0; up[idx].getOutOfJailFree -= 1; } return up; });
      addLog(`Used Jail Card!`, activePlayer.id);
    }
  };

  const checkAndCloseBankruptcyModal = () => {
    if (bankruptcyModal && activePlayer?.money >= 0) {
      setBankruptcyModal(false);
      setBankruptcyPlayerId(null);
      addLog(`Balance recovered!`, activePlayer.id);
    }
  };

  const rollDice = () => {
    if (bankruptcyModal && activePlayer?.money < 0) return addLog("Resolve negative balance!", activePlayer.id);
    if (isRolling || phase !== 'ROLL') return;
    releaseExpiredMortgagesOnRoll(activePlayer.id);
    setIsRolling(true);
    setTimeout(() => {
      accrueLoanInterestForRoll(activePlayer.id);
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const isDouble = d1 === d2;
      setGameState(prev => ({ ...prev, dice: [d1, d2] }));
      setIsRolling(false);
      addLog(`Rolled ${d1 + d2}`, activePlayer.id);
      if (activePlayer.inJail) {
        if (isDouble) {
          addLog(`Escaped Jail!`, activePlayer.id);
          setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === activePlayer.id); if (idx > -1) { up[idx].inJail = false; up[idx].jailTurns = 0; } return up; });
          movePlayerStepByStep(d1 + d2);
        } else {
          const newTurns = (activePlayer.jailTurns || 0) + 1;
          if (newTurns >= 3) {
            addLog(`Paid ₹500 fine.`, activePlayer.id);
            payBank(500, "Jail Fine");
            setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === activePlayer.id); if (idx > -1) { up[idx].inJail = false; up[idx].jailTurns = 0; } return up; });
            movePlayerStepByStep(d1 + d2);
          } else {
            addLog(`Stay in jail (${newTurns})`, activePlayer.id);
            setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === activePlayer.id); if (idx > -1) up[idx].jailTurns = newTurns; return up; });
            setPhase('MANAGE');
          }
        }
        return;
      }
      movePlayerStepByStep(d1 + d2);
    }, 500);
  };

  const handleLanding = (posId) => {
    const tile = BOARD_DATA[posId];
    const ownership = properties[posId];
    if (tile.type === 'property' || tile.type === 'railway' || tile.type === 'utility') {
      if (!ownership) setPhase('ACTION_BUY');
      else if (ownership.ownerId !== activePlayer.id) {
        if (ownership.mortgaged) { addLog(`Property mortgaged.`, activePlayer.id); setPhase('MANAGE'); }
        else { payRentAction(); }
      }
      else setPhase('MANAGE');
    }
    else if (tile.type === 'chance' || tile.type === 'chest') {
      const deck = tile.type === 'chance' ? CARDS.CHANCE : CARDS.CHEST;
      const card = deck[Math.floor(Math.random() * deck.length)];
      setActiveCard({ type: tile.type.toUpperCase(), ...card });
      setPhase('ACTION_CARD');
    }
    else if (tile.type === 'tax') { payBank(tile.amount, tile.name); setPhase('MANAGE'); }
    else if (tile.id === 20) {
      const parkingReward = bank?.parking || createParkingReward();
      const nextParkingReward = createParkingReward();
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += parkingReward.amount; return up; });
      setBank(prev => ({ ...prev, parking: nextParkingReward }));
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, parkingReward.amount, `Free Parking Bonus${parkingReward.multiplier > 1 ? ` (x${parkingReward.multiplier})` : ''}`);
      setPhase('MANAGE');
    }
    else if (tile.id === 30) { addLog(`Sent to Jail!`, activePlayer.id); jumpToJail(); }
    else setPhase('MANAGE');
  };

  const buyProperty = () => {
    const tile = BOARD_DATA[activePlayer.position];
    if (activePlayer.money >= tile.price) {
      setPlayers(prev => { const upP = [...prev]; const idx = upP.findIndex(p => p.id === activePlayer.id); if (idx > -1) upP[idx].money -= tile.price; return upP; });
      setProperties(prev => ({ ...prev, [tile.id]: { ownerId: activePlayer.id, houses: 0, hotel: false, mortgaged: false, mortgageTurns: 0 } }));
      showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', tile.price, `Bought ${tile.name}`);
      setPhase('MANAGE');
    } else { addLog(`No funds!`, activePlayer.id); setPhase('MANAGE'); }
  };

  const startAuction = () => {
    const tile = BOARD_DATA[activePlayer.position];
    setAuctionState({ propertyId: tile.id, bidders: players.map(p => p.id), targetBid: Math.max(10, Math.floor(tile.price * 0.1)), highestBid: 0, highestBidderId: null, currentBidderIndex: 0 });
    setPhase('ACTION_AUCTION');
  };

  const finalizeAuction = (state, winnerId, amount) => {
    const winnerObj = players.find(p => p.id === winnerId);
    if (winnerObj && winnerObj.money >= amount) {
      setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === winnerId); if (idx > -1) up[idx].money -= amount; return up; });
      setProperties(prev => ({ ...prev, [state.propertyId]: { ownerId: winnerId, houses: 0, hotel: false, mortgaged: false, mortgageTurns: 0 } }));
      showTransfer({ name: winnerObj.name, color: winnerObj.color }, 'BANK', amount, `Auction Win: ${BOARD_DATA[state.propertyId].name}`);
    } else addLog("Auction failed.");
    setPhase('MANAGE');
    setAuctionState(null);
  };

  const placeBid = (overrideBid = null) => {
    if (!auctionState) return;
    const currentId = auctionState.bidders[auctionState.currentBidderIndex];
    const currentBiderObj = players.find(p => p.id === currentId);
    const bid = typeof overrideBid === 'number' ? overrideBid : auctionState.targetBid;
    if (bid <= auctionState.highestBid && auctionState.highestBid > 0) return addLog("Bid too low", currentId);
    if (currentBiderObj.money < bid) return addLog("Not enough money", currentId);
    if (auctionState.bidders.length === 1) return finalizeAuction(auctionState, currentId, bid);
    const nextIndex = (auctionState.currentBidderIndex + 1) % auctionState.bidders.length;
    setAuctionState(prev => ({ ...prev, highestBid: bid, highestBidderId: currentId, targetBid: bid + 10, currentBidderIndex: nextIndex }));
    addLog(`Bids ₹${bid}`, currentId);
  };

  const foldAuction = () => {
    if (!auctionState) return;
    const currentId = auctionState.bidders[auctionState.currentBidderIndex];
    addLog(`Folds`, currentId);
    const newBidders = auctionState.bidders.filter(id => id !== currentId);
    if (newBidders.length === 1 && auctionState.highestBidderId === newBidders[0]) finalizeAuction(auctionState, newBidders[0], Math.max(10, auctionState.highestBid));
    else if (newBidders.length === 0) { addLog("Everyone folded."); setPhase('MANAGE'); setAuctionState(null); }
    else { const nextIndex = auctionState.currentBidderIndex % newBidders.length; setAuctionState(prev => ({ ...prev, bidders: newBidders, currentBidderIndex: nextIndex })); }
  };

  const payRentAction = () => {
    const tile = BOARD_DATA[activePlayer.position];
    const ownership = properties[tile.id];
    const ownerIdx = players.findIndex(p => p.id === ownership.ownerId);
    const owner = players[ownerIdx];
    if (!owner) return setPhase('MANAGE');
    const amount = calculateRent(tile, ownership);
    setPlayers(prev => {
      const up = [...prev];
      const turnIdx = up.findIndex(p => p.id === activePlayer.id);
      if (up[turnIdx]) up[turnIdx].money -= amount;
      if (up[ownerIdx]) up[ownerIdx].money += amount;
      return up;
    });
    showTransfer(
      { name: activePlayer.name, color: activePlayer.color },
      { name: owner.name, color: owner.color },
      amount,
      `Rent — ${tile.name}`
    );
    if (!checkBankruptcy(activePlayer.id, activePlayer.money - amount)) setPhase('MANAGE');
  };

  const payBank = (amt, reason = '') => {
    setPlayers(prev => { const up = [...prev]; const turnIdx = up.findIndex(p => p.id === activePlayer.id); if (up[turnIdx]) up[turnIdx].money -= amt; return up; });
    showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', amt, reason);
    checkBankruptcy(activePlayer.id, activePlayer.money - amt);
  };

  const applyCard = () => {
    const res = activeCard.action(activePlayer);
    const cardText = activeCard.text;
    setActiveCard(null);
    if (res.type === 'RECEIVE_BANK') {
      setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === activePlayer.id); up[idx].money += res.amount; return up; });
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, res.amount, cardText);
      setPhase('MANAGE');
    }
    else if (res.type === 'PAY_BANK') { payBank(res.amount, cardText); setPhase('MANAGE'); }
    else if (res.type === 'MOVE_TO') { const dist = (res.pos >= activePlayer.position) ? res.pos - activePlayer.position : (40 - activePlayer.position) + res.pos; movePlayerStepByStep(dist, true); }
    else if (res.type === 'GOTO_JAIL') jumpToJail();
    else if (res.type === 'GET_OUT_OF_JAIL_FREE') { setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === activePlayer.id); if (up[idx]) up[idx].getOutOfJailFree = (up[idx].getOutOfJailFree || 0) + 1; return up; }); setPhase('MANAGE'); }
  };

  const endTurn = () => {
    setDoublesCount(0);
    setGameState(prev => ({ ...prev, currentTurn: (prev.currentTurn + 1) % prev.players.length, turnSerial: (prev.turnSerial || 0) + 1, phase: 'ROLL' }));
  };

  const executeTrade = () => {
    if (!tradeState || !tradeState.targetPlayerId) return;
    const { targetPlayerId, myOffer, theirOffer } = tradeState;
    const p1Id = activePlayer.id;
    const p2Id = targetPlayerId;
    setPlayers(prev => {
      let up = [...prev];
      let p1 = up.find(p => p.id === p1Id);
      let p2 = up.find(p => p.id === p2Id);
      if (p1 && p2) {
        p1.money = p1.money - myOffer.cash + theirOffer.cash;
        p2.money = p2.money - theirOffer.cash + myOffer.cash;
      }
      return up;
    });
    setProperties(prev => {
      let up = { ...prev };
      myOffer.properties.forEach(pid => { if (up[pid]) up[pid].ownerId = p2Id; });
      theirOffer.properties.forEach(pid => { if (up[pid]) up[pid].ownerId = p1Id; });
      return up;
    });
    addLog(`Trade successful!`, p1Id);
    setTradeState(null);
  };

  const toggleMortgage = (propId) => {
    const prop = properties[propId];
    const tile = BOARD_DATA[propId];
    if (prop.houses > 0 || prop.hotel) return addLog("Sell houses first!", activePlayer.id);
    if (!prop.mortgaged) {
      setProperties(prev => ({ ...prev, [propId]: { ...prop, mortgaged: true, mortgageTurns: 0 } }));
      setPlayers(prev => { const up = [...prev]; const turnIdx = up.findIndex(p => p.id === activePlayer.id); if (up[turnIdx]) up[turnIdx].money += tile.mortgage; return up; });
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, tile.mortgage, `Mortgaged ${tile.name}`);
      checkAndCloseBankruptcyModal();
    } else {
      const cost = Math.floor(tile.mortgage * 1.1);
      if (activePlayer.money >= cost) {
        setProperties(prev => ({ ...prev, [propId]: { ...prop, mortgaged: false, mortgageTurns: 0 } }));
        setPlayers(prev => { const up = [...prev]; const turnIdx = up.findIndex(p => p.id === activePlayer.id); if (up[turnIdx]) up[turnIdx].money -= cost; return up; });
        showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', cost, `Redeemed ${tile.name}`);
        checkAndCloseBankruptcyModal();
      } else addLog("No funds!", activePlayer.id);
    }
  };

  const sellHouse = (propId) => {
    const prop = properties[propId];
    const tile = BOARD_DATA[propId];
    if (prop.hotel) {
      setProperties(prev => ({ ...prev, [propId]: { ...prop, hotel: false, houses: 4 } }));
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += tile.houseCost / 2; return up; });
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, tile.houseCost / 2, `Sold HOTEL (${tile.name})`);
    } else if (prop.houses > 0) {
      setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: prop.houses - 1 } }));
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += tile.houseCost / 2; return up; });
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, tile.houseCost / 2, `Sold House (${tile.name})`);
    } else {
      setProperties(prev => { const up = { ...prev }; delete up[propId]; return up; });
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += tile.price / 2; return up; });
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, tile.price / 2, `Sold ${tile.name}`);
    }
    checkAndCloseBankruptcyModal();
  };

  const buildHouse = (propId) => {
    const prop = properties[propId];
    const tile = BOARD_DATA[propId];
    const groupProps = BOARD_DATA.filter(t => t.group === tile.group);
    const ownsAll = groupProps.every(t => properties[t.id]?.ownerId === activePlayer.id);
    if (!ownsAll) return addLog("Need full set!", activePlayer.id);
    if (prop.mortgaged) return addLog("Property mortgaged.", activePlayer.id);
    const anyMortgaged = groupProps.some(t => properties[t.id]?.mortgaged);
    if (anyMortgaged) return addLog("Redeem all first!", activePlayer.id);
    if (activePlayer.money >= tile.houseCost) {
      if (prop.houses < 4 && !prop.hotel) {
        setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: prop.houses + 1 } }));
        setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money -= tile.houseCost; return up; });
        showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', tile.houseCost, `Built House (${tile.name})`);
      } else if (prop.houses === 4 && !prop.hotel) {
        setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: 0, hotel: true } }));
        setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money -= tile.houseCost; return up; });
        showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', tile.houseCost, `Built HOTEL (${tile.name})`);
      }
    } else addLog("No funds!", activePlayer.id);
  };

  const confirmManage = (propId) => {
    if (!pendingManage.propId || pendingManage.propId !== propId || !pendingManage.action) return addLog('Select an action first', activePlayer.id);
    const action = pendingManage.action;
    setPendingManage({ propId: null, action: null });
    if (action === 'build') buildHouse(propId);
    else if (action === 'sell') sellHouse(propId);
    else if (action === 'mortgage') toggleMortgage(propId);
    setTimeout(checkAndCloseBankruptcyModal, 50);
  };

  const declareBankruptcy = () => {
    if (!bankruptcyPlayerId) return;
    const playerName = players.find(p => p.id === bankruptcyPlayerId)?.name || 'Player';
    addLog(`${playerName} is BANKRUPT!`, null);
    const newPlayersList = players.filter(p => p.id !== bankruptcyPlayerId);
    setPlayers(newPlayersList);
    setProperties(prev => {
      const up = { ...prev };
      Object.entries(up).forEach(([propId, propState]) => { if (propState.ownerId === bankruptcyPlayerId) delete up[propId]; });
      return up;
    });
    setBankruptcyModal(false);
    setBankruptcyPlayerId(null);
    if (newPlayersList.length <= 1) setPhase('GAME_OVER');
    else {
      const newTurn = Math.min(turn, newPlayersList.length - 1);
      setGameState(prev => ({ ...prev, currentTurn: newTurn, phase: 'ROLL' }));
    }
  };

  const quitPlayer = (playerId) => {
    if (!playerId) return;
    const playerName = players.find(p => p.id === playerId)?.name || 'Player';
    addLog(`${playerName} has quit the game!`, null);
    const newPlayersList = players.filter(p => p.id !== playerId);
    setPlayers(newPlayersList);
    setProperties(prev => {
      const up = { ...prev };
      Object.entries(up).forEach(([propId, propState]) => { if (propState.ownerId === playerId) delete up[propId]; });
      return up;
    });
    setPlayerDescriptionModal(false);
    setSelectedPlayerForDescriptionId(null);
    if (newPlayersList.length <= 1) setPhase('GAME_OVER');
    else {
      const newTurn = Math.min(turn, newPlayersList.length - 1);
      setGameState(prev => ({ ...prev, currentTurn: newTurn, phase: 'ROLL' }));
    }
  };

  const calculateRent = (tile, ownership) => {
    if (ownership.mortgaged) return 0;
    if (tile.type === 'railway') {
      const ownedTrains = BOARD_DATA.filter(t => t.type === 'railway' && properties[t.id]?.ownerId === ownership.ownerId).length;
      return tile.rent[Math.max(0, ownedTrains - 1)] || tile.rent[0];
    }
    if (tile.type === 'utility') {
      const ownedUtils = BOARD_DATA.filter(t => t.type === 'utility' && properties[t.id]?.ownerId === ownership.ownerId).length;
      const rollSum = dice[0] + dice[1];
      return ownedUtils === 2 ? rollSum * 100 : rollSum * 40;
    }
    if (ownership.hotel) return tile.rent[5];
    if (ownership.houses > 0) return tile.rent[ownership.houses];
    const groupProps = BOARD_DATA.filter(t => t.group === tile.group);
    const ownsAll = groupProps.every(t => properties[t.id]?.ownerId === ownership.ownerId);
    return ownsAll ? tile.rent[0] * 2 : tile.rent[0];
  };

  // --- BOT AI AUTOMATION ---
  useEffect(() => {
    if (activePlayer.isBot && phase === 'ROLL' && !isRolling) {
      if (activePlayer.inJail) {
        if (activePlayer.getOutOfJailFree > 0) setTimeout(useJailCard, 1000);
        else if (activePlayer.jailTurns >= 2 && activePlayer.money > 1000) setTimeout(payJailFine, 1000);
        else setTimeout(rollDice, 1500);
      } else setTimeout(rollDice, 1500);
    } else if (activePlayer.isBot && phase === 'ACTION_BUY') {
      setTimeout(() => {
        const tile = BOARD_DATA[activePlayer.position];
        if (activePlayer.money > tile.price + 1500) buyProperty();
        else startAuction();
      }, 1500);
    } else if (activePlayer.isBot && phase === 'ACTION_CARD') {
      setTimeout(applyCard, 1500);
    } else if (activePlayer.isBot && (phase === 'MANAGE' || phase === 'END')) {
      setTimeout(endTurn, 1000);
    }
  }, [phase, turn, activePlayer.isBot, isRolling]);

  useEffect(() => {
    if (phase === 'ACTION_AUCTION' && auctionState) {
      const currentId = auctionState.bidders[auctionState.currentBidderIndex];
      const currentPlayerObj = players.find(p => p.id === currentId);
      if (!currentPlayerObj) return;
      const nextBid = Math.max(auctionState.highestBid + 10, 10);
      if (currentPlayerObj.money < nextBid) {
        const timer = setTimeout(() => { foldAuction(); }, 500);
        return () => clearTimeout(timer);
      }
      if (currentPlayerObj.isBot) {
        const timer = setTimeout(() => {
          const tile = BOARD_DATA[auctionState.propertyId];
          const maxWillingToPay = tile.price * 1.2;
          if (nextBid > maxWillingToPay || currentPlayerObj.money < nextBid + 500) foldAuction();
          else placeBid(nextBid);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, auctionState, players]);

  // --- SETUP SCREEN ---
  if (appState === 'setup') {
    return (
      <div className="setup-screen">
        <div className="setup-card">
          <h1 className="setup-title">VYAPARI</h1>
          <p className="setup-subtitle">Complete Indian Edition</p>
          <div className="setup-content">

            {/* STARTING MONEY INPUT */}
            <div className="setup-section">
              <span className="setup-label">Starting Money</span>
              <div className="money-input-row">
                <button
                  onClick={() => setStartingMoney(prev => Math.max(1500, prev - 500))}
                  className="money-input-btn"
                >
                  <Minus size={18} strokeWidth={3} />
                </button>
                <div className="money-display">
                  <span>₹{startingMoney.toLocaleString()}</span>
                  <input
                    type="range"
                    min="1500"
                    max="20000"
                    step="500"
                    value={startingMoney}
                    onChange={(e) => setStartingMoney(parseInt(e.target.value))}
                    className="money-range-input"
                  />
                </div>
                <button
                  onClick={() => setStartingMoney(prev => Math.min(20000, prev + 500))}
                  className="money-input-btn"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
              <p className="setup-hint" style={{ marginTop: '0.5rem' }}>Adjust range: 1.5K - 20K</p>
            </div>

            <div className="setup-section">
              <span className="setup-label">Game Mode</span>
              <div className="mode-row">
                <button onClick={() => setGameMode('bot')} className={`mode-btn ${gameMode === 'bot' ? 'active' : 'inactive'}`}>
                  <Bot size={20} /><span>Single Player</span>
                </button>
                <button onClick={() => setGameMode('multi')} className={`mode-btn ${gameMode === 'multi' ? 'active' : 'inactive'}`}>
                  <Users size={20} /><span>Multiplayer</span>
                </button>
              </div>
            </div>

            <div className="setup-section">
              <span className="setup-label">Total Players</span>
              <div className="player-count-row">
                {[2, 3, 4].map(n => (
                  <button key={n} onClick={() => setPlayerCount(n)} className={`count-btn ${playerCount === n ? 'active' : 'inactive'}`}>{n}</button>
                ))}
              </div>
              <button
                onClick={() => setNameModal(true)}
                style={{
                  marginTop: '1rem',
                  width: '100%',
                  backgroundColor: '#f1f5f9',
                  color: '#2563eb',
                  padding: '0.75rem',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '0.75rem',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <User size={18} /> Add Player Name
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];
              setGameState({
                players: Array.from({ length: playerCount }).map((_, i) => ({
                  id: i + 1,
                  name: customNames[i] || (gameMode === 'bot' && i > 0 ? `Bot ${i + 1}` : `Player ${i + 1}`),
                  color: colors[i],
                  money: startingMoney,
                  position: 0,
                  isBot: gameMode === 'bot' && i > 0,
                  inJail: false,
                  jailTurns: 0,
                  getOutOfJailFree: 0,
                  loan: { principal: 0, ratePerTurn: LOAN_RATE_PER_TURN, turnsAccrued: 0 }
                })),
                properties: {},
                bank: { houses: 32, hotels: 12, parking: createParkingReward() },
                currentTurn: 0,
                turnSerial: 0,
                phase: 'ROLL',
                dice: [1, 1]
              });
              setDoublesCount(0);
              setActiveCard(null);
              setSelectedTile(null);
              setFloatingLogs([]);
              setAppState('game');
            }}
            className="start-btn"
          >
            <Play size={24} /> START GAME
          </button>
        </div>

        {nameModal && (
          <div className="overlay-backdrop" style={{ zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-card animate-in" style={{ maxWidth: '420px', width: '90%', padding: '2rem' }}>
              <div className="modal-header" style={{ marginBottom: '1.5rem' }}>
                <h2 className="modal-title blue" style={{ fontSize: '1.5rem' }}>Players Names</h2>
                <button onClick={() => setNameModal(false)} className="modal-close-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                {Array.from({ length: playerCount }).map((_, i) => {
                  const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500'];
                  const colorHex = {
                    'bg-red-500': '#ef4444',
                    'bg-blue-500': '#3b82f6',
                    'bg-yellow-500': '#eab308',
                    'bg-green-500': '#22c55e'
                  };
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: colorHex[colors[i]],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${colorHex[colors[i]]}44`,
                        flexShrink: 0
                      }}>
                        <PawnIcon colorClass={colors[i]} size="w-7 h-7" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          placeholder={gameMode === 'bot' && i > 0 ? `Bot ${i} Name` : `Player ${i + 1} Name`}
                          value={customNames[i]}
                          onChange={(e) => {
                            const updated = [...customNames];
                            updated[i] = e.target.value;
                            setCustomNames(updated);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.5rem 0',
                            border: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#1e293b',
                            outline: 'none',
                            borderBottom: '2px solid #e2e8f0',
                            transition: 'border-color 0.2s'
                          }}
                          onFocus={(e) => e.target.style.borderBottomColor = '#3b82f6'}
                          onBlur={(e) => e.target.style.borderBottomColor = '#e2e8f0'}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setNameModal(false)}
                style={{
                  width: '100%',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '1rem',
                  fontWeight: 900,
                  fontSize: '1rem',
                  letterSpacing: '0.05em',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(37,99,235,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                <Check size={20} /> CONFIRM NAMES
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- GAME OVER SCREEN ---
  if (phase === 'GAME_OVER') {
    const winner = players[0];
    return (
      <div className="game-over-screen">
        <div className="game-over-content">
          <div className="game-over-trophy">🏆</div>
          <h1 className="game-over-title">WINNER!</h1>
          {winner && <>
            <PawnIcon colorClass={winner.color} size="w-16 h-16" />
            <h2 className="game-over-name">{winner.name}</h2>
            <p className="game-over-money">₹{winner.money} remaining</p>
          </>}
          <button
            onClick={() => {
              setAppState('setup');
              setGameState({ players: [], properties: {}, bank: { houses: 32, hotels: 12, parking: createParkingReward() }, currentTurn: 0, turnSerial: 0, phase: 'ROLL', dice: [1, 1] });
            }}
            className="play-again-btn"
          >
            <RefreshCw size={24} /> PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      {/* TOP PLAYERS */}
      <div className="players-row">
        <div className="player-side">
          <DiceArea isActive={turn === 1} dice={dice} isRolling={isRolling} onRoll={rollDice} canRoll={turn === 1 && phase === 'ROLL'} />
          {players[1] && <PlayerCard player={players[1]} isActive={turn === 1} logs={floatingLogs} onClick={() => { setSelectedPlayerForDescriptionId(players[1].id); setPlayerDescriptionModal(true); }} />}
        </div>
        <div className="player-side">
          <DiceArea isActive={turn === 2} dice={dice} isRolling={isRolling} onRoll={rollDice} canRoll={turn === 2 && phase === 'ROLL'} />
          {players[2] && <PlayerCard player={players[2]} isActive={turn === 2} logs={floatingLogs} onClick={() => { setSelectedPlayerForDescriptionId(players[2].id); setPlayerDescriptionModal(true); }} />}
        </div>
      </div>

      {/* BOARD CONTAINER */}
      <div className="board-container">
        {BOARD_DATA.map((tile) => {
          const style = getGridStyle(tile.id);
          const isCorner = tile.id % 10 === 0;
          const isBottom = tile.id >= 1 && tile.id <= 9;
          const isLeft = tile.id >= 11 && tile.id <= 19;
          const isTop = tile.id >= 21 && tile.id <= 29;
          const isRight = tile.id >= 31 && tile.id <= 39;

          let bandClass = 'hidden';
          let contentClass = 'content-default';

          if (tile.group) {
            if (isBottom)      { bandClass = 'band-bottom'; contentClass = 'content-bottom'; }
            else if (isLeft)   { bandClass = 'band-left';   contentClass = 'content-left'; }
            else if (isTop)    { bandClass = 'band-top';    contentClass = 'content-top'; }
            else if (isRight)  { bandClass = 'band-right';  contentClass = 'content-right'; }
          }

          const owner = properties[tile.id] ? players.find(p => p.id === properties[tile.id].ownerId) : null;
          const propData = properties[tile.id];
          const occupants = players.filter(p => p.position === tile.id);
          const groupColor = getGroupColor(tile.group);

          const renderTileContent = () => {
            if (isCorner) {
              let rotateStyle = {};
              if (tile.id === 10) rotateStyle = { transform: 'rotate(45deg)' };
              if (tile.id === 20) rotateStyle = { transform: 'rotate(135deg)' };
              if (tile.id === 30) rotateStyle = { transform: 'rotate(-135deg)' };
              if (tile.id === 0)  rotateStyle = { transform: 'rotate(-45deg)' };

              return (
                <div className="tile-corner-content" style={rotateStyle}>
                  <span style={{ fontSize: 'clamp(10px, 2.5vw, 24px)', marginBottom: '1px' }}>{tile.icon || ''}</span>
                  <span className="tile-text-main">{tile.name}</span>
                  {tile.id === 20 && (
                    <span style={{ fontSize: 'clamp(5px, 1.7vw, 6px)', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
                      ₹{(bank?.parking?.amount || 500).toLocaleString()}
                    </span>
                  )}
                  {tile.price > 0 && <span className="tile-text-price">₹{tile.price}</span>}
                </div>
              );
            }

            if (isLeft || isRight) {
              return (
                <div className="tile-side-content">
                  {!groupColor && <span style={{ fontSize: 'clamp(8px, 2vw, 20px)', marginBottom: '2px', zIndex: 0 }}>{tile.icon || ''}</span>}
                  <span className="tile-text-small">{tile.name}</span>
                  {tile.price > 0 && <span style={{ fontSize: 'clamp(4px, 1.6vw, 5.5px)', fontWeight: 700, color: '#475569', zIndex: 10 }}>₹{tile.price}</span>}
                </div>
              );
            }

            if (isTop || isBottom) {
              const isB = isBottom;
              const leftText = isB ? tile.name : (tile.price > 0 ? `₹${tile.price}` : '');
              const rightText = isB ? (tile.price > 0 ? `₹${tile.price}` : '') : tile.name;

              return (
                <div className="tile-top-bottom-content">
                  {!groupColor && (tile.icon || tile.type === 'railway') && (
                    <div className="tile-icon-bg">
                      <span style={{ fontSize: 'clamp(12px, 3vw, 36px)' }}>{tile.icon || ''}</span>
                    </div>
                  )}

                  {leftText && (
                    <div className="tile-vertical-box">
                      <span
                        style={{ writingMode: 'vertical-rl', transform: isB ? 'rotate(180deg)' : 'none' }}
                        className={`tile-vertical-text${isB && rightText ? '' : ' text-slate-600'}`}
                        styles={{
                          writingMode: 'vertical-rl',
                          transform: isB ? 'rotate(180deg)' : 'none',
                          fontSize: 'clamp(4px, 1.8vw, 6.5px)',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          lineHeight: 1.25,
                          letterSpacing: '0.05em',
                          color: isB && rightText ? '#1e293b' : '#475569',
                          zIndex: 10,
                        }}
                      >
                        {leftText}
                      </span>
                    </div>
                  )}

                  {rightText && (
                    <div className="tile-vertical-box">
                      <span
                        style={{
                          writingMode: 'vertical-rl',
                          transform: isB ? 'rotate(180deg)' : 'none',
                          fontSize: 'clamp(4px, 1.8vw, 6.5px)',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          lineHeight: 1.25,
                          letterSpacing: '0.05em',
                          color: isB ? '#475569' : '#1e293b',
                          zIndex: 10,
                        }}
                      >
                        {rightText}
                      </span>
                    </div>
                  )}
                </div>
              );
            }
          };

          return (
            <div key={tile.id} className="board-tile" style={style} onClick={() => setSelectedTile(tile)}>

              {/* COLOR BAND */}
              {groupColor && (
                <div
                  className={`color-band ${bandClass}`}
                  style={{ backgroundColor: groupColor }}
                >
                  {propData?.houses > 0 && [...Array(propData.houses)].map((_, i) => <Home key={i} size={8} style={{ color: 'white', fill: 'white' }} />)}
                  {propData?.hotel && <Hotel size={14} style={{ color: 'black', fill: 'black' }} />}
                </div>
              )}

              {/* CONTENT CONTAINER */}
              <div className={contentClass}>
                {renderTileContent()}
              </div>

              {/* OVERLAYS */}
              {propData?.mortgaged && (
                <div className="mortgaged-overlay">Mortgaged</div>
              )}
              {owner && !isCorner && (
                <div className={`ownership-marker ${getOwnershipMarkerClass(tile.id)}`}>
                  <PawnIcon colorClass={owner.color} size="w-4 h-4" />
                </div>
              )}

              {/* PAWNS */}
              <div className="pawn-grid-wrap">
                <div className="pawn-grid">
                  {occupants.map(p => (
                    <div key={p.id} className="pawn-cell">
                      <PawnIcon id={`pawn-${p.id}`} colorClass={p.color} size="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* --- BOARD CENTER AREA --- */}
        <div className="board-center">
          <div className="board-watermark"></div>

          <div className="board-center-inner">
            {/* 4 BUTTONS INSIDE THE BOARD */}
            <div className="board-action-buttons">
              <button onClick={() => setManageModal(true)} className="board-action-btn manage">
                <ShoppingCart className="icon" style={{ color: '#ef4444' }} />
                <span className="board-action-label">Manage</span>
              </button>
              <button onClick={() => {
                const targets = players.filter(p => p.id !== activePlayer.id && !p.isBot);
                if (targets.length > 0) setTradeState({ targetPlayerId: targets[0].id, myOffer: { cash: 0, properties: [] }, theirOffer: { cash: 0, properties: [] } });
                else addLog("No trade partners.");
              }} className="board-action-btn trade">
                <Repeat className="icon" style={{ color: '#3b82f6' }} />
                <span className="board-action-label">Trade</span>
              </button>
              <button onClick={() => activePlayer.isBot ? addLog('Wait for your turn') : (setLoanDraft({ takeAmount: '0', repayAmount: '0' }), setLoanModal(true))} className="board-action-btn loan">
                <Save className="icon" style={{ color: '#ca8a04' }} />
                <span className="board-action-label">Loan</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Quit game and return to menu?")) setAppState('setup');
                }}
                className="board-action-btn quit"
              >
                <LogOut className="icon icon-logout" />
                <span className="board-action-label">Quit</span>
              </button>
            </div>

            {/* BANKRUPTCY MODAL - INSIDE BOARD */}
            {bankruptcyModal && bankruptcyPlayerId && (
              <div className="bankruptcy-modal">
                <p className="bankruptcy-warning-label">Warning</p>
                <h2 className="bankruptcy-title">Balance Negative!</h2>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#475569', marginBottom: '0.5rem', fontWeight: 700 }}>
                  {players.find(p => p.id === bankruptcyPlayerId)?.name || 'Player'}
                </p>
                <p style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 900, color: '#dc2626', marginBottom: '0.75rem' }}>
                  ₹{players.find(p => p.id === bankruptcyPlayerId)?.money || 0}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', maxWidth: '150px', margin: '0 auto', gap: '0.375rem' }}>
                  {getPlayerMortgageableProperties(bankruptcyPlayerId) > 0 ? (
                    <button
                      onClick={() => setManageModal(true)}
                      style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
                    >
                      ⚙️ MANAGE
                    </button>
                  ) : (
                    <button
                      disabled
                      style={{ width: '100%', backgroundColor: '#94a3b8', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', border: 'none', cursor: 'not-allowed', opacity: 0.6 }}
                      title="No properties to mortgage or sell"
                    >
                      ⚙️ MANAGE
                    </button>
                  )}
                  <button
                    onClick={declareBankruptcy}
                    style={{ width: '100%', backgroundColor: '#ef4444', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
                  >
                    💔 BANKRUPT
                  </button>
                </div>
                {getPlayerMortgageableProperties(bankruptcyPlayerId) === 0 && (
                  <p style={{ textAlign: 'center', fontSize: '10px', color: '#ef4444', fontWeight: 700, marginTop: '0.5rem', textTransform: 'uppercase' }}>No properties available to manage</p>
                )}
              </div>
            )}

            {/* ACTION MODAL - INSIDE BOARD */}
            {(phase.startsWith('ACTION') || (phase === 'ROLL' && activePlayer.inJail && !activePlayer.isBot)) && activePlayer.position !== undefined && (
              <div className="action-modal">
                <p className="action-modal-header">Auction of</p>

                {phase === 'ROLL' && activePlayer.inJail && (
                  <>
                    <h2 className="jail-title">In Jail</h2>
                    <p className="jail-subtitle">{3 - (activePlayer.jailTurns || 0)} attempts left</p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', maxWidth: '150px', margin: '0 auto', gap: '0.375rem' }}>
                      <button onClick={rollDice} disabled={isRolling} style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 900, fontSize: '10px', border: 'none', cursor: 'pointer' }}>🎲 Roll Doubles</button>
                      <button onClick={payJailFine} disabled={activePlayer.money < 500} style={{ width: '100%', backgroundColor: activePlayer.money >= 500 ? '#ef4444' : '#94a3b8', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 900, fontSize: '10px', border: 'none', cursor: activePlayer.money >= 500 ? 'pointer' : 'not-allowed', opacity: activePlayer.money < 500 ? 0.5 : 1 }}>💸 Pay ₹500</button>
                      <button onClick={useJailCard} disabled={!activePlayer.getOutOfJailFree} style={{ width: '100%', backgroundColor: activePlayer.getOutOfJailFree > 0 ? '#f97316' : '#94a3b8', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', fontWeight: 900, fontSize: '10px', border: 'none', cursor: activePlayer.getOutOfJailFree > 0 ? 'pointer' : 'not-allowed', opacity: !activePlayer.getOutOfJailFree ? 0.5 : 1 }}>🎫 Use Card</button>
                    </div>
                  </>
                )}

                {phase === 'ACTION_BUY' && (
                  <>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 900, textAlign: 'center', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{BOARD_DATA[activePlayer.position].name}</h2>
                    <div style={{ backgroundColor: '#eff6ff', padding: '0.5rem', borderRadius: '1rem', textAlign: 'center', border: '2px solid #dbeafe', marginBottom: '0.75rem' }}>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Asking Price</span>
                      <p style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2563eb' }}>₹{BOARD_DATA[activePlayer.position].price}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={buyProperty} disabled={activePlayer.money < BOARD_DATA[activePlayer.position].price} style={{ flex: 1, color: 'white', padding: '0.5rem', borderRadius: '0.75rem', fontWeight: 900, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', border: 'none', cursor: activePlayer.money >= BOARD_DATA[activePlayer.position].price ? 'pointer' : 'not-allowed', backgroundColor: activePlayer.money >= BOARD_DATA[activePlayer.position].price ? '#22c55e' : '#94a3b8', opacity: activePlayer.money < BOARD_DATA[activePlayer.position].price ? 0.5 : 1 }}><Check size={14} /> BUY</button>
                      <button onClick={startAuction} style={{ flex: 1, backgroundColor: '#a855f7', color: 'white', padding: '0.5rem', borderRadius: '0.75rem', fontWeight: 900, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', border: 'none', cursor: 'pointer' }}>AUCTION</button>
                    </div>
                  </>
                )}

                {phase === 'ACTION_AUCTION' && auctionState && (
                  <div style={{ width: '100%', textAlign: 'left' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: 900, marginBottom: '0.25rem', textTransform: 'uppercase', textAlign: 'center', color: '#581c87', borderBottom: '2px solid #e9d5ff', paddingBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{BOARD_DATA[auctionState.propertyId].name}</h2>
                    <div className="auction-highest-box">
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 700, color: '#64748b' }}>Highest Bid</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#9333ea' }}>₹{auctionState.highestBid}</div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{auctionState.highestBidderId ? players.find(p => p.id === auctionState.highestBidderId)?.name : 'None'}</div>
                    </div>

                    <div className="auction-current-box">
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 700, color: '#94a3b8' }}>Current Bidder</span>
                      <div style={{ fontWeight: 900, fontSize: '0.875rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{players.find(p => p.id === auctionState.bidders[auctionState.currentBidderIndex])?.name}</div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a', marginTop: '0.125rem' }}>Wallet: ₹{players.find(p => p.id === auctionState.bidders[auctionState.currentBidderIndex])?.money}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(!players.find(p => p.id === auctionState.bidders[auctionState.currentBidderIndex])?.isBot) ? (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="auction-bid-input-wrap">
                              <span className="auction-currency-label">₹</span>
                              <input type="number" step="10" min={Math.max(10, auctionState.highestBid + 10)} max={players.find(p => p.id === auctionState.bidders[auctionState.currentBidderIndex])?.money || 0} value={auctionState.targetBid} onChange={e => setAuctionState({ ...auctionState, targetBid: parseInt(e.target.value) || 0 })} className="auction-input" />
                            </div>
                            <input type="range" step="10" min={Math.max(10, auctionState.highestBid + 10)} max={Math.max(Math.max(10, auctionState.highestBid + 10), players.find(p => p.id === auctionState.bidders[auctionState.currentBidderIndex])?.money || 0)} value={Math.max(Math.max(10, auctionState.highestBid + 10), auctionState.targetBid)} onChange={e => setAuctionState({ ...auctionState, targetBid: parseInt(e.target.value) || 0 })} className="auction-range" />
                          </div>
                          <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.5rem' }}>
                            <button onClick={() => placeBid()} style={{ flex: 1, backgroundColor: '#22c55e', color: 'white', fontWeight: 900, fontSize: '10px', padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>Bid</button>
                            <button onClick={foldAuction} style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', fontWeight: 900, fontSize: '10px', padding: '0.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>Fold</button>
                          </div>
                        </>
                      ) : (
                        <div className="bot-thinking">Bot is thinking...</div>
                      )}
                    </div>
                  </div>
                )}

                {phase === 'ACTION_CARD' && activeCard && (
                  <div className="card-modal-inner">
                    <div className="card-icon-wrap">
                      {activeCard.type === 'CHANCE' ? <HelpCircle size={48} style={{ margin: '0 auto', color: '#a855f7', display: 'block', marginBottom: '0.5rem' }} /> : <Briefcase size={48} style={{ margin: '0 auto', color: '#3b82f6', display: 'block', marginBottom: '0.5rem' }} />}
                      <h2 style={{ fontWeight: 900, fontSize: '1.5rem', textTransform: 'uppercase' }}>{activeCard.type}</h2>
                    </div>
                    <p className="card-text">"{activeCard.text}"</p>
                    <button onClick={applyCard} style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '1rem', borderRadius: '0.75rem', fontWeight: 900, fontSize: '1.125rem', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgb(0 0 0/0.1)' }}>CONTINUE</button>
                  </div>
                )}
              </div>
            )}

            {phase === 'MANAGE' && !activePlayer.isBot && (
              <div className="manage-phase-modal">
                <Building size={40} style={{ margin: '0 auto', color: '#facc15', marginBottom: '0.5rem' }} />
                <h3 style={{ fontWeight: 900, fontSize: '1.25rem', marginBottom: '0.25rem' }}>Property Control</h3>
                <button onClick={endTurn} style={{ width: '100%', backgroundColor: '#eab308', color: '#1e293b', padding: '0.5rem', borderRadius: '0.75rem', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>End Turn</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM PLAYERS */}
      <div className="players-row bottom">
        <div className="player-side">
          {players[0] && <PlayerCard player={players[0]} isActive={turn === 0} logs={floatingLogs} onClick={() => { setSelectedPlayerForDescriptionId(players[0].id); setPlayerDescriptionModal(true); }} />}
          <DiceArea isActive={turn === 0} dice={dice} isRolling={isRolling} onRoll={rollDice} canRoll={turn === 0 && phase === 'ROLL'} />
        </div>
        <div className="player-side">
          {players[3] && <PlayerCard player={players[3]} isActive={turn === 3} logs={floatingLogs} onClick={() => { setSelectedPlayerForDescriptionId(players[3].id); setPlayerDescriptionModal(true); }} />}
          <DiceArea isActive={turn === 3} dice={dice} isRolling={isRolling} onRoll={rollDice} canRoll={turn === 3 && phase === 'ROLL'} />
        </div>
      </div>

      {/* SELECTOR MODAL FOR TRADE */}
      {selectorTarget && (
        <div className="overlay-backdrop" style={{ zIndex: 140 }}>
          <div className="modal-card" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 900, textTransform: 'uppercase', color: '#1e293b', letterSpacing: '0.05em' }}>Select Property</h3>
              <X style={{ cursor: 'pointer', color: '#94a3b8' }} onClick={() => setSelectorTarget(null)} />
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.25rem' }}>
              {Object.keys(properties)
                .filter(k => properties[k].ownerId === (selectorTarget === 'my' ? activePlayer.id : tradeState.targetPlayerId))
                .map(pid => {
                  const isSelected = (selectorTarget === 'my' ? tradeState.myOffer.properties : tradeState.theirOffer.properties).includes(parseInt(pid));
                  return (
                    <button
                      key={pid}
                      onClick={() => {
                        const targetPath = selectorTarget === 'my' ? 'myOffer' : 'theirOffer';
                        const currentProps = tradeState[targetPath].properties;
                        const newProps = isSelected ? currentProps.filter(id => id !== parseInt(pid)) : [...currentProps, parseInt(pid)];
                        setTradeState({ ...tradeState, [targetPath]: { ...tradeState[targetPath], properties: newProps } });
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '1rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 900,
                        border: `3px solid ${isSelected ? '#60a5fa' : '#f1f5f9'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isSelected ? '#2563eb' : '#f8fafc',
                        color: isSelected ? 'white' : '#334155',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 10px 15px -3px rgb(0 0 0/0.1)' : 'none',
                      }}
                    >
                      {BOARD_DATA[pid].name}
                      {isSelected && <Check size={18} />}
                    </button>
                  );
                })
              }
              {Object.keys(properties).filter(k => properties[k].ownerId === (selectorTarget === 'my' ? activePlayer.id : tradeState.targetPlayerId)).length === 0 && (
                <div className="empty-state">No properties to trade.</div>
              )}
            </div>
            <button onClick={() => setSelectorTarget(null)} style={{ width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '1rem', borderRadius: '0.75rem', fontWeight: 900, marginTop: '2rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.875rem', border: 'none', cursor: 'pointer', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.1)' }}>Done Selection</button>
          </div>
        </div>
      )}

      {/* TRADE MODAL */}
      {tradeState && !selectorTarget && (
        <div className="overlay-backdrop" style={{ zIndex: 130 }}>
          <div className="modal-card" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title blue">Trade Offer</h2>
              <button onClick={() => setTradeState(null)} className="modal-close-btn"><X size={24} /></button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Deal With:</label>
              <select
                value={tradeState.targetPlayerId || ''}
                onChange={e => setTradeState({ ...tradeState, targetPlayerId: parseInt(e.target.value), theirOffer: { cash: 0, properties: [] } })}
                className="form-select"
              >
                {players.filter(p => p.id !== activePlayer.id).map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>

            <div className="trade-cols">
              <div className="trade-side my">
                <h3 style={{ fontWeight: 900, color: '#1e40af', textAlign: 'center', textTransform: 'uppercase', marginBottom: '1rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Your Offer</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#2563eb', display: 'block', marginBottom: '0.25rem' }}>Cash (₹)</label>
                  <input type="number" step="100" min="0" max={activePlayer.money} value={tradeState.myOffer.cash} onChange={e => setTradeState({ ...tradeState, myOffer: { ...tradeState.myOffer, cash: parseInt(e.target.value) || 0 } })} className="form-number-input blue" />
                </div>
                <button onClick={() => setSelectorTarget('my')} style={{ width: '100%', backgroundColor: 'white', border: '2px solid #bfdbfe', color: '#2563eb', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShoppingCart size={14} /> Select Property
                </button>
                <div className="trade-prop-chips">
                  {tradeState.myOffer.properties.map(pid => (
                    <div key={pid} className="trade-prop-chip my">
                      {BOARD_DATA[pid].name}
                      <X size={10} style={{ cursor: 'pointer' }} onClick={() => { const props = tradeState.myOffer.properties.filter(id => id !== pid); setTradeState({ ...tradeState, myOffer: { ...tradeState.myOffer, properties: props } }); }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="trade-side their">
                <h3 style={{ fontWeight: 900, color: '#9a3412', textAlign: 'center', textTransform: 'uppercase', marginBottom: '1rem', fontSize: '0.75rem', letterSpacing: '0.05em' }}>You Receive</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#ea580c', display: 'block', marginBottom: '0.25rem' }}>Cash (₹)</label>
                  <input type="number" step="100" min="0" value={tradeState.theirOffer.cash} onChange={e => setTradeState({ ...tradeState, theirOffer: { ...tradeState.theirOffer, cash: parseInt(e.target.value) || 0 } })} className="form-number-input orange" />
                </div>
                <button onClick={() => setSelectorTarget('their')} style={{ width: '100%', backgroundColor: 'white', border: '2px solid #fed7aa', color: '#ea580c', padding: '0.75rem', borderRadius: '0.75rem', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShoppingCart size={14} /> Select Property
                </button>
                <div className="trade-prop-chips">
                  {tradeState.theirOffer.properties.map(pid => (
                    <div key={pid} className="trade-prop-chip their">
                      {BOARD_DATA[pid].name}
                      <X size={10} style={{ cursor: 'pointer' }} onClick={() => { const props = tradeState.theirOffer.properties.filter(id => id !== pid); setTradeState({ ...tradeState, theirOffer: { ...tradeState.theirOffer, properties: props } }); }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={executeTrade} style={{ width: '100%', backgroundColor: '#22c55e', padding: '1.25rem', borderRadius: '1rem', color: 'white', fontWeight: 900, fontSize: '1.25rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 20px 25px -5px rgb(0 0 0/0.1)' }}>
              <Check size={28} strokeWidth={3} /> CONFIRM TRADE
            </button>
          </div>
        </div>
      )}

      {/* PROPERTY DASHBOARD MODAL */}
      {manageModal && (
        <div className="overlay-backdrop" style={{ zIndex: 130 }}>
          <div className="modal-card" style={{ maxWidth: '600px', maxHeight: '80vh' }}>
            <div className="modal-header">
              <h2 className="modal-title blue">Manage Properties</h2>
              <button onClick={() => {
                setManageModal(false);
                if (activePlayer?.money < 0) {
                  setBankruptcyModal(true);
                }
              }} className="modal-close-btn"><X size={24} /></button>
            </div>
            <div style={{ overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {Object.entries(properties)
                .filter(([id, p]) => p.ownerId === activePlayer.id)
                .map(([id, p]) => {
                  const tile = BOARD_DATA[id];
                  const groupColor = getGroupColor(tile.group) || '#94a3b8';
                  return (
                    <div key={id} className={`property-row${p.mortgaged ? ' mortgaged' : ''}`}>
                      <div className="property-color-swatch" style={{ backgroundColor: groupColor }}>
                        {tile.name}
                      </div>
                      <div className="property-actions">
                        <div className="property-detail-row">
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 900, color: p.mortgaged ? '#ef4444' : (p.hotel ? '#dc2626' : '#1e293b') }}>
                            {p.mortgaged ? 'MORTGAGED' : (p.hotel ? 'HOTEL' : `${p.houses || 0} HOUSES`)}
                          </span>
                        </div>
                        <div className="prop-btn-row">
                          <button
                            onClick={() => {
                              if (p.mortgaged || p.hotel || tile.type !== 'property') return;
                              setPendingManage(prev => (prev.propId === id && prev.action === 'build' ? { propId: null, action: null } : { propId: id, action: 'build' }));
                            }}
                            disabled={p.mortgaged || p.hotel || tile.type !== 'property'}
                            className={`prop-btn build${pendingManage.propId === id && pendingManage.action === 'build' ? ' selected' : ''}`}
                          >
                            <Home size={12} /> Build
                          </button>

                          <button
                            onClick={() => {
                              if (p.mortgaged) return;
                              setPendingManage(prev => (prev.propId === id && prev.action === 'sell' ? { propId: null, action: null } : { propId: id, action: 'sell' }));
                            }}
                            disabled={p.mortgaged}
                            className={`prop-btn sell${pendingManage.propId === id && pendingManage.action === 'sell' ? ' selected' : ''}`}
                          >
                            <ShoppingCart size={12} /> Sell <span style={{ display: 'none' }}>{(p.houses > 0 || p.hotel) ? 'House' : 'Prop'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setPendingManage(prev => (prev.propId === id && prev.action === 'mortgage' ? { propId: null, action: null } : { propId: id, action: 'mortgage' }));
                            }}
                            className={`prop-btn ${p.mortgaged ? 'redeem' : 'mortgage'}${pendingManage.propId === id && pendingManage.action === 'mortgage' ? ' selected' : ''}`}
                          >
                            <RefreshCw size={12} /> {p.mortgaged ? 'Redeem' : 'Mortgage'}
                          </button>
                        </div>
                        <button
                          onClick={() => confirmManage(id)}
                          className="prop-btn confirm-action"
                        >
                          {(() => {
                            if (pendingManage.propId !== id || !pendingManage.action) return 'Confirm';
                            const act = pendingManage.action;
                            if (act === 'build') return `Pay Rs ${tile.houseCost} to build`;
                            if (act === 'sell') {
                              let amount = 0;
                              if (p.hotel) amount = Math.floor(tile.houseCost / 2);
                              else if (p.houses > 0) amount = Math.floor(tile.houseCost / 2);
                              else amount = Math.floor(tile.price / 2);
                              return `Get Rs ${amount}`;
                            }
                            if (act === 'mortgage') {
                              if (p.mortgaged) {
                                const cost = Math.floor(tile.mortgage * 1.1);
                                return `Pay Rs ${cost} to redeem`;
                              }
                              return `Confirm and get Rs ${tile.mortgage}`;
                            }
                            return 'Confirm';
                          })()}
                        </button>
                      </div>
                    </div>
                  );
                })}
              {Object.entries(properties).filter(([id, p]) => p.ownerId === activePlayer.id).length === 0 && (
                <div className="empty-state">
                  You don't own any properties yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PLAYER DESCRIPTION MODAL */}
      {playerDescriptionModal && selectedPlayerForDescription && (
        <div className="overlay-backdrop" style={{ zIndex: 131 }}>
          <div className="modal-card" style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <PawnIcon colorClass={selectedPlayerForDescription.color} size="w-8 h-8" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a' }}>{selectedPlayerForDescription.name}</h2>
              </div>
              <button onClick={() => { setPlayerDescriptionModal(false); setSelectedPlayerForDescriptionId(null); }} className="modal-close-btn"><X size={24} /></button>
            </div>

            {/* BALANCE */}
            <div style={{ backgroundImage: 'linear-gradient(to right, #f0fdf4, #dcfce7)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '2px solid #bbf7d0' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Current Balance</p>
              <p style={{ fontSize: '1.875rem', fontWeight: 900, color: '#16a34a' }}>₹{selectedPlayerForDescription.money}</p>
            </div>

            {/* LOAN INFO */}
            <div style={{ backgroundImage: 'linear-gradient(to right, #fef2f2, #fee2e2)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '2px solid #fecaca' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Loan Details</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Amount to Pay</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 900, color: '#dc2626' }}>Rs. {selectedPlayerOutstandingLoan}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Interest per Turn</span>
                  <span>{Math.round(LOAN_RATE_PER_TURN * 100)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Next Turn Interest</span>
                  <span>Rs. {selectedPlayerLoanInterestNextTurn}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #fecaca', paddingTop: '0.5rem' }}>
                  <span>If Not Paid (Next Turn)</span>
                  <span style={{ fontWeight: 900 }}>Rs. {selectedPlayerNextTurnLoanTotal}</span>
                </div>
              </div>
            </div>

            {/* PROPERTIES */}
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#1e293b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Properties</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                {selectedPlayerOwnedProperties.length > 0 ? (
                  selectedPlayerOwnedProperties.map(([id, p]) => {
                    const tile = BOARD_DATA[id];
                    const groupColor = getGroupColor(tile.group) || '#94a3b8';
                    return (
                      <div key={id} style={{ backgroundColor: groupColor, padding: '0.75rem', borderRadius: '0.5rem', color: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0/0.1)', border: '2px solid rgba(255,255,255,0.5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{tile.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {p.mortgaged ? (
                              <span style={{ backgroundColor: '#dc2626', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 900 }}>MORTGAGED</span>
                            ) : (
                              <>
                                {p.hotel && <span style={{ backgroundColor: '#ca8a04', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 900 }}>HOTEL</span>}
                                {!p.hotel && <span style={{ backgroundColor: '#16a34a', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 900 }}>Houses: {p.houses || 0}</span>}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8', fontWeight: 700, padding: '1rem', border: '2px dashed #e2e8f0', borderRadius: '0.5rem' }}>
                    No properties owned
                  </div>
                )}
              </div>
            </div>

            {/* QUIT BUTTON */}
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want ${selectedPlayerForDescription.name} to quit the game?`)) {
                  quitPlayer(selectedPlayerForDescription.id);
                }
              }}
              style={{ width: '100%', backgroundColor: '#ef4444', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 900, fontSize: '1rem', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgb(0 0 0/0.1)' }}
            >
              <LogOut size={20} /> Quit Game
            </button>
          </div>
        </div>
      )}

      {/* BANK LOAN MODAL */}
      {loanModal && (
        <div className="overlay-backdrop" style={{ zIndex: 131 }}>
          <div className="modal-card" style={{ maxWidth: '420px' }}>
            <div className="modal-header" style={{ marginBottom: '1rem' }}>
              <h2 className="modal-title yellow" style={{ fontSize: '1.25rem' }}>Bank Loan</h2>
              <button onClick={() => setLoanModal(false)} className="modal-close-btn"><X size={22} /></button>
            </div>

            <div className="loan-info-box">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Rate of Interest</span><span>{Math.round(LOAN_RATE_PER_TURN * 100)}% / turn</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Amount (Next Turn)</span><span>Rs.{nextTurnLoanTotal}</span></div>
            </div>

            <div className="loan-slider-section">
              <div className="loan-slider-label">
                <span>Take Amount</span>
                <span>Rs.{takeSliderValue} / Rs.{availableLoanAmount}</span>
              </div>
              <input
                type="range"
                min="0"
                max={availableLoanAmount}
                step="1"
                value={takeSliderValue}
                onChange={(e) => setLoanDraft(prev => ({ ...prev, takeAmount: e.target.value }))}
                className="loan-range take"
              />
              <button onClick={takeLoan} disabled={takeSliderValue <= 0} style={{ marginTop: '0.75rem', width: '100%', backgroundColor: '#16a34a', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 900, border: 'none', cursor: takeSliderValue > 0 ? 'pointer' : 'not-allowed', opacity: takeSliderValue <= 0 ? 0.4 : 1 }}>Take</button>
            </div>

            <div className="loan-slider-section" style={{ marginBottom: '1rem' }}>
              <div className="loan-slider-label">
                <span>Pay Amount</span>
                <span>Rs.{repaySliderValue} / Rs.{maxRepayAmount}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxRepayAmount}
                step="1"
                value={repaySliderValue}
                onChange={(e) => setLoanDraft(prev => ({ ...prev, repayAmount: e.target.value }))}
                className="loan-range repay"
              />
              <button onClick={repayLoan} disabled={repaySliderValue <= 0} style={{ marginTop: '0.75rem', width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 900, border: 'none', cursor: repaySliderValue > 0 ? 'pointer' : 'not-allowed', opacity: repaySliderValue <= 0 ? 0.4 : 1 }}>Pay</button>
            </div>

            <button onClick={() => setLoanModal(false)} style={{ width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '0.75rem', borderRadius: '0.75rem', fontWeight: 900, textTransform: 'uppercase', border: 'none', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgb(0 0 0/0.1)' }}>Done</button>
          </div>
        </div>
      )}

      {/* PROPERTY MANAGE / VIEW MODAL */}
      {selectedTile && (
        <div className="overlay-backdrop" style={{ zIndex: 110, padding: '0.5rem' }} onClick={() => setSelectedTile(null)}>
          <div className="deed-modal-card" onClick={e => e.stopPropagation()}>
            <div className="deed-header" style={{ backgroundColor: getGroupColor(selectedTile.group) || '#e2e8f0' }}>
              <h3 className={`deed-header-label ${['YELLOW', 'LIGHT_BLUE', 'PINK'].includes(selectedTile.group) ? 'dark' : 'light'}`}>Title Deed</h3>
              <h1 className={`deed-header-name ${['YELLOW', 'LIGHT_BLUE', 'PINK'].includes(selectedTile.group) ? 'dark' : 'light'}`}>{selectedTile.name}</h1>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', fontStyle: 'italic', color: 'white' }}>
                <span>₹{selectedTile.price}</span>
              </div>
            </div>
            <div className="deed-body">
              {selectedTile.type === 'railway' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.25rem 0', fontWeight: 700, fontSize: '11px', color: '#334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.25rem' }}><span>1 railway rent →</span><span>₹750</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.25rem' }}><span>2 railways rent →</span><span>₹1000</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.25rem' }}><span>3 railways rent →</span><span>₹2000</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.25rem' }}><span>4 railways rent →</span><span>₹4000</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '8px', fontWeight: 900 }}>Mortgage Value</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, fontStyle: 'italic' }}>₹{selectedTile.mortgage}</span>
                  </div>
                </div>
              ) : selectedTile.type === 'property' ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', fontWeight: 900, fontSize: '0.875rem', fontStyle: 'italic' }}><span>RENT Site Only</span><span>₹{selectedTile.rent[0]}</span></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>With 1 House</span><span>₹{selectedTile.rent[1]}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>With 2 Houses</span><span>₹{selectedTile.rent[2]}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>With 3 Houses</span><span>₹{selectedTile.rent[3]}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>With 4 Houses</span><span>₹{selectedTile.rent[4]}</span></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.75rem 0', fontWeight: 900, fontSize: '0.875rem', fontStyle: 'italic', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}><span>With HOTEL</span><span>₹{selectedTile.rent[5]}</span></div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '10px', fontWeight: 700, borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}><span style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '8px' }}>Mortgage</span><span style={{ fontSize: '0.75rem' }}>₹{selectedTile.mortgage}</span></div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}><span style={{ color: '#94a3b8', textTransform: 'uppercase', fontSize: '8px' }}>House cost</span><span style={{ fontSize: '0.75rem' }}>₹{selectedTile.houseCost}</span></div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', fontWeight: 900, padding: '2rem 0', fontSize: '1.5rem' }}>₹{selectedTile.price || selectedTile.amount || '0'}</div>
              )}
            </div>
            {properties[selectedTile.id]?.ownerId === activePlayer.id && phase === 'MANAGE' ? (
              <div className="deed-footer-manage">
                <p style={{ fontSize: '10px', textAlign: 'center', fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Manage Property</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => { buildHouse(selectedTile.id); setSelectedTile(null); }} style={{ flex: 1, backgroundColor: '#22c55e', color: 'white', fontSize: '0.75rem', fontWeight: 900, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgb(0 0 0/0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.375rem' }}><Home size={14} /> Build</button>
                  <button onClick={() => { toggleMortgage(selectedTile.id); setSelectedTile(null); }} style={{ flex: 1, backgroundColor: '#f97316', color: 'white', fontSize: '0.75rem', fontWeight: 900, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgb(0 0 0/0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.375rem' }}><RefreshCw size={14} /> Mortgage</button>
                </div>
              </div>
            ) : (
              <div className="deed-footer-view">
                <button
                  onClick={() => setSelectedTile(null)}
                  style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseOver={e => e.target.style.color = '#3b82f6'}
                  onMouseOut={e => e.target.style.color = '#94a3b8'}
                >Close Deed</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TRANSFER MODAL ===== */}
      {transferModal && (() => {
        const PLAYER_COLORS = {
          'bg-red-500': '#ef4444', 'bg-blue-500': '#3b82f6',
          'bg-green-500': '#22c55e', 'bg-yellow-500': '#eab308',
        };
        const isFromBank = transferModal.from === 'BANK';
        const isToBank = transferModal.to === 'BANK';
        const fromColor = isFromBank ? '#64748b' : (PLAYER_COLORS[transferModal.from?.color] || '#64748b');
        const toColor = isToBank ? '#64748b' : (PLAYER_COLORS[transferModal.to?.color] || '#64748b');
        const isReceiving = isFromBank; // player is getting money from bank
        const amountColor = isToBank ? '#ef4444' : '#22c55e';

        const TokenBubble = ({ label, color, isBank }) => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{
              width: '3rem', height: '3rem', borderRadius: '9999px',
              backgroundColor: isBank ? '#f1f5f9' : color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `3px solid ${isBank ? '#cbd5e1' : color}`,
              boxShadow: `0 0 0 4px ${isBank ? 'rgba(100,116,139,0.15)' : color + '33'}`,
              fontSize: isBank ? '1.4rem' : '1.1rem',
            }}>
              {isBank ? '🏦' : (
                <svg viewBox="0 0 24 24" fill="currentColor"
                  style={{ color: 'white', width: '1.5rem', height: '1.5rem' }}>
                  <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5.7.5 1.2 1.2 1.5 2h.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1.2l-1.3 6h2.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h2.5l-1.3-6H6a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h.5c.3-.8.8-1.5 1.5-2-1.2-.7-2-2-3.5a4 4 0 0 1 4-4z" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.05em', maxWidth: '4rem', textAlign: 'center', lineHeight: 1.2 }}>
              {label}
            </span>
          </div>
        );

        return (
          <div className="transfer-modal-backdrop">
            <div className="transfer-modal" key={transferModal.id}>
              {/* PARTICIPANTS ROW */}
              <div className="transfer-modal-row">
                <TokenBubble
                  label={isFromBank ? 'Bank' : transferModal.from?.name}
                  color={fromColor}
                  isBank={isFromBank}
                />
                <div className="transfer-arrow">
                  <div className="transfer-arrow-line" />
                  <div className="transfer-arrow-head">▶</div>
                </div>
                <TokenBubble
                  label={isToBank ? 'Bank' : transferModal.to?.name}
                  color={toColor}
                  isBank={isToBank}
                />
              </div>

              {/* AMOUNT */}
              <div className="transfer-amount" style={{ color: amountColor }}>
                {isToBank ? '−' : '+'}₹{transferModal.amount.toLocaleString()}
              </div>

              {/* DESCRIPTION */}
              {transferModal.description && (
                <div className="transfer-description">{transferModal.description}</div>
              )}

              {/* PROGRESS BAR */}
              <div className="transfer-progress-bar">
                <div className="transfer-progress-fill" />
              </div>
            </div>
          </div>
        );
      })()}
    </div>

  );
}
