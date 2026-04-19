import re

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Fix doubles logic
content = content.replace("// const [doublesCount, setDoublesCount] = useState(0);", "const [doublesCount, setDoublesCount] = useState(0);")
content = content.replace("// setDoublesCount(0);", "setDoublesCount(0);")

# Wait, `rollDice` logic
old_roll_dice = """      const isDouble = d1 === d2;
      setGameState(prev => ({ ...prev, dice: [d1, d2] }));
      setIsRolling(false);
      addLog(`Rolled ${d1 + d2}`, activePlayer.id);
      if (activePlayer.inJail) {"""

new_roll_dice = """      const isDouble = d1 === d2;
      setGameState(prev => ({ ...prev, dice: [d1, d2] }));
      setIsRolling(false);
      addLog(`Rolled ${d1 + d2}`, activePlayer.id);

      if (!activePlayer.inJail) {
        if (isDouble) {
          const newDoublesCount = doublesCount + 1;
          setDoublesCount(newDoublesCount);
          if (newDoublesCount >= 3) {
            addLog("3 Doubles! Go to Jail!", activePlayer.id);
            setDoublesCount(0);
            jumpToJail();
            return;
          } else {
            addLog("Rolled a double! Play again.", activePlayer.id);
          }
        } else {
          setDoublesCount(0);
        }
      }

      if (activePlayer.inJail) {"""
content = content.replace(old_roll_dice, new_roll_dice)

# Let's adjust endTurn so if they rolled a double and are not in jail, their turn doesn't advance.
# Actually, the End Turn button calls `endTurn`.
# Wait! In Monopoly, if you roll a double, you move, act on the space, and then you ROLL AGAIN.
# You only "End Turn" when your final roll was NOT a double.
# If `phase` is MANAGE, and they have `doublesCount > 0` and `!activePlayer.inJail`, pressing End Turn should actually NOT advance `currentTurn`, but just set `phase` to 'ROLL'.
old_end_turn = """  const endTurn = () => {
    setDoublesCount(0);
    setGameState(prev => ({ ...prev, currentTurn: (prev.currentTurn + 1) % prev.players.length, turnSerial: (prev.turnSerial || 0) + 1, phase: 'ROLL' }));
  };"""

new_end_turn = """  const endTurn = () => {
    if (doublesCount > 0 && !activePlayer.inJail && doublesCount < 3) {
      setGameState(prev => ({ ...prev, phase: 'ROLL' }));
    } else {
      setDoublesCount(0);
      setGameState(prev => ({ ...prev, currentTurn: (prev.currentTurn + 1) % prev.players.length, turnSerial: (prev.turnSerial || 0) + 1, phase: 'ROLL' }));
    }
  };"""
content = content.replace(old_end_turn, new_end_turn)

# Fix houses and hotels from Bank
# buildHouse
old_build_house = """      if (prop.houses < 4 && !prop.hotel) {
        setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: prop.houses + 1 } }));
        setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money -= tile.houseCost; return up; });
        showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', tile.houseCost, `Built House (${tile.name})`);
        playSfx(buildSfx);
      } else if (prop.houses === 4 && !prop.hotel) {
        setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: 0, hotel: true } }));
        setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money -= tile.houseCost; return up; });
        showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', tile.houseCost, `Built HOTEL (${tile.name})`);
        playSfx(buildSfx);
      }"""

new_build_house = """      if (prop.houses < 4 && !prop.hotel) {
        if (bank.houses <= 0) return addLog("Bank has no houses!", activePlayer.id);
        setBank(prev => ({ ...prev, houses: prev.houses - 1 }));
        setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: prop.houses + 1 } }));
        setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money -= tile.houseCost; return up; });
        showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', tile.houseCost, `Built House (${tile.name})`);
        playSfx(buildSfx);
      } else if (prop.houses === 4 && !prop.hotel) {
        if (bank.hotels <= 0) return addLog("Bank has no hotels!", activePlayer.id);
        setBank(prev => ({ ...prev, houses: prev.houses + 4, hotels: prev.hotels - 1 }));
        setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: 0, hotel: true } }));
        setPlayers(prev => { const up = [...prev]; if (up[turn]) up[turn].money -= tile.houseCost; return up; });
        showTransfer({ name: activePlayer.name, color: activePlayer.color }, 'BANK', tile.houseCost, `Built HOTEL (${tile.name})`);
        playSfx(buildSfx);
      }"""
content = content.replace(old_build_house, new_build_house)

# sellHouse
old_sell_house = """    if (prop.hotel) {
      setProperties(prev => ({ ...prev, [propId]: { ...prop, hotel: false, houses: 4 } }));
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += tile.houseCost / 2; return up; });
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, tile.houseCost / 2, `Sold HOTEL (${tile.name})`);
    } else if (prop.houses > 0) {
      setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: prop.houses - 1 } }));
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += tile.houseCost / 2; return up; });
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, tile.houseCost / 2, `Sold House (${tile.name})`);
    }"""

new_sell_house = """    if (prop.hotel) {
      if (bank.houses < 4) return addLog("Bank has no houses to swap!", activePlayer.id);
      setBank(prev => ({ ...prev, houses: prev.houses - 4, hotels: prev.hotels + 1 }));
      setProperties(prev => ({ ...prev, [propId]: { ...prop, hotel: false, houses: 4 } }));
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += tile.houseCost / 2; return up; });
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, tile.houseCost / 2, `Sold HOTEL (${tile.name})`);
    } else if (prop.houses > 0) {
      setBank(prev => ({ ...prev, houses: prev.houses + 1 }));
      setProperties(prev => ({ ...prev, [propId]: { ...prop, houses: prop.houses - 1 } }));
      setPlayers(prev => { const up = [...prev]; const pIndex = up.findIndex(p => p.id === activePlayer.id); if (pIndex > -1) up[pIndex].money += tile.houseCost / 2; return up; });
      showTransfer('BANK', { name: activePlayer.name, color: activePlayer.color }, tile.houseCost / 2, `Sold House (${tile.name})`);
    }"""
content = content.replace(old_sell_house, new_sell_house)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
