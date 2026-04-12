import React, { useState, useEffect, useRef } from 'react';
import {
  Dices, MapPin, Wallet, History, AlertCircle, X, Check, ArrowRight, Users,
  User, Bot, Play, Train, Lightbulb, Droplets, HelpCircle, Briefcase,
  Coins, Car, ShieldAlert, ArrowRightSquare, Home, Hotel, Building,
  RefreshCw, LogOut, ShoppingCart, Repeat, Save, CreditCard, Minus, Plus
} from 'lucide-react';

// --- INJECT ANIMATION LIBRARIES ---
const LoanScript = (url) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${url}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = url;
    script.onLoan = resolve;
    document.head.appendChild(script);
  });
};

// --- PAWN ICON COMPONENT ---
const PawnIcon = ({ colorClass, size = "w-4 h-4 sm:w-6 sm:h-6", id }) => {
  const textColor = colorClass ? colorClass.replace('bg-', 'text-') : 'text-slate-500';
  return (
    <svg id={id} viewBox="0 0 24 24" fill="currentColor" className={`${size} ${textColor} drop-shadow-lg transition-colors duration-200`}>
      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5.7.5 1.2 1.2 1.5 2h.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1.2l-1.3 6h2.5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h2.5l-1.3-6H6a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h.5c.3-.8.8-1.5 1.5-2-1.2-.7-2-2-2-3.5a4 4 0 0 1 4-4z" />
    </svg>
  );
};

// --- DICE COMPONENT ---
const Die = ({ value, isRolling }) => {
  const [fakeValue, setFakeValue] = useState(value);

  useEffect(() => {
    let interval;
    if (isRolling) {
      interval = setInterval(() => {
        setFakeValue(Math.floor(Math.random() * 6) + 1);
      }, 30);
    } else {
      setFakeValue(value);
    }
    return () => clearInterval(interval);
  }, [isRolling, value]);

  const dots = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  const currentVal = isRolling ? fakeValue : value;

  return (
    <div className={`
      w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl shadow-lg border-2 border-slate-200 
      flex items-center justify-center transition-all duration-150
      ${isRolling ? 'animate-die-roll' : 'hover:scale-110 active:scale-95'}
    `}>
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-8 h-8 sm:w-10 sm:h-10">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {dots[currentVal]?.includes(i) && (
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-800 rounded-full shadow-inner" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DiceArea = ({ isActive, isRolling, onRoll, dice }) => (
  <div
    onClick={isActive && !isRolling ? onRoll : undefined}
    className={`
      transition-all duration-500 transform 
      ${isActive ? 'opacity-100 scale-100 translate-y-0 cursor-pointer' : 'opacity-0 scale-50 translate-y-4 pointer-events-none'}
      flex flex-col items-center gap-2
    `}
  >
    <div className="flex gap-3">
      <Die value={dice[0]} isRolling={isRolling} />
      <Die value={dice[1]} isRolling={isRolling} />
    </div>
    {isActive && !isRolling && (
      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest animate-pulse">Click to Roll</span>
    )}
  </div>
);

// --- FLOATING NOTIFICATION COMPONENT ---
const FloatingNotifications = ({ logs, playerId }) => {
  const playerLogs = logs.filter(log => log.playerId === playerId);
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 pointer-events-none flex flex-col items-center gap-1 z-[200]">
      {playerLogs.map(log => (
        <div key={log.id} className="bg-slate-800/90 text-white text-[10px] sm:text-xs font-bold p-2 rounded-lg shadow-lg animate-float-up-vanish border-l-4 border-blue-400 backdrop-blur-sm whitespace-nowrap">
          {log.text}
        </div>
      ))}
    </div>
  );
};

const PlayerCard = ({ player, isActive, logs }) => (
  <div className="relative">
    <FloatingNotifications logs={logs} playerId={player.id} />
    <div className={`p-3 sm:p-4 rounded-2xl shadow-xl border-4 w-32 sm:w-48 transition-all duration-300 bg-white
      ${isActive ? 'border-blue-500 scale-105 shadow-blue-500/30 ring-4 ring-blue-500/20' : 'border-slate-100 opacity-80'}
    `}>
      <div className="flex items-center gap-2 mb-2">
        <PawnIcon colorClass={player.color} size="w-5 h-5 sm:w-7 sm:h-7" />
        <span className={`font-black text-xs sm:text-lg truncate ${isActive ? 'text-blue-900' : 'text-slate-600'}`}>
          {player.name} {player.inJail && <ShieldAlert size={14} className="inline text-red-500 ml-1" />}
        </span>
      </div>
      <div className={`font-black text-sm sm:text-2xl flex items-center gap-1.5 ${isActive ? 'text-green-600' : 'text-slate-500'}`}>
        <Wallet size={18} /> ₹{player.money}
      </div>
    </div>
  </div>
);

