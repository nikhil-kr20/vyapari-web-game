with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# First, let's look at checkBankruptcy logic that I previously modified.
# Ah, I see I reverted to `if (!checkBankruptcy...) setPhase('MANAGE')` at some point? Wait, my previous replacement of checkBankruptcy didn't perfectly match what's currently in the file.
# Let's completely rewrite checkBankruptcy and where it's used.

# Wait, if we DON'T show the bankruptcy modal immediately, what should checkBankruptcy do?
# It should do NOTHING immediately, just let the state go negative.
# Actually, the user wants the player to be able to go negative and finish their turn.
# So we can remove `setBankruptcyModal(true)` from `checkBankruptcy`.
# But wait, what if they get bankrupted by rent? We still want to record `bankruptcyCreditorId` on the player so that next turn if they declare bankruptcy, the creditor gets the assets.
# But wait, `bankruptcyCreditorId` is a global state. If another player gets bankrupted in the meantime? It's better to store `creditorId` on the player object themselves.
# For now, let's just make `checkBankruptcy` do nothing but return `newMoney < 0`.

old_check = """  const [bankruptcyCreditorId, setBankruptcyCreditorId] = useState(null);

  const checkBankruptcy = (playerId, newMoney, creditorId = null) => {
    if (newMoney < 0) {
      setBankruptcyPlayerId(playerId);
      setBankruptcyCreditorId(creditorId);
      setBankruptcyModal(true);
      return true;
    }
    return false;
  };"""

new_check = """  const [bankruptcyCreditorId, setBankruptcyCreditorId] = useState(null);

  const checkBankruptcy = (playerId, newMoney, creditorId = null) => {
    if (newMoney < 0) {
      // We no longer trigger the modal immediately.
      // We record the creditor ID in case they declare bankruptcy later.
      // But we let them finish the turn.
      setPlayers(prev => {
        const up = [...prev];
        const idx = up.findIndex(p => p.id === playerId);
        if (idx > -1) {
            up[idx].creditorId = creditorId;
        }
        return up;
      });
      return true;
    }
    return false;
  };"""
content = content.replace(old_check, new_check)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
