with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Replace all those `if (!checkBankruptcy...) setPhase` logic to ALWAYS set phase,
# because we want to let them end their turn even if they are negative.
old_rent = """    if (!checkBankruptcy(activePlayer.id, activePlayer.money - amount)) setPhase('MANAGE');
  };"""
new_rent = """    checkBankruptcy(activePlayer.id, activePlayer.money - amount, owner.id);
    setPhase('MANAGE');
  };"""
content = content.replace(old_rent, new_rent)

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