// --- DATA & CONFIG ---
const BOARD_DATA = [
  { id: 0, type: 'corner', name: 'GO', icon: '🏁', reward: 2000 },
  { id: 1, type: 'property', name: 'Pune', group: 'BROWN', price: 600, houseCost: 500, mortgage: 300, rent: [20, 100, 300, 900, 1600, 2500] },
  { id: 2, type: 'chest', name: 'Community Chest', icon: '📦' },
  { id: 3, type: 'property', name: 'Nagpur', group: 'BROWN', price: 600, houseCost: 500, mortgage: 300, rent: [40, 200, 600, 1800, 3200, 4500] },
  { id: 4, type: 'tax', name: 'Income Tax', icon: '💸', amount: 2000 },
  { id: 5, type: 'railway', name: 'Mumbai Central', group: 'RAILWAY', price: 2000, mortgage: 1000, rent: [250, 500, 1000, 2000] },
  { id: 6, type: 'property', name: 'Surat', group: 'LIGHT_BLUE', price: 1000, houseCost: 500, mortgage: 500, rent: [60, 300, 900, 2700, 4000, 5500] },
  { id: 7, type: 'chance', name: 'Chance', icon: '❓' },
  { id: 8, type: 'property', name: 'Vadodara', group: 'LIGHT_BLUE', price: 1000, houseCost: 500, mortgage: 500, rent: [60, 300, 900, 2700, 4000, 5500] },
  { id: 9, type: 'property', name: 'Ahmedabad', group: 'LIGHT_BLUE', price: 1200, houseCost: 500, mortgage: 600, rent: [80, 400, 1000, 3000, 4500, 6000] },
  { id: 10, type: 'corner', name: 'Jail', icon: '🏛️' },
  { id: 11, type: 'property', name: 'Nashik', group: 'PINK', price: 1400, houseCost: 1000, mortgage: 700, rent: [100, 500, 1500, 4500, 6250, 7500] },
  { id: 12, type: 'utility', name: 'Electric Co.', group: 'UTILITY', price: 1500, mortgage: 750 },
  { id: 13, type: 'property', name: 'Aurangabad', group: 'PINK', price: 1400, houseCost: 1000, mortgage: 700, rent: [100, 500, 1500, 4500, 6250, 7500] },
  { id: 14, type: 'property', name: 'Indore', group: 'PINK', price: 1600, houseCost: 1000, mortgage: 800, rent: [120, 600, 1800, 5000, 7000, 9000] },
  { id: 15, type: 'railway', name: 'Howrah Express', group: 'RAILWAY', price: 2000, mortgage: 1000, rent: [250, 500, 1000, 2000] },
  { id: 16, type: 'property', name: 'Patna', group: 'ORANGE', price: 1800, houseCost: 1000, mortgage: 900, rent: [140, 700, 2000, 5500, 7500, 9500] },
  { id: 17, type: 'chest', name: 'Community Chest', icon: '📦' },
  { id: 18, type: 'property', name: 'Bhopal', group: 'ORANGE', price: 1800, houseCost: 1000, mortgage: 900, rent: [140, 700, 2000, 5500, 7500, 9500] },
  { id: 19, type: 'property', name: 'Lucknow', group: 'ORANGE', price: 2000, houseCost: 1000, mortgage: 1000, rent: [160, 800, 2200, 6000, 8000, 10000] },
  { id: 20, type: 'corner', name: '', icon: '🅿️' },
  { id: 21, type: 'property', name: 'Jaipur', group: 'RED', price: 2200, houseCost: 1500, mortgage: 1100, rent: [180, 900, 2500, 7000, 8750, 10500] },
  { id: 22, type: 'chance', name: 'Chance', icon: '❓' },
  { id: 23, type: 'property', name: 'Hyderabad', group: 'RED', price: 2200, houseCost: 1500, mortgage: 1100, rent: [180, 900, 2500, 7000, 8750, 10500] },
  { id: 24, type: 'property', name: 'Chennai', group: 'RED', price: 2400, houseCost: 1500, mortgage: 1200, rent: [200, 1000, 3000, 9000, 11000, 12750] },
  { id: 25, type: 'railway', name: 'Rajdhani Exp.', group: 'RAILWAY', price: 2000, mortgage: 1000, rent: [250, 500, 1000, 2000] },
  { id: 26, type: 'property', name: 'Kolkata', group: 'YELLOW', price: 2600, houseCost: 1500, mortgage: 1300, rent: [220, 1100, 3300, 8000, 9750, 11500] },
  { id: 27, type: 'property', name: 'Bengaluru', group: 'YELLOW', price: 2600, houseCost: 1500, mortgage: 1300, rent: [220, 1100, 3300, 8000, 9750, 11500] },
  { id: 28, type: 'utility', name: 'Water Works', group: 'UTILITY', price: 1500, mortgage: 750 },
  { id: 29, type: 'property', name: 'Pune Tech', group: 'YELLOW', price: 2800, houseCost: 1500, mortgage: 1400, rent: [240, 1200, 3600, 8500, 10250, 12000] },
  { id: 30, type: 'corner', name: 'Go To Jail', icon: '👮' },
  { id: 31, type: 'property', name: 'Srinagar', group: 'GREEN', price: 3000, houseCost: 2000, mortgage: 1500, rent: [260, 1300, 3900, 9000, 11000, 12750] },
  { id: 32, type: 'property', name: 'Chandigarh', group: 'GREEN', price: 3000, houseCost: 2000, mortgage: 1500, rent: [260, 1300, 3900, 9000, 11000, 12750] },
  { id: 33, type: 'chest', name: 'Community Chest', icon: '📦' },
  { id: 34, type: 'property', name: 'Amritsar', group: 'GREEN', price: 3200, houseCost: 2000, mortgage: 1600, rent: [280, 1500, 4500, 10000, 12000, 14000] },
  { id: 35, type: 'railway', name: 'Shatabdi Exp.', group: 'RAILWAY', price: 2000, mortgage: 1000, rent: [250, 500, 1000, 2000] },
  { id: 36, type: 'chance', name: 'Chance', icon: '❓' },
  { id: 37, type: 'property', name: 'Mumbai BKC', group: 'DARK_BLUE', price: 3500, houseCost: 2000, mortgage: 1750, rent: [350, 1750, 5000, 11000, 13000, 15000] },
  { id: 38, type: 'tax', name: 'Luxury Tax', icon: '💎', amount: 750 },
  { id: 39, type: 'property', name: 'Delhi CP', group: 'DARK_BLUE', price: 4000, houseCost: 2000, mortgage: 2000, rent: [500, 2000, 6000, 14000, 17000, 20000] },
];

const PARKING_BASE_BONUS = 500;
const PARKING_MULTIPLIERS = [1, 1, 1, 2, 2, 3, 4];

const createParkingReward = () => {
  const multiplier = PARKING_MULTIPLIERS[Math.floor(Math.random() * PARKING_MULTIPLIERS.length)];
  return {
    amount: PARKING_BASE_BONUS * multiplier,
    multiplier,
  };
};

