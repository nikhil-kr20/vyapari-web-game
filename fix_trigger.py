with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Let's double check that the ROLL phase useEffect triggers correctly.
# `useEffect(() => { ... if (activePlayer.money < 0) { setBankruptcyPlayerId(activePlayer.id); setBankruptcyCreditorId(activePlayer.creditorId); setBankruptcyModal(true); ... }`
# Wait, did we use `activePlayer.creditorId` in the useEffect?
old_effect = """  useEffect(() => {
    if (phase !== 'ROLL' || !activePlayer?.id) return;
    if (activePlayer.money < 0) {
      setBankruptcyPlayerId(activePlayer.id);
      setBankruptcyModal(true);
      if (activePlayer.isBot) setTimeout(() => declareBankruptcy(), 1000);
    }
  }, [turnSerial, phase, activePlayer?.money, activePlayer?.id, activePlayer?.isBot, declareBankruptcy]); // eslint-disable-line react-hooks/exhaustive-deps"""

new_effect = """  useEffect(() => {
    if (phase !== 'ROLL' || !activePlayer?.id) return;
    if (activePlayer.money < 0) {
      setBankruptcyPlayerId(activePlayer.id);
      setBankruptcyCreditorId(activePlayer.creditorId || null);
      setBankruptcyModal(true);
      if (activePlayer.isBot) setTimeout(() => declareBankruptcy(), 1000);
    }
  }, [turnSerial, phase, activePlayer?.money, activePlayer?.id, activePlayer?.creditorId, activePlayer?.isBot, declareBankruptcy]); // eslint-disable-line react-hooks/exhaustive-deps"""

content = content.replace(old_effect, new_effect)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
