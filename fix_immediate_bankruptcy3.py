with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Let's fix line 488:
#  useEffect(() => {
#    if (phase !== 'ROLL' || !activePlayer?.id) return;
#    if (activePlayer.money < 0) {
#      setBankruptcyPlayerId(activePlayer.id);
#      setBankruptcyModal(true);
#      if (activePlayer.isBot) setTimeout(() => declareBankruptcy(), 1000);
#    }
#  }, [turnSerial, phase, activePlayer?.money, activePlayer?.id, activePlayer?.isBot, declareBankruptcy]);
# Wait, if this runs every time `activePlayer.money` changes, it might trigger mid-turn if phase is 'ROLL' and money goes negative.
# But wait, we only want it to trigger AT THE START of the turn (i.e. when they are about to roll).
# If they go negative during their turn, the phase becomes 'MANAGE'.
# So `phase !== 'ROLL'` aborts early. That's good! It only triggers if they start their turn in negative.
# We just need to make sure they can't roll dice while bankrupt.

# Also we need to fix `checkAndCloseBankruptcyModal`:
old_close = """  const checkAndCloseBankruptcyModal = () => {
    if (bankruptcyModal && activePlayer?.money >= 0) {
      setBankruptcyModal(false);
      setBankruptcyPlayerId(null);
      addLog(`Balance recovered!`, activePlayer.id);
    }
  };"""

# Let's just use an effect to close it so it's always perfectly synced.
new_close = """  useEffect(() => {
    if (bankruptcyModal && activePlayer?.money >= 0) {
      setBankruptcyModal(false);
      setBankruptcyPlayerId(null);
      addLog(`Balance recovered!`, activePlayer.id);

      // If they recovered and haven't rolled yet, let them roll.
      // If they recovered during MANAGE, they can end turn.
    }
  }, [bankruptcyModal, activePlayer?.money, activePlayer?.id, addLog]);

  const checkAndCloseBankruptcyModal = () => {};"""
content = content.replace(old_close, new_close)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
