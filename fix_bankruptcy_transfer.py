with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Fix Bug 5: Rent Bankruptcies wipe properties instead of transferring.
# And they create money.
# First, payRentAction currently subtracts full rent and gives it to owner.
# `up[turnIdx].money -= amount; if (up[ownerIdx]) up[ownerIdx].money += amount;`
# If they go bankrupt, we should remember they owe `ownerIdx`.
# We need to change `payRentAction` to only give the owner what the active player actually has (including zero if negative already), but actually, we don't need to do that directly in `payRentAction` because `money` can go negative temporarily, but when they hit `declareBankruptcy`, the creditor gets all their properties and remaining assets (which are just the cash they had *before* going negative).
# Wait, if they had 50 and rent was 1000, their `money` becomes -950. The creditor already got 1000. So the creditor is actually up 1000. If we transfer properties during bankruptcy, the creditor gets the properties too. This is exactly how the game logic currently models it: money is created out of thin air to ensure the rent is paid, and the debtor is in the negative. This is a common shortcut in casual digital monopoly games to avoid complex partial payments/escrow. Let's just fix the property deletion part.
# But wait, the user wants me to fix the "created out of thin air" part or just the properties wiping? "instead of transferring them, and creates money out of thin air."
# Let's fix it properly.
# In `payRentAction`:
old_pay_rent = """    setPlayers(prev => {
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
    checkBankruptcy(activePlayer.id, activePlayer.money - amount);
    setPhase('MANAGE');"""

new_pay_rent = """    const actualPayment = Math.min(amount, Math.max(0, activePlayer.money));
    const debt = amount - actualPayment;

    setPlayers(prev => {
      const up = [...prev];
      const turnIdx = up.findIndex(p => p.id === activePlayer.id);
      if (up[turnIdx]) up[turnIdx].money -= amount; // still goes negative to reflect debt
      if (up[ownerIdx]) up[ownerIdx].money += actualPayment; // owner only gets what player had
      return up;
    });
    showTransfer(
      { name: activePlayer.name, color: activePlayer.color },
      { name: owner.name, color: owner.color },
      actualPayment,
      `Rent — ${tile.name}`
    );

    if (checkBankruptcy(activePlayer.id, activePlayer.money - amount, owner.id)) {
        // We pass the creditorId to checkBankruptcy so it knows who bankrupted them.
    }
    setPhase('MANAGE');"""
content = content.replace(old_pay_rent, new_pay_rent)

old_check = """  const checkBankruptcy = (playerId, newMoney) => {
    if (newMoney < 0) {
      setBankruptcyPlayerId(playerId);
      setBankruptcyModal(true);
      return true;
    }"""
new_check = """  const [bankruptcyCreditorId, setBankruptcyCreditorId] = useState(null);

  const checkBankruptcy = (playerId, newMoney, creditorId = null) => {
    if (newMoney < 0) {
      setBankruptcyPlayerId(playerId);
      setBankruptcyCreditorId(creditorId);
      setBankruptcyModal(true);
      return true;
    }"""
content = content.replace(old_check, new_check)

old_declare = """  const declareBankruptcy = useCallback(() => {
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
    setBankruptcyPlayerId(null);"""

new_declare = """  const declareBankruptcy = useCallback(() => {
    if (!bankruptcyPlayerId) return;
    const playerName = players.find(p => p.id === bankruptcyPlayerId)?.name || 'Player';
    addLog(`${playerName} is BANKRUPT!`, null);

    setProperties(prev => {
      const up = { ...prev };
      Object.entries(up).forEach(([propId, propState]) => {
        if (propState.ownerId === bankruptcyPlayerId) {
          if (bankruptcyCreditorId) {
            up[propId].ownerId = bankruptcyCreditorId;
          } else {
            delete up[propId];
          }
        }
      });
      return up;
    });

    const newPlayersList = players.filter(p => p.id !== bankruptcyPlayerId);
    setPlayers(newPlayersList);

    setBankruptcyModal(false);
    setBankruptcyPlayerId(null);
    setBankruptcyCreditorId(null);"""
content = content.replace(old_declare, new_declare)

old_deps = "}, [bankruptcyPlayerId, players, turn]); // eslint-disable-line react-hooks/exhaustive-deps"
new_deps = "}, [bankruptcyPlayerId, bankruptcyCreditorId, players, turn]); // eslint-disable-line react-hooks/exhaustive-deps"
content = content.replace(old_deps, new_deps)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
