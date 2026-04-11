// ─────────────────────────────────────────────────────────────────────────────
// boardData.js  –  The complete 40-tile Vyapari board definition
// ─────────────────────────────────────────────────────────────────────────────

export const COLOR_GROUPS = {
  BROWN:      { label: 'Brown',      color: '#c8a96e', light: '#f5e9d0', count: 2 },
  LIGHT_BLUE: { label: 'Light Blue', color: '#87ceeb', light: '#e0f4ff', count: 3 },
  PINK:       { label: 'Pink',       color: '#e91e8c', light: '#fce4f3', count: 3 },
  ORANGE:     { label: 'Orange',     color: '#ff9800', light: '#fff3e0', count: 3 },
  RED:        { label: 'Red',        color: '#e53935', light: '#ffebee', count: 3 },
  YELLOW:     { label: 'Yellow',     color: '#fdd835', light: '#fffde7', count: 3 },
  GREEN:      { label: 'Green',      color: '#43a047', light: '#e8f5e9', count: 3 },
  DARK_BLUE:  { label: 'Dark Blue',  color: '#1565c0', light: '#e3f2fd', count: 2 },
  RAILWAY:    { label: 'Railway',    color: '#455a64', light: '#eceff1', count: 4 },
  UTILITY:    { label: 'Utility',    color: '#78909c', light: '#f0f4f8', count: 2 },
};

// rent[0] = base, rent[1..5] = 1-4 houses then hotel
const TILES = [
  // ── Tile 0 – GO ──────────────────────────────────────────────────────────
  { id: 0,  type: 'corner', name: 'GO',            icon: '🏁', reward: 2000 },

  // ── Brown ─────────────────────────────────────────────────────────────────
  { id: 1,  type: 'property', name: 'Pune',         group: 'BROWN',      price: 600,  houseCost: 500,  mortgage: 300,  rent: [20, 100, 300,  900, 1600, 2500] },
  { id: 2,  type: 'chest',    name: 'Community Chest', icon: '📦' },
  { id: 3,  type: 'property', name: 'Nagpur',        group: 'BROWN',      price: 600,  houseCost: 500,  mortgage: 300,  rent: [40, 200, 600, 1800, 3200, 4500] },
  { id: 4,  type: 'tax',      name: 'Income Tax',   icon: '💸', amount: 2000 },

  // ── Railway ───────────────────────────────────────────────────────────────
  { id: 5,  type: 'railway',  name: 'Mumbai Central', group: 'RAILWAY',   price: 2000, mortgage: 1000, rent: [250, 500, 1000, 2000] },

  // ── Light Blue ────────────────────────────────────────────────────────────
  { id: 6,  type: 'property', name: 'Surat',         group: 'LIGHT_BLUE', price: 1000, houseCost: 500,  mortgage: 500,  rent: [60,  300,  900, 2700, 4000, 5500] },
  { id: 7,  type: 'chance',   name: 'Chance',        icon: '❓' },
  { id: 8,  type: 'property', name: 'Vadodara',      group: 'LIGHT_BLUE', price: 1000, houseCost: 500,  mortgage: 500,  rent: [60,  300,  900, 2700, 4000, 5500] },
  { id: 9,  type: 'property', name: 'Ahmedabad',     group: 'LIGHT_BLUE', price: 1200, houseCost: 500,  mortgage: 600,  rent: [80,  400, 1000, 3000, 4500, 6000] },

  // ── Jail ──────────────────────────────────────────────────────────────────
  { id: 10, type: 'corner', name: 'Jail',            icon: '🏛️' },

  // ── Pink ──────────────────────────────────────────────────────────────────
  { id: 11, type: 'property', name: 'Nashik',        group: 'PINK',       price: 1400, houseCost: 1000, mortgage: 700,  rent: [100, 500, 1500, 4500, 6250, 7500] },
  { id: 12, type: 'utility',  name: 'Electric Co.',  group: 'UTILITY',    price: 1500, mortgage: 750 },
  { id: 13, type: 'property', name: 'Aurangabad',    group: 'PINK',       price: 1400, houseCost: 1000, mortgage: 700,  rent: [100, 500, 1500, 4500, 6250, 7500] },
  { id: 14, type: 'property', name: 'Indore',        group: 'PINK',       price: 1600, houseCost: 1000, mortgage: 800,  rent: [120, 600, 1800, 5000, 7000, 9000] },

  // ── Railway ───────────────────────────────────────────────────────────────
  { id: 15, type: 'railway',  name: 'Howrah Express', group: 'RAILWAY',   price: 2000, mortgage: 1000, rent: [250, 500, 1000, 2000] },

  // ── Orange ────────────────────────────────────────────────────────────────
  { id: 16, type: 'property', name: 'Patna',         group: 'ORANGE',     price: 1800, houseCost: 1000, mortgage: 900,  rent: [140, 700, 2000, 5500, 7500, 9500] },
  { id: 17, type: 'chest',    name: 'Community Chest', icon: '📦' },
  { id: 18, type: 'property', name: 'Bhopal',        group: 'ORANGE',     price: 1800, houseCost: 1000, mortgage: 900,  rent: [140, 700, 2000, 5500, 7500, 9500] },
  { id: 19, type: 'property', name: 'Lucknow',       group: 'ORANGE',     price: 2000, houseCost: 1000, mortgage: 1000, rent: [160, 800, 2200, 6000, 8000, 10000] },

  // ── Free Parking ──────────────────────────────────────────────────────────
  { id: 20, type: 'corner', name: 'Free Parking',    icon: '🅿️' },

  // ── Red ───────────────────────────────────────────────────────────────────
  { id: 21, type: 'property', name: 'Jaipur',        group: 'RED',        price: 2200, houseCost: 1500, mortgage: 1100, rent: [180, 900, 2500, 7000, 8750, 10500] },
  { id: 22, type: 'chance',   name: 'Chance',        icon: '❓' },
  { id: 23, type: 'property', name: 'Hyderabad',     group: 'RED',        price: 2200, houseCost: 1500, mortgage: 1100, rent: [180, 900, 2500, 7000, 8750, 10500] },
  { id: 24, type: 'property', name: 'Chennai',       group: 'RED',        price: 2400, houseCost: 1500, mortgage: 1200, rent: [200,1000, 3000, 9000,11000, 12750] },

  // ── Railway ───────────────────────────────────────────────────────────────
  { id: 25, type: 'railway',  name: 'Rajdhani Exp.', group: 'RAILWAY',    price: 2000, mortgage: 1000, rent: [250, 500, 1000, 2000] },

  // ── Yellow ────────────────────────────────────────────────────────────────
  { id: 26, type: 'property', name: 'Kolkata',       group: 'YELLOW',     price: 2600, houseCost: 1500, mortgage: 1300, rent: [220,1100, 3300, 8000,9750, 11500] },
  { id: 27, type: 'property', name: 'Bengaluru',     group: 'YELLOW',     price: 2600, houseCost: 1500, mortgage: 1300, rent: [220,1100, 3300, 8000,9750, 11500] },
  { id: 28, type: 'utility',  name: 'Water Works',   group: 'UTILITY',    price: 1500, mortgage: 750 },
  { id: 29, type: 'property', name: 'Pune Tech',     group: 'YELLOW',     price: 2800, houseCost: 1500, mortgage: 1400, rent: [240,1200, 3600, 8500,10250,12000] },

  // ── Go To Jail ────────────────────────────────────────────────────────────
  { id: 30, type: 'corner', name: 'Go To Jail',      icon: '👮' },

  // ── Green ─────────────────────────────────────────────────────────────────
  { id: 31, type: 'property', name: 'Srinagar',      group: 'GREEN',      price: 3000, houseCost: 2000, mortgage: 1500, rent: [260,1300, 3900, 9000,11000,12750] },
  { id: 32, type: 'property', name: 'Chandigarh',    group: 'GREEN',      price: 3000, houseCost: 2000, mortgage: 1500, rent: [260,1300, 3900, 9000,11000,12750] },
  { id: 33, type: 'chest',    name: 'Community Chest', icon: '📦' },
  { id: 34, type: 'property', name: 'Amritsar',      group: 'GREEN',      price: 3200, houseCost: 2000, mortgage: 1600, rent: [280,1500, 4500,10000,12000,14000] },

  // ── Railway ───────────────────────────────────────────────────────────────
  { id: 35, type: 'railway',  name: 'Shatabdi Exp.', group: 'RAILWAY',    price: 2000, mortgage: 1000, rent: [250, 500, 1000, 2000] },

  // ── Dark Blue ─────────────────────────────────────────────────────────────
  { id: 36, type: 'chance',   name: 'Chance',        icon: '❓' },
  { id: 37, type: 'property', name: 'Mumbai BKC',    group: 'DARK_BLUE',  price: 3500, houseCost: 2000, mortgage: 1750, rent: [350,1750, 5000,11000,13000,15000] },
  { id: 38, type: 'tax',      name: 'Luxury Tax',    icon: '💎', amount: 750 },
  { id: 39, type: 'property', name: 'Delhi CP',      group: 'DARK_BLUE',  price: 4000, houseCost: 2000, mortgage: 2000, rent: [500,2000, 6000,14000,17000,20000] },
];