const CARDS = {
  CHANCE: [
    { text: "Advance to GO. Collect ₹2000.", action: (p) => ({ type: 'MOVE_TO', pos: 0 }) },
    { text: "Go directly to Jail. Do not pass GO.", action: (p) => ({ type: 'GOTO_JAIL' }) },
    { text: "Speeding fine! Pay ₹150.", action: (p) => ({ type: 'PAY_BANK', amount: 150 }) },
    { text: "Your building loan matures. Collect ₹1500.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 1500 }) },
    { text: "Get Out of Jail Free.", action: (p) => ({ type: 'GET_OUT_OF_JAIL_FREE' }) },
  ],
  CHEST: [
    { text: "Bank error in your favor. Collect ₹2000.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 2000 }) },
    { text: "Doctor's fee. Pay ₹500.", action: (p) => ({ type: 'PAY_BANK', amount: 500 }) },
    { text: "Income tax refund. Collect ₹200.", action: (p) => ({ type: 'RECEIVE_BANK', amount: 200 }) },
    { text: "Go to Jail. Go directly to jail.", action: (p) => ({ type: 'GOTO_JAIL' }) },
    { text: "Get Out of Jail Free.", action: (p) => ({ type: 'GET_OUT_OF_JAIL_FREE' }) },
  ]
};

const getGroupColor = (group) => {
  switch (group) {
    case 'BROWN': return 'bg-[#8B4513]'; case 'LIGHT_BLUE': return 'bg-[#87CEEB]';
    case 'PINK': return 'bg-[#FF69B4]'; case 'ORANGE': return 'bg-[#FFA500]';
    case 'RED': return 'bg-[#FF0000]'; case 'YELLOW': return 'bg-[#FFD700]';
    case 'GREEN': return 'bg-[#008000]'; case 'DARK_BLUE': return 'bg-[#00008B]';
    default: return null;
  }
};

const getOwnershipMarkerStyle = (id) => {
  if (id >= 1 && id <= 9) return "top-[-18px] sm:top-[-26px] left-1/2 -translate-x-1/2";
  if (id >= 11 && id <= 19) return "right-[-18px] sm:right-[-26px] top-1/2 -translate-y-1/2";
  if (id >= 21 && id <= 29) return "bottom-[-18px] sm:bottom-[-26px] left-1/2 -translate-x-1/2";
  if (id >= 31 && id <= 39) return "left-[-18px] sm:left-[-26px] top-1/2 -translate-y-1/2";
  return "hidden";
};

// --- MAIN APP ---
export default function App() {
  const [appState, setAppState] = useState('setup');
  const [playerCount, setPlayerCount] = useState(2);
  const [gameMode, setGameMode] = useState('bot');
  const [startingMoney, setStartingMoney] = useState(15000); // Setup Money State

  // Unified Game State
  const [gameState, setGameState] = useState({
    players: [],
    properties: {},
    bank: { houses: 32, hotels: 12, parking: createParkingReward() },
    currentTurn: 0,
    phase: 'ROLL',
    dice: [1, 1]
  });

  const players = gameState.players;
  const properties = gameState.properties;
  const bank = gameState.bank;
  const turn = gameState.currentTurn;
  const phase = gameState.phase;
  const dice = gameState.dice;

  const setPlayers = (updater) => setGameState(prev => ({ ...prev, players: typeof updater === 'function' ? updater(prev.players) : updater }));
  const setProperties = (updater) => setGameState(prev => ({ ...prev, properties: typeof updater === 'function' ? updater(prev.properties) : updater }));
  const setBank = (updater) => setGameState(prev => ({ ...prev, bank: typeof updater === 'function' ? updater(prev.bank) : updater }));
  const setTurn = (updater) => setGameState(prev => ({ ...prev, currentTurn: typeof updater === 'function' ? updater(prev.currentTurn) : updater }));
  const setPhase = (updater) => setGameState(prev => ({ ...prev, phase: typeof updater === 'function' ? updater(prev.phase) : updater }));
  const setDice = (updater) => setGameState(prev => ({ ...prev, dice: typeof updater === 'function' ? updater(prev.dice) : updater }));

  // Trade State
  const [tradeState, setTradeState] = useState(null);
  const [selectorTarget, setSelectorTarget] = useState(null);

  // Auction State
  const [auctionState, setAuctionState] = useState(null);

  // Ephemeral State
  const [doublesCount, setDoublesCount] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [selectedTile, setSelectedTile] = useState(null);
  const [floatingLogs, setFloatingLogs] = useState([]);
  const [manageModal, setManageModal] = useState(false);

  useEffect(() => {
    LoanScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js');
    LoanScript('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js');
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

  const activePlayer = players[turn] || {};

  // --- BANKRUPTCY CHECK ---
  const checkBankruptcy = (playerId, newMoney) => {
    if (newMoney >= 0) return false;
    const playerRecord = players.find(p => p.id === playerId);
    if (!playerRecord) return true;

    // Try Auto-Liquidate if needed
    let liquidatedMoney = newMoney;
    let propsUpdated = { ...properties };
    const playerProps = Object.keys(propsUpdated).filter(k => propsUpdated[k].ownerId === playerId);

    // Sell Houses first
    for (let pid of playerProps) {
      let p = propsUpdated[pid];
      let tile = BOARD_DATA[pid];
      while (liquidatedMoney < 0 && (p.houses > 0 || p.hotel)) {
        if (p.hotel) {
          p.hotel = false; p.houses = 4; liquidatedMoney += tile.houseCost / 2;
        } else if (p.houses > 0) {
          p.houses--; liquidatedMoney += tile.houseCost / 2;
        }
      }
    }
    // Mortgage
    for (let pid of playerProps) {
      let p = propsUpdated[pid];
      let tile = BOARD_DATA[pid];
      if (liquidatedMoney < 0 && !p.mortgaged && Object.keys(propsUpdated).filter(k => BOARD_DATA[k].group === tile.group).every(k => propsUpdated[k].houses === 0 && !propsUpdated[k].hotel)) {
        p.mortgaged = true;
        liquidatedMoney += tile.mortgage;
      }
    }

    if (liquidatedMoney >= 0) {
      setProperties(propsUpdated);
      setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === playerId); if (idx > -1) up[idx].money = liquidatedMoney; return up; });
      addLog(`Liquidated to cover debt!`, playerId);
      return false;
    }

    addLog(`🚨 BANKRUPT!`, playerId);
    setProperties(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        if (updated[k].ownerId === playerId) delete updated[k];
      });
      return updated;
    });
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    if (players.length <= 2) {
      const winner = players.find(p => p.id !== playerId);
      addLog(`🏆 WINNER!`, winner?.id);
      setPhase('GAME_OVER');
    } else {
      endTurn();
    }
    return true;
  };

  // --- MOVEMENT ---
  const movePlayerStepByStep = async (steps, triggerAction = true) => {
    setPhase('MOVE');
    await new Promise(r => setTimeout(r, 500));

    let currentSteps = 0;
    const moveOneStep = () => {
      return new Promise((resolve) => {
        setPlayers(prev => {
          const up = [...prev];
          const pIndex = up.findIndex(p => p.id === activePlayer.id);
          if (pIndex === -1) return up;
          const newPos = (up[pIndex].position + 1) % 40;
          up[pIndex].position = newPos;
          if (window.gsap) {
            window.gsap.fromTo(`#pawn-${up[pIndex].id}`, { y: 0 }, { y: -20, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.out" });
          }
          if (newPos === 0 && triggerAction) {
            up[pIndex].money += 2000;
            addLog(`+₹2000 (GO!)`, activePlayer.id);
          }
          return up;
        });
        setTimeout(resolve, 300);
      });
    };

    while (currentSteps < steps) {
      await moveOneStep();
      currentSteps++;
    }

    if (triggerAction) {
      const currentPlayer = players.find(p => p.id === activePlayer.id);
      if (currentPlayer) {
        setTimeout(() => handleLanding(currentPlayer.position), 500);
      }
    }
  };

  const jumpToJail = () => {
    setPlayers(prev => {
      const up = [...prev];
      const pIdx = up.findIndex(p => p.id === activePlayer.id);
      if (pIdx > -1) {
        up[pIdx].position = 10;
        up[pIdx].inJail = true;
        up[pIdx].jailTurns = 0;
      }
      return up;
    });
    setPhase('MANAGE');
  };

  // --- CORE LOOP ---
  const payJailFine = () => {
    if (activePlayer.money >= 500) {
      payBank(500, "Jail Fine");
      setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === activePlayer.id); if (idx > -1) { up[idx].inJail = false; up[idx].jailTurns = 0; } return up; });
      addLog(`Paid fine to escape!`, activePlayer.id);
    } else {
      addLog(`Not enough money!`, activePlayer.id);
    }
  };

  const useJailCard = () => {
    if (activePlayer.getOutOfJailFree > 0) {
      setPlayers(prev => { const up = [...prev]; const idx = up.findIndex(p => p.id === activePlayer.id); if (idx > -1) { up[idx].inJail = false; up[idx].jailTurns = 0; up[idx].getOutOfJailFree -= 1; } return up; });
      addLog(`Used Jail Card!`, activePlayer.id);
    }
  };

  const rollDice = () => {
    if (isRolling || phase !== 'ROLL') return;
    setIsRolling(true);
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const isDouble = d1 === d2;
      setDice([d1, d2]);
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
        if (ownership.mortgaged) {
          addLog(`Property mortgaged.`, activePlayer.id);
          setPhase('MANAGE');
        } else {
          payRentAction();
        }
      }
      else setPhase('MANAGE');
    }
    else if (tile.type === 'chance' || tile.type === 'chest') {
      const deck = tile.type === 'chance' ? CARDS.CHANCE : CARDS.CHEST;
      const card = deck[Math.floor(Math.random() * deck.length)];
      setActiveCard({ type: tile.type.toUpperCase(), ...card });
      setPhase('ACTION_CARD');
    }
    else if (tile.type === 'tax') {
      payBank(tile.amount, `Paid ${tile.name}`);
      setPhase('MANAGE');
    }
    else if (tile.id === 20) {
      const parkingReward = bank?.parking || createParkingReward();
      const nextParkingReward = createParkingReward();

      setPlayers(prev => {
        const up = [...prev];
        const pIndex = up.findIndex(p => p.id === activePlayer.id);
        if (pIndex > -1) up[pIndex].money += parkingReward.amount;
        return up;
      });

      setBank(prev => ({ ...prev, parking: nextParkingReward }));
      addLog(`Parking reward +₹${parkingReward.amount}`, activePlayer.id);

      if (nextParkingReward.multiplier > 1) {
        addLog(`Next parking: x${nextParkingReward.multiplier} bonus!`);
      }

      setPhase('MANAGE');
    }
    else if (tile.id === 30) {
      addLog(`Sent to Jail!`, activePlayer.id);
      jumpToJail();
    } else {
      setPhase('MANAGE');
    }
  };

  const buyProperty = () => {
    const tile = BOARD_DATA[activePlayer.position];
    if (activePlayer.money >= tile.price) {
      setPlayers(prev => { const up = [...prev]; up[turn].money -= tile.price; return up; });
      setProperties(prev => ({ ...prev, [tile.id]: { ownerId: activePlayer.id, houses: 0, hotel: false, mortgaged: false } }));
      addLog(`Bought property`, activePlayer.id);
      setPhase('MANAGE');
    } else {
      addLog(`No funds!`, activePlayer.id);
      setPhase('MANAGE');
    }
  };

  const startAuction = () => {
    const tile = BOARD_DATA[activePlayer.position];
    setAuctionState({
      propertyId: tile.id,
      bidders: players.map(p => p.id),
      targetBid: Math.max(10, Math.floor(tile.price * 0.1)),
      highestBid: 0,
      highestBidderId: null,
      currentBidderIndex: 0
    });
    setPhase('ACTION_AUCTION');
  };

  const finalizeAuction = (state, winnerId, amount) => {
      const winnerObj = players.find(p => p.id === winnerId);
      if(winnerObj && winnerObj.money >= amount) {
          setPlayers(prev => { const up=[...prev]; const idx=up.findIndex(p=>p.id===winnerId); if(idx>-1) up[idx].money -= amount; return up; });
          setProperties(prev => ({...prev, [state.propertyId]: { ownerId: winnerId, houses: 0, hotel: false, mortgaged: false }}));
          addLog(`${winnerObj.name} wins auction for ₹${amount}!`);
      } else {
          addLog("Auction failed.");
      }
      setPhase('MANAGE');
      setAuctionState(null);
  };

  const placeBid = (overrideBid = null) => {
     if(!auctionState) return;
     const currentId = auctionState.bidders[auctionState.currentBidderIndex];
     const currentBiderObj = players.find(p => p.id === currentId);
     const bid = typeof overrideBid === 'number' ? overrideBid : auctionState.targetBid;

     if (bid <= auctionState.highestBid && auctionState.highestBid > 0) return addLog("Bid too low", currentId);
     if (currentBiderObj.money < bid) return addLog("Not enough money", currentId);

     if (auctionState.bidders.length === 1) {
         return finalizeAuction(auctionState, currentId, bid); 
     }

     const nextIndex = (auctionState.currentBidderIndex + 1) % auctionState.bidders.length;
     setAuctionState(prev => ({
         ...prev,
         highestBid: bid,
         highestBidderId: currentId,
         targetBid: bid + 10,
         currentBidderIndex: nextIndex
     }));
     addLog(`Bids ₹${bid}`, currentId);
  };

  const foldAuction = () => {
     if(!auctionState) return;
     const currentId = auctionState.bidders[auctionState.currentBidderIndex];
     
     addLog(`Folds`, currentId);
     
     const newBidders = auctionState.bidders.filter(id => id !== currentId);

     if (newBidders.length === 1 && auctionState.highestBidderId === newBidders[0]) {
         finalizeAuction(auctionState, newBidders[0], Math.max(10, auctionState.highestBid));
     } else if (newBidders.length === 0) {
         addLog("Everyone folded.");
         setPhase('MANAGE');
         setAuctionState(null);
     } else {
         const nextIndex = auctionState.currentBidderIndex % newBidders.length;
         setAuctionState(prev => ({
            ...prev,
            bidders: newBidders,
            currentBidderIndex: nextIndex
         }));
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

  const payRentAction = () => {
    const tile = BOARD_DATA[activePlayer.position];
    const ownership = properties[tile.id];
    const ownerIdx = players.findIndex(p => p.id === ownership.ownerId);
    const owner = players[ownerIdx];
    if (!owner) return setPhase('MANAGE');
    const amount = calculateRent(tile, ownership);
    setPlayers(prev => {
      const up = [...prev];
      if (up[turn]) up[turn].money -= amount;
      if (up[ownerIdx]) up[ownerIdx].money += amount;
      return up;
    });
    addLog(`Paid ₹${amount} rent.`, activePlayer.id);
    if (!checkBankruptcy(activePlayer.id, activePlayer.money - amount)) {
      setPhase('MANAGE');
    }
  };

  const payBank = (amt, reason) => {
    setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money -= amt; return up; });
    addLog(`Paid Bank ₹${amt}`, activePlayer.id);
    checkBankruptcy(activePlayer.id, activePlayer.money - amt);
  };

  const applyCard = () => {
    const result = activeCard.action(activePlayer);
    setActiveCard(null);
    if (result.type === 'RECEIVE_BANK') {
      setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money += result.amount; return up; });
      setPhase('MANAGE');
    } else if (result.type === 'PAY_BANK') {
      payBank(result.amount, "Card Fine");
      setPhase('MANAGE');
    } else if (result.type === 'MOVE_TO') {
      const diff = result.pos >= activePlayer.position ? result.pos - activePlayer.position : (40 - activePlayer.position) + result.pos;
      movePlayerStepByStep(diff, true);
    } else if (result.type === 'GOTO_JAIL') {
      jumpToJail();
    } else if (result.type === 'GET_OUT_OF_JAIL_FREE') {
      setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].getOutOfJailFree = (up[turn].getOutOfJailFree || 0) + 1; return up; });
      setPhase('MANAGE');
    }
  };

  const endTurn = () => {
    setDoublesCount(0);
    setTurn((turn + 1) % players.length);
    setPhase('ROLL');
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
      setProperties(prev => ({ ...prev, [propId]: { ...prop, mortgaged: true } }));
      setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money += tile.mortgage; return up; });
      addLog(`Mortgaged property`, activePlayer.id);
    } else {
      const cost = Math.floor(tile.mortgage * 1.1);
      if (activePlayer.money >= cost) {
        setProperties(prev => ({ ...prev, [propId]: { ...prop, mortgaged: false } }));
        setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money -= cost; return up; });
        addLog(`Redeemed property`, activePlayer.id);
      } else {
        addLog("No funds!", activePlayer.id);
      }
    }
  };

  const sellHouse = (propId) => {
    const prop = properties[propId];
    const tile = BOARD_DATA[propId];

    if (prop.hotel) {
      setProperties(prev => ({ ...prev, [propId]: { ...prop, hotel: false, houses: 4 } }));
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += tile.houseCost / 2; return up; });
      addLog(`Sold HOTEL.`, activePlayer.id);
    } else if (prop.houses > 0) {
      setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: prop.houses - 1 } }));
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += tile.houseCost / 2; return up; });
      addLog(`Sold house.`, activePlayer.id);
    } else {
      // Sell property to bank
      setProperties(prev => {
        const up = { ...prev };
        delete up[propId];
        return up;
      });
      setPlayers(prev => {
        const up = [...prev];
        const pIndex = up.findIndex(p => p.id === activePlayer.id);
        if (pIndex > -1) up[pIndex].money += tile.price / 2;
        return up;
      });
      addLog(`Sold ${tile.name}.`, activePlayer.id);
    }
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
        addLog(`House built.`, activePlayer.id);
      } else if (prop.houses === 4 && !prop.hotel) {
        setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: 0, hotel: true } }));
        setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money -= tile.houseCost; return up; });
        addLog(`HOTEL built!`, activePlayer.id);
      }
    } else addLog("No funds!", activePlayer.id);
  };

  // --- BOT AI AUTOMATION ---
  useEffect(() => {
    if (activePlayer.isBot && phase === 'ROLL' && !isRolling) {
      if (activePlayer.inJail) {
         if (activePlayer.getOutOfJailFree > 0) setTimeout(useJailCard, 1000);
         else if (activePlayer.jailTurns >= 2 && activePlayer.money > 1000) setTimeout(payJailFine, 1000);
         else setTimeout(rollDice, 1500);
      } else {
         setTimeout(rollDice, 1500);
      }
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

        // Auto Fold if they cannot afford the minimum required bid
        if (currentPlayerObj.money < nextBid) {
           const timer = setTimeout(() => {
               foldAuction(); 
           }, 500); 
           return () => clearTimeout(timer);
        }

        if (currentPlayerObj.isBot) {
            const timer = setTimeout(() => {
                const tile = BOARD_DATA[auctionState.propertyId];
                const maxWillingToPay = tile.price * 1.2;
                
                if (nextBid > maxWillingToPay || currentPlayerObj.money < nextBid + 500) {
                    foldAuction();
                } else {
                    placeBid(nextBid);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }
  }, [phase, auctionState, players]);


  // --- RENDER HELPERS ---
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

  const getTileOrientation = (id) => {
    if (id === 0) return '-rotate-45';
    if (id >= 1 && id <= 9) return 'rotate-0';
    if (id === 10) return 'rotate-45';
    if (id >= 11 && id <= 19) return 'rotate-90';
    if (id === 20) return 'rotate-135';
    if (id >= 21 && id <= 29) return 'rotate-180';
    if (id === 30) return '-rotate-135';
    if (id >= 31 && id <= 39) return '-rotate-90';
    return '';
  };

  // --- SCREENS ---
  if (appState === 'setup') {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-blue-100 flex flex-col items-center">
          <h1 className="text-5xl font-black text-blue-600 mb-2 tracking-tighter">VYAPARI</h1>
          <p className="text-slate-400 mb-8 font-medium italic text-center">Complete Indian Edition</p>
          <div className="w-full space-y-6 mb-8 text-center">

            {/* STARTING MONEY INPUT */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Starting Money</h3>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setStartingMoney(prev => Math.max(1500, prev - 500))}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all text-blue-600"
                >
                  <Minus size={18} strokeWidth={3} />
                </button>
                <div className="flex-1 bg-blue-50 border-2 border-blue-100 rounded-2xl py-3 px-4 flex items-center justify-center relative overflow-hidden group">
                  <span className="text-xl font-black text-blue-600 z-10">₹{startingMoney.toLocaleString()}</span>
                  <input
                    type="range"
                    min="1500"
                    max="20000"
                    step="500"
                    value={startingMoney}
                    onChange={(e) => setStartingMoney(parseInt(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                </div>
                <button
                  onClick={() => setStartingMoney(prev => Math.min(20000, prev + 500))}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all text-blue-600"
                >
                  <Plus size={18} strokeWidth={3} />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Adjust range: 1.5K - 20K</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Game Mode</h3>
              <div className="flex gap-4 w-full">
                <button onClick={() => setGameMode('bot')} className={`flex-1 py-3 px-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${gameMode === 'bot' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}><Bot size={20} /><span className="text-xs uppercase">Single Player</span></button>
                <button onClick={() => setGameMode('multi')} className={`flex-1 py-3 px-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${gameMode === 'multi' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}><Users size={20} /><span className="text-xs uppercase">Multiplayer</span></button>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Players</h3>
              <div className="flex gap-4 w-full">
                {[2, 3, 4].map(n => (<button key={n} onClick={() => setPlayerCount(n)} className={`flex-1 py-4 rounded-2xl font-black text-xl transition-all ${playerCount === n ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-400'}`}>{n}</button>))}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
              setGameState({
                players: Array.from({ length: playerCount }).map((_, i) => ({ id: i + 1, name: gameMode === 'bot' && i > 0 ? `Bot ${i + 1}` : `Player ${i + 1}`, color: colors[i], money: startingMoney, position: 0, isBot: gameMode === 'bot' && i > 0, inJail: false, jailTurns: 0 })),
                properties: {},
                bank: { houses: 32, hotels: 12, parking: createParkingReward() },
                currentTurn: 0,
                phase: 'ROLL',
                dice: [1, 1]
              });
              setDoublesCount(0);
              setActiveCard(null);
              setSelectedTile(null);
              setFloatingLogs([]);
              setTradeState(null);
              setAuctionState(null);
              setManageModal(false);
              setAppState('game');
            }}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-2xl shadow-xl flex items-center justify-center gap-3 hover:bg-blue-700 active:scale-95 transition-all"
          ><Play fill="currentColor" /> START GAME</button>
        </div>
      </div>
    );
  }

  if (phase === 'GAME_OVER') {
    const winner = players[0] || { name: 'Player' };
    return (
      <div className="win-screen min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center w-full max-w-md border-2 border-yellow-300">
          <h1 className="text-3xl font-black text-slate-800 mb-6">🏆 Winner: {winner.name}</h1>
          <button onClick={() => setAppState('setup')} className="bg-blue-600 text-white py-3 px-6 rounded-xl font-black hover:bg-blue-700 active:scale-95 transition-all">
            Restart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 flex flex-col items-center justify-center p-0 sm:p-4 font-sans select-none overflow-x-hidden relative">

      {/* GLOBAL KEYFRAME STYLE */}
      <style>{`
        @keyframes floatUpVanish {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(-40px); }
          100% { opacity: 0; transform: translateY(-60px); }
        }
        .animate-float-up-vanish {
          animation: floatUpVanish 3s ease-out forwards;
        }
        @keyframes dieRoll {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .animate-die-roll {
          animation: dieRoll 0.1s linear infinite;
        }
      `}</style>

      {/* QUIT BUTTON */}
      <button onClick={() => setAppState('setup')} className="absolute top-4 left-1/2 -translate-x-1/2 z-[120] bg-white/90 hover:bg-red-500 hover:text-white transition-all p-3 sm:p-4 rounded-full shadow-lg flex items-center gap-2 group border border-slate-200">
        <LogOut size={20} /><span className="max-w-0 overflow-hidden group-hover:max-w-[80px] transition-all text-sm font-black px-0 group-hover:px-1 uppercase tracking-tighter">Quit</span>
      </button>

      {/* TOP PLAYERS */}
      <div className="w-full max-w-[850px] flex justify-between items-start mb-6 px-4">
        <div className="flex flex-col items-center gap-4">
          <DiceArea isActive={turn === 1} dice={dice} isRolling={isRolling} onRoll={rollDice} />
          {players[1] && <PlayerCard player={players[1]} isActive={turn === 1} logs={floatingLogs} />}
        </div>
        <div className="flex flex-col items-center gap-4">
          <DiceArea isActive={turn === 2} dice={dice} isRolling={isRolling} onRoll={rollDice} />
          {players[2] && <PlayerCard player={players[2]} isActive={turn === 2} logs={floatingLogs} />}
        </div>
      </div>

      {/* BOARD CONTAINER */}
      <div className="relative w-full max-w-[780px] aspect-square bg-[#ceebd7] rounded-none sm:rounded-xl shadow-2xl border-none grid" style={{ gridTemplateColumns: 'repeat(11, minmax(0, 1fr))', gridTemplateRows: 'repeat(11, minmax(0, 1fr))' }}>
        {BOARD_DATA.map((tile) => {
          const style = getGridStyle(tile.id);
          const isCorner = tile.id % 10 === 0;
          const owner = properties[tile.id] ? players.find(p => p.id === properties[tile.id].ownerId) : null;
          const propData = properties[tile.id];
          const occupants = players.filter(p => p.position === tile.id);
          const colorClass = getGroupColor(tile.group);

          return (
            <div key={tile.id} className="relative z-10 border-[0.5px] border-slate-800 flex flex-col items-center justify-center bg-white overflow-visible" style={style} onClick={() => setSelectedTile(tile)}>
              <div className={`absolute inset-0 flex flex-col items-center justify-start ${getTileOrientation(tile.id)}`}>
                {colorClass && (
                  <div className={`absolute top-0 left-0 w-full h-[15%] ${colorClass} border-b-[1.5px] border-slate-800 flex items-center justify-center gap-0.5`}>
                    {propData?.houses > 0 && [...Array(propData.houses)].map((_, i) => <Home key={i} size={8} className="text-white fill-white" />)}
                    {propData?.hotel && <Hotel size={12} className="text-white fill-red-500" />}
                  </div>
                )}
                <div className={`flex flex-col items-center justify-center w-full h-full ${colorClass ? 'pt-[22%]' : 'px-0.5'}`}>
                  {!colorClass && <span className="text-xs sm:text-2xl mb-0.5">{tile.icon || (tile.type === 'station' ? '🚂' : '')}</span>}
                  <span className="text-[min(2vw,7.5px)] sm:text-[0.65rem] font-black uppercase text-center leading-[0.85] px-0.5 w-full break-all overflow-visible h-auto max-h-[45%] flex items-center justify-center">{tile.name}</span>
                  {tile.id === 20 && (
                    <span className="text-[min(1.7vw,6px)] sm:text-[0.55rem] font-black text-green-700 mt-0.5">
                      ₹{(bank?.parking?.amount || PARKING_BASE_BONUS).toLocaleString()}
                    </span>
                  )}
                  {!isCorner && tile.price > 0 && <span className="text-[min(1.8vw,6.5px)] sm:text-[0.55rem] font-bold mt-auto pb-0.5 text-slate-600">₹{tile.price}</span>}
                </div>
                {propData?.mortgaged && (<div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10 text-white font-black text-[8px] uppercase rotate-[-45deg]">Mortgaged</div>)}
              </div>
              {owner && !isCorner && (<div className={`absolute z-20 ${getOwnershipMarkerStyle(tile.id)}`}><PawnIcon colorClass={owner.color} size="w-4 h-4 sm:w-7 sm:h-7" /></div>)}
              <div className="absolute inset-0 p-1 flex items-center justify-center pointer-events-none z-30"><div className="grid grid-cols-2 gap-1 w-full h-full max-w-[85%] max-h-[85%] items-center justify-items-center">
                {occupants.map(p => (<div key={p.id} className="flex items-center justify-center w-full h-full overflow-hidden"><PawnIcon id={`pawn-${p.id}`} colorClass={p.color} size="w-full h-full max-w-[14px] max-h-[14px] sm:max-w-[28px] sm:max-h-[28px]" /></div>))}
              </div></div>
            </div>
          );
        })}

        {/* --- BOARD CENTER AREA --- */}
        <div className="relative flex flex-col justify-center items-center p-3 sm:p-6 overflow-hidden" style={{ gridColumn: '2 / 11', gridRow: '2 / 11' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <h1 className="text-[70px] sm:text-[140px] font-black text-slate-800 rotate-[-45deg] tracking-tighter">VYAPARI</h1>
          </div>

          <div className="z-50 w-full h-full flex flex-col items-center justify-center">
            {/* 5 BUTTONS INSIDE THE BOARD */}
            <div className="absolute top-[8%] sm:top-[6%] left-1/2 -translate-x-1/2 w-[85%] max-w-[450px] grid grid-cols-5 gap-1 sm:gap-3">
              <button onClick={() => setManageModal(true)} className="flex flex-col items-center justify-center bg-white border border-slate-300 rounded-lg sm:rounded-xl p-1.5 sm:p-3 transition-all shadow-sm group hover:bg-red-50 hover:border-red-200">
                <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-red-500 group-active:scale-90" />
                <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-tight mt-1">Manage</span>
              </button>
              <button onClick={() => {
                const targets = players.filter(p => p.id !== activePlayer.id && !p.isBot);
                if (targets.length > 0) setTradeState({ targetPlayerId: targets[0].id, myOffer: { cash: 0, properties: [] }, theirOffer: { cash: 0, properties: [] } });
                else addLog("No trade partners.");
              }} className="flex flex-col items-center justify-center bg-white border border-slate-300 rounded-lg sm:rounded-xl p-1.5 sm:p-3 transition-all shadow-sm group hover:bg-blue-50 hover:border-blue-200">
                <Repeat className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500 group-active:scale-90" />
                <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-tight mt-1">Trade</span>
              </button>
              <button onClick={() => addLog("Loan: Game data")} className="flex flex-col items-center justify-center bg-white border border-slate-300 rounded-lg sm:rounded-xl p-1.5 sm:p-3 transition-all shadow-sm group hover:bg-slate-50 hover:border-slate-400">
                <Save className="w-4 h-4 sm:w-6 sm:h-6 text-slate-600 group-active:scale-90" />
                <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-tight mt-1">Loan</span>
              </button>
            </div>

            {/* ACTION MODAL - INSIDE BOARD */}
            {(phase.startsWith('ACTION') || (phase === 'ROLL' && activePlayer.inJail && !activePlayer.isBot)) && activePlayer.position !== undefined && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 mt-16 shadow-2xl border-[2px] border-blue-500 w-full max-w-[220px] scale-90 sm:scale-100 animate-in zoom-in-95 duration-200">
                <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Decision Required</p>
                
                {phase === 'ROLL' && activePlayer.inJail && (
                  <>
                    <h2 className="text-lg font-black text-center mb-2 text-slate-800">In Jail</h2>
                    <p className="text-[10px] text-center text-slate-500 mb-3 font-bold uppercase">{3 - (activePlayer.jailTurns || 0)} attempts left</p>
                    <div className="space-y-1.5 flex flex-col items-stretch max-w-[150px] mx-auto">
                        <button onClick={rollDice} disabled={isRolling} className="w-full bg-blue-500 text-white py-2 rounded-lg font-black text-[10px] shadow-sm active:scale-95 transition-all">🎲 Roll Doubles</button>
                        <button onClick={payJailFine} disabled={activePlayer.money < 500} className={`w-full text-white py-2 rounded-lg font-black text-[10px] shadow-sm transition-all ${activePlayer.money >= 500 ? 'bg-red-500 active:scale-95 cursor-pointer' : 'bg-slate-400 opacity-50 cursor-not-allowed'}`}>💸 Pay ₹500</button>
                        <button onClick={useJailCard} disabled={!activePlayer.getOutOfJailFree} className={`w-full text-white py-2 rounded-lg font-black text-[10px] shadow-sm transition-all ${activePlayer.getOutOfJailFree > 0 ? 'bg-orange-500 active:scale-95 cursor-pointer' : 'bg-slate-400 opacity-50 cursor-not-allowed'}`}>🎫 Use Card</button>
                    </div>
                  </>
                )}

                {phase === 'ACTION_BUY' && (
                  <>
                    <h2 className="text-lg font-black text-center mb-2 truncate">{BOARD_DATA[activePlayer.position].name}</h2>
                    <div className="bg-blue-50 p-2 rounded-2xl text-center border-2 border-blue-100 mb-3">
                      <span className="text-slate-500 text-xs uppercase font-bold">Asking Price</span>
                      <p className="text-xl font-black text-blue-600">₹{BOARD_DATA[activePlayer.position].price}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={buyProperty} disabled={activePlayer.money < BOARD_DATA[activePlayer.position].price} className={`flex-1 text-white py-2 rounded-xl font-black text-[10px] flex items-center justify-center gap-1 shadow-lg active:scale-95 transition-all ${activePlayer.money >= BOARD_DATA[activePlayer.position].price ? 'bg-green-500 shadow-green-200 hover:bg-green-600' : 'bg-slate-400 shadow-slate-200 opacity-50 cursor-not-allowed'}`}><Check size={14} /> BUY</button>
                      <button onClick={startAuction} className="flex-1 bg-purple-500 text-white py-2 rounded-xl font-black text-[10px] flex items-center justify-center gap-1 shadow-lg shadow-purple-200 active:scale-95">AUCTION</button>
                    </div>
                  </>
                )}

                {phase === 'ACTION_AUCTION' && auctionState && (
                  <div className="w-full text-left">
                    <h2 className="text-[14px] font-black mb-2 uppercase text-center text-purple-900 border-b-2 border-purple-200 pb-1 truncate">{BOARD_DATA[auctionState.propertyId].name}</h2>
                    <div className="bg-purple-50 p-2 rounded-lg text-center mb-3">
                         <span className="text-[9px] uppercase font-bold text-slate-500">Highest Bid</span>
                         <div className="text-xl font-black text-purple-600">₹{auctionState.highestBid}</div>
                         <div className="text-[10px] font-bold text-slate-600 truncate">{auctionState.highestBidderId ? players.find(p=>p.id===auctionState.highestBidderId)?.name : 'None'}</div>
                    </div>
                    
                    <div className="bg-white border-2 border-slate-100 p-2 rounded-lg mb-3 text-center shadow-inner">
                         <span className="text-[9px] uppercase font-bold text-slate-400">Current Bidder</span>
                         <div className="font-black text-sm text-slate-800 truncate">{players.find(p=>p.id===auctionState.bidders[auctionState.currentBidderIndex])?.name}</div>
                         <div className="text-[10px] font-bold text-green-600 mt-0.5">Wallet: ₹{players.find(p=>p.id===auctionState.bidders[auctionState.currentBidderIndex])?.money}</div>
                    </div>

                    <div className="space-y-2">
                        {(!players.find(p => p.id === auctionState.bidders[auctionState.currentBidderIndex])?.isBot) ? (
                            <>
                            <div className="flex flex-col gap-2">
                               <div className="flex bg-slate-50 border-2 border-slate-200 rounded-lg overflow-hidden relative">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">₹</span>
                                  <input type="number" step="10" min={Math.max(10, auctionState.highestBid + 10)} max={players.find(p=>p.id===auctionState.bidders[auctionState.currentBidderIndex])?.money || 0} value={auctionState.targetBid} onChange={e => setAuctionState({...auctionState, targetBid: parseInt(e.target.value) || 0})} className="w-full bg-transparent p-1.5 pl-6 font-black text-slate-800 text-left text-sm outline-none" />
                               </div>
                               <input type="range" step="10" min={Math.max(10, auctionState.highestBid + 10)} max={Math.max(Math.max(10, auctionState.highestBid + 10), players.find(p=>p.id===auctionState.bidders[auctionState.currentBidderIndex])?.money || 0)} value={Math.max(Math.max(10, auctionState.highestBid + 10), auctionState.targetBid)} onChange={e => setAuctionState({...auctionState, targetBid: parseInt(e.target.value) || 0})} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                            </div>
                            <div className="flex gap-1.5 mt-2">
                               <button onClick={() => placeBid()} className="flex-1 bg-green-500 text-white font-black text-[10px] py-2 sm:py-3 rounded-lg shadow-md uppercase active:scale-95 transition-all">Bid</button>
                               <button onClick={foldAuction} className="flex-1 bg-red-500 text-white font-black text-[10px] py-2 sm:py-3 rounded-lg shadow-md uppercase active:scale-95 transition-all">Fold</button>
                            </div>
                            </>
                        ) : (
                            <div className="text-center font-bold text-slate-500 text-[10px] italic py-2 animate-pulse">Bot is thinking...</div>
                        )}
                    </div>
                  </div>
                )}

                {phase === 'ACTION_CARD' && activeCard && (
                  <div className="text-center">
                    <div className="mb-5">{activeCard.type === 'CHANCE' ? <HelpCircle size={48} className="mx-auto text-purple-500 mb-2" /> : <Briefcase size={48} className="mx-auto text-blue-500 mb-2" />}<h2 className="font-black text-2xl uppercase">{activeCard.type}</h2></div>
                    <p className="font-bold text-slate-700 mb-8 bg-slate-100 p-5 rounded-2xl text-sm italic leading-relaxed border border-slate-200 shadow-inner">"{activeCard.text}"</p>
                    <button onClick={applyCard} className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-lg">CONTINUE</button>
                  </div>
                )}
              </div>
            )}

            {phase === 'MANAGE' && !activePlayer.isBot && (
              <div className="bg-slate-800/95 backdrop-blur-md rounded-3xl p-6 mt-16 shadow-2xl border-[3px] border-slate-600 w-full max-w-[220px] scale-90 sm:scale-100 text-white text-center animate-in fade-in">
                <Building size={40} className="mx-auto text-yellow-400 mb-2" />
                <h3 className="font-black text-xl mb-1">Property Control</h3>
                <p className="text-xs text-slate-300 mb-3 italic">Select owned property to Upgrade or Mortgage.</p>
                <button onClick={endTurn} className="w-full bg-yellow-500 text-slate-900 py-2 rounded-xl font-black text-base shadow-lg flex items-center justify-center gap-3 hover:bg-yellow-400 active:scale-95 transition-all">FINISH TURN <ArrowRight size={20} /></button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM PLAYERS */}
      <div className="w-full max-w-[850px] flex justify-between items-start mt-6 px-4">
        <div className="flex flex-col items-center gap-4">
          {players[0] && <PlayerCard player={players[0]} isActive={turn === 0} logs={floatingLogs} />}
          <DiceArea isActive={turn === 0} dice={dice} isRolling={isRolling} onRoll={rollDice} />
        </div>
        <div className="flex flex-col items-center gap-4">
          {players[3] && <PlayerCard player={players[3]} isActive={turn === 3} logs={floatingLogs} />}
          <DiceArea isActive={turn === 3} dice={dice} isRolling={isRolling} onRoll={rollDice} />
        </div>
      </div>

      {/* TRADE MODAL */}
      {tradeState && (
        <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[600px] shadow-2xl flex flex-col p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase text-blue-900 border-b-4 border-blue-500 pb-2">Trade Negotiation</h2>
              <button onClick={() => { setTradeState(null); setSelectorTarget(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500"><X size={24} /></button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Trade With:</label>
              <select
                value={tradeState.targetPlayerId || ''}
                onChange={e => setTradeState({ ...tradeState, targetPlayerId: parseInt(e.target.value), theirOffer: { cash: tradeState.theirOffer.cash, properties: [] } })}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 font-bold text-slate-800"
              >
                {players.filter(p => p.id !== activePlayer.id && !p.isBot).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto mb-6">
              {/* MY OFFER */}
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <h3 className="font-black text-blue-800 text-center uppercase mb-3 text-sm">Your Offer</h3>
                <div className="mb-3">
                  <label className="text-[10px] uppercase font-bold text-blue-600 block mb-1">Cash (₹)</label>
                  <input type="number" step="100" min="0" max={activePlayer.money} value={tradeState.myOffer.cash} onChange={e => setTradeState({ ...tradeState, myOffer: { ...tradeState.myOffer, cash: parseInt(e.target.value) || 0 } })} className="w-full bg-white rounded-lg p-2 font-bold text-blue-900 border border-blue-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-blue-600 block mb-1">Properties</label>
                  <button onClick={() => setSelectorTarget('my')} className="w-full bg-white border-2 border-blue-200 text-blue-600 py-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-sm hover:bg-blue-100">
                    <ShoppingCart size={14} /> Select
                  </button>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tradeState.myOffer.properties.map(pid => (
                      <span key={pid} className="bg-blue-600 text-white px-2 py-1 rounded text-[9px] font-black">{BOARD_DATA[pid].name}</span>
                    ))}
                    {tradeState.myOffer.properties.length === 0 && <span className="text-[10px] text-slate-400 font-bold">No properties selected</span>}
                  </div>
                </div>
              </div>
              {/* THEIR OFFER */}
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <h3 className="font-black text-orange-800 text-center uppercase mb-3 text-sm">You Receive</h3>
                <div className="mb-3">
                  <label className="text-[10px] uppercase font-bold text-orange-600 block mb-1">Cash (₹)</label>
                  <input type="number" step="100" min="0" value={tradeState.theirOffer.cash} onChange={e => setTradeState({ ...tradeState, theirOffer: { ...tradeState.theirOffer, cash: parseInt(e.target.value) || 0 } })} className="w-full bg-white rounded-lg p-2 font-bold text-orange-900 border border-orange-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-orange-600 block mb-1">Properties</label>
                  <button onClick={() => setSelectorTarget('their')} className="w-full bg-white border-2 border-orange-200 text-orange-600 py-2 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-sm hover:bg-orange-100">
                    <ShoppingCart size={14} /> Select
                  </button>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tradeState.theirOffer.properties.map(pid => (
                      <span key={pid} className="bg-orange-500 text-white px-2 py-1 rounded text-[9px] font-black">{BOARD_DATA[pid].name}</span>
                    ))}
                    {tradeState.theirOffer.properties.length === 0 && <span className="text-[10px] text-slate-400 font-bold">No properties selected</span>}
                  </div>
                </div>
              </div>
            </div>

            <button onClick={executeTrade} className="w-full bg-green-500 py-4 rounded-xl text-white font-black text-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-2">
              <Check size={24} /> CONFIRM TRADE
            </button>
          </div>
        </div>
      )}

      {selectorTarget && tradeState && (
        <div className="fixed inset-0 z-[140] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[400px] shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black uppercase text-slate-800 tracking-wider">Select Property</h3>
              <X className="cursor-pointer text-slate-400" onClick={() => setSelectorTarget(null)} />
            </div>
            <div className="max-h-[300px] overflow-y-auto grid grid-cols-2 gap-2">
              {Object.keys(properties).filter(k => properties[k].ownerId === (selectorTarget === 'my' ? activePlayer.id : tradeState.targetPlayerId)).map(pid => {
                const propertyId = parseInt(pid);
                const selectedList = selectorTarget === 'my' ? tradeState.myOffer.properties : tradeState.theirOffer.properties;
                const isSelected = selectedList.includes(propertyId);
                return (
                  <button key={pid} onClick={() => {
                    const targetKey = selectorTarget === 'my' ? 'myOffer' : 'theirOffer';
                    const currentProps = tradeState[targetKey].properties;
                    const nextProps = isSelected ? currentProps.filter(id => id !== propertyId) : [...currentProps, propertyId];
                    setTradeState({ ...tradeState, [targetKey]: { ...tradeState[targetKey], properties: nextProps } });
                  }} className={`text-left p-3 rounded-xl font-black transition-all border-2 text-[10px] sm:text-xs min-h-[60px] flex items-center justify-between ${isSelected ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="truncate pr-1">{BOARD_DATA[propertyId].name}</span>
                    {isSelected && <Check size={14} className="shrink-0" />}
                  </button>
                );
              })}
              {Object.keys(properties).filter(k => properties[k].ownerId === (selectorTarget === 'my' ? activePlayer.id : tradeState.targetPlayerId)).length === 0 && (
                <div className="col-span-2 text-center text-slate-400 font-bold py-8">No properties.</div>
              )}
            </div>
            <button onClick={() => setSelectorTarget(null)} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black mt-6 uppercase shadow-xl">Done</button>
          </div>
        </div>
      )}

      {/* PROPERTY DASHBOARD MODAL */}
      {manageModal && (
        <div className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[600px] max-h-[80vh] shadow-2xl flex flex-col p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase text-blue-900 border-b-4 border-blue-500 pb-2">Manage Properties</h2>
              <button onClick={() => setManageModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500"><X size={24} /></button>
            </div>
            <div className="overflow-y-auto pr-2 space-y-3 flex-1">
              {Object.entries(properties)
                .filter(([id, p]) => p.ownerId === activePlayer.id)
                .map(([id, p]) => {
                  const tile = BOARD_DATA[id];
                  const colorClass = getGroupColor(tile.group) || 'bg-slate-400';
                  return (
                    <div key={id} className={`flex flex-col sm:flex-row items-center gap-4 bg-white border-[2px] ${p.mortgaged ? 'border-red-200 opacity-80' : 'border-slate-100'} p-3 rounded-xl shadow-sm transition-all hover:shadow-md`}>
                      <div className={`w-full sm:w-20 sm:h-20 ${colorClass} rounded-lg flex items-center justify-center p-2 text-white font-black text-center text-xs leading-tight shadow-inner`}>
                        {tile.name}
                      </div>
                      <div className="flex-1 flex flex-col gap-2 w-full">
                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="text-xs font-bold text-slate-500 uppercase">Status</span>
                          <span className={`text-sm font-black ${p.mortgaged ? 'text-red-500' : (p.hotel ? 'text-red-600' : 'text-slate-800')}`}>{p.mortgaged ? 'MORTGAGED' : (p.hotel ? 'HOTEL' : `${p.houses || 0} HOUSES`)}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => buildHouse(id)} disabled={p.mortgaged || p.hotel || tile.type !== 'property'} className="flex-1 bg-green-500 text-white text-[10px] font-black py-2 px-1 rounded-lg uppercase tracking-tight shadow-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex justify-center items-center gap-1"><Home size={12}/> Build</button>
                          <button onClick={() => sellHouse(id)} disabled={p.mortgaged} className="flex-1 bg-red-500 text-white text-[10px] font-black py-2 px-1 rounded-lg uppercase tracking-tight shadow-sm active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex justify-center items-center gap-1"><ShoppingCart size={12}/> Sell <span className="hidden sm:inline">{(p.houses > 0 || p.hotel) ? 'House' : 'Prop'}</span></button>
                          <button onClick={() => toggleMortgage(id)} className={`flex-1 ${p.mortgaged ? 'bg-blue-500' : 'bg-orange-500'} text-white text-[10px] font-black py-2 px-1 rounded-lg uppercase tracking-tight shadow-sm active:scale-95 transition-all flex justify-center items-center gap-1`}><RefreshCw size={12}/> {p.mortgaged ? 'Redeem' : 'Mortgage'}</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {Object.entries(properties).filter(([id, p]) => p.ownerId === activePlayer.id).length === 0 && (
                <div className="text-center text-slate-400 font-bold p-8 border-2 border-dashed border-slate-200 rounded-2xl">
                  You don't own any properties yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PROPERTY MANAGE / VIEW MODAL */}
      {selectedTile && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-center justify-center p-2" onClick={() => setSelectedTile(null)}>
          <div className="bg-white rounded-xl w-full max-w-[240px] shadow-2xl overflow-hidden border-[2px] border-slate-800 flex flex-col" onClick={e => e.stopPropagation()}>
            <div className={`${getGroupColor(selectedTile.group) || 'bg-slate-200'} p-4 text-center border-b-[3px] border-slate-800`}>
              <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${['YELLOW', 'LIGHT_BLUE', 'PINK'].includes(selectedTile.group) ? 'text-slate-800' : 'text-white'}`}>Title Deed</h3>
              <h1 className={`text-2xl font-black uppercase tracking-wider ${['YELLOW', 'LIGHT_BLUE', 'PINK'].includes(selectedTile.group) ? 'text-slate-800' : 'text-white'}`}>{selectedTile.name}</h1>
            </div>
            <div className="p-5 bg-[#fdfdfd] text-slate-800 font-serif">
              {selectedTile.type === 'property' ? (
                <>
                  <div className="flex justify-between items-center mb-3 font-black text-sm italic"><span>RENT Site Only</span><span>₹{selectedTile.rent[0]}</span></div>
                  <div className="space-y-1 text-[11px] font-bold text-slate-600">
                    <div className="flex justify-between"><span>With 1 House</span><span>₹{selectedTile.rent[1]}</span></div>
                    <div className="flex justify-between"><span>With 2 Houses</span><span>₹{selectedTile.rent[2]}</span></div>
                    <div className="flex justify-between"><span>With 3 Houses</span><span>₹{selectedTile.rent[3]}</span></div>
                    <div className="flex justify-between"><span>With 4 Houses</span><span>₹{selectedTile.rent[4]}</span></div>
                  </div>
                  <div className="flex justify-between items-center my-3 font-black text-sm italic border-t border-slate-200 pt-2"><span>With HOTEL</span><span>₹{selectedTile.rent[5]}</span></div>
                  <div className="grid grid-cols-2 gap-4 text-[10px] font-bold border-t border-slate-200 pt-3">
                    <div className="flex flex-col items-center text-center"><span className="text-slate-400 uppercase text-[8px]">Mortgage</span><span className="text-xs">₹{selectedTile.mortgage}</span></div>
                    <div className="flex flex-col items-center text-center"><span className="text-slate-400 uppercase text-[8px]">House cost</span><span className="text-xs">₹{selectedTile.houseCost}</span></div>
                  </div>
                </>
              ) : (
                <div className="text-center font-black py-8 text-2xl">₹{selectedTile.price || selectedTile.amount || '0'}</div>
              )}
            </div>
            {properties[selectedTile.id]?.ownerId === activePlayer.id && phase === 'MANAGE' ? (
              <div className="bg-slate-100 p-4 space-y-3 border-t-2 border-slate-300">
                <p className="text-[10px] text-center font-black text-slate-500 uppercase tracking-widest">Manage Property</p>
                <div className="flex gap-3">
                  <button onClick={() => { buildHouse(selectedTile.id); setSelectedTile(null); }} className="flex-1 bg-green-500 text-white text-xs font-black py-3 rounded-xl shadow flex justify-center items-center gap-1.5"><Home size={14} /> Build</button>
                  <button onClick={() => { toggleMortgage(selectedTile.id); setSelectedTile(null); }} className="flex-1 bg-orange-500 text-white text-xs font-black py-3 rounded-xl shadow flex justify-center items-center gap-1.5"><RefreshCw size={14} /> {properties[selectedTile.id].mortgaged ? 'Redeem' : 'Mortgage'}</button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 text-center border-t-2 border-slate-200">
                <button onClick={() => setSelectedTile(null)} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-500">Close Deed</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
