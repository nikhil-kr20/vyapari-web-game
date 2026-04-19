import re

with open('frontend/src/App.jsx', 'r') as f:
    code = f.read()

print("Checking bankruptcy logic...")
# When a player goes bankrupt, do we correctly reset the property houses and hotels?
# `setProperties` logic for declareBankruptcy:
# Object.entries(up).forEach(([propId, propState]) => { if (propState.ownerId === bankruptcyPlayerId) delete up[propId]; });
print("Wait... when someone goes bankrupt, their properties are deleted (become public), but what happens to the houses and hotels? Do they go back to the bank?")
# Let's check if the bank has a house/hotel limit. `bank: { houses: 32, hotels: 12, parking: createParkingReward() }`
# Yes! `const { players, properties, bank, ... } = gameState;`
# Wait, when buying a house `buildHouse`, does it check the bank's house limit?
# Let's see: `if (activePlayer.money >= tile.houseCost) { if (prop.houses < 4 && !prop.hotel) { ... houses: prop.houses + 1 ... }`
# Wait! It never checks or decrements `bank.houses`!
print("Bug 4 found: Building/selling houses does not check or update bank.houses or bank.hotels limits.")

print("\nChecking jail card logic...")
# `useJailCard` logic: `up[idx].getOutOfJailFree -= 1;`
# But does the chance/chest deck return the card?
# `const card = deck[Math.floor(Math.random() * deck.length)];`
# Wait, it just randomly picks a card every time. The decks don't shrink. This means you can get infinite 'Get Out Of Jail Free' cards. This is maybe acceptable for a simple game, but technically a bug in real Monopoly.

print("\nChecking auction logic...")
# When an auction finishes:
# `finalizeAuction(auctionState, newBidders[0], Math.max(10, auctionState.highestBid));`
# But wait... if everyone folds without placing any bids, the property remains unowned. That's fine.
# But what if one person bids, and then everyone else folds? The last person gets it.
# What if someone doesn't have enough money to bid the next amount?
# `if (bid <= auctionState.highestBid && auctionState.highestBid > 0) return addLog("Bid too low", currentId);`
# `if (currentBiderObj.money < bid) return addLog("Not enough money", currentId);`
# Seems solid.

print("\nChecking rent logic...")
# `payRentAction`: `const ownerIdx = players.findIndex(p => p.id === ownership.ownerId);`
# `const amount = calculateRent(tile, ownership);`
# `if (!checkBankruptcy(activePlayer.id, activePlayer.money - amount)) setPhase('MANAGE');`
# What if the activePlayer goes bankrupt paying rent? Do they pay the owner their remaining money?
# `up[turnIdx].money -= amount; if (up[ownerIdx]) up[ownerIdx].money += amount;`
# Wait! If the active player only has 50 rupees, and rent is 1000 rupees, their balance becomes -950. The owner's balance increases by 1000! In real Monopoly, the owner should only get whatever the bankrupt player can liquidate, or all their assets. But here, the owner gets 1000 created out of thin air, and the bankrupt player is -950.
# If the bankrupt player declares bankruptcy, their properties are deleted (become public) instead of going to the player who bankrupted them!
# "Object.entries(up).forEach(([propId, propState]) => { if (propState.ownerId === bankruptcyPlayerId) delete up[propId]; });"
# This means if you bankrupt someone via rent, you don't get their properties! They are just wiped!
print("Bug 5 found: Bankrupting a player via rent deletes their properties instead of transferring them, and creates money out of thin air.")

print("\nChecking doubles logic...")
# `setGameState(prev => ({ ...prev, dice: [d1, d2] }));`
# `const isDouble = d1 === d2;`
# Does rolling a double give you another turn?
# `movePlayerStepByStep(d1 + d2);`
# Wait! `isDouble` is checked in Jail: `if (isDouble) { ... Escaped Jail! ... }`
# But what if you are NOT in jail?
# There is NO logic for rolling doubles giving you another turn!
# "const [doublesCount, setDoublesCount] = useState(0);" was declared, and "setDoublesCount(0);" was in endTurn.
# So the original developer started implementing "rolling doubles gives another turn" and "three doubles = jail", but never finished it!
print("Bug 6 found: Rolling a double does not give another turn.")