export const CHANCE_CARDS = [
  { text: 'Advance to GO. Collect ₹2000!', action: 'GOTO', target: 0, collect: true },
  { text: 'Bank pays dividend of ₹500.', action: 'EARN', amount: 500 },
  { text: 'Go to Jail!', action: 'JAIL' },
  { text: 'Pay tax of ₹1500.', action: 'PAY', amount: 1500 },
  { text: 'Advance to Mumbai BKC.', action: 'GOTO', target: 37 },
  { text: 'Collect ₹1000 from every player!', action: 'COLLECT_ALL', amount: 1000 },
  { text: 'Get Out of Jail Free!', action: 'JAIL_FREE' },
  { text: 'Move back 3 spaces.', action: 'MOVE', amount: -3 },
  { text: "Bank error in your favour – collect ₹2500.", action: 'EARN', amount: 2500 },
  { text: 'Street Repairs: Pay ₹400 per house.', action: 'REPAIR', house: 400, hotel: 1150 },
];

export const CHEST_CARDS = [
  { text: 'Advance to GO. Collect ₹2000!', action: 'GOTO', target: 0, collect: true },
  { text: 'Doctor\'s fee: Pay ₹500.', action: 'PAY', amount: 500 },
  { text: 'Sale of stock: Earn ₹500.', action: 'EARN', amount: 500 },
  { text: 'Collect ₹200 from every player!', action: 'COLLECT_ALL', amount: 200 },
  { text: 'Get Out of Jail Free!', action: 'JAIL_FREE' },
  { text: 'Life insurance matures: Collect ₹1000.', action: 'EARN', amount: 1000 },
  { text: 'Go to Jail!', action: 'JAIL' },
  { text: 'Income tax refund: ₹200.', action: 'EARN', amount: 200 },
  { text: 'Pay hospital fees of ₹1000.', action: 'PAY', amount: 1000 },
  { text: 'You have won 2nd prize in a beauty contest: ₹1000.', action: 'EARN', amount: 1000 },
];

export default TILES;
