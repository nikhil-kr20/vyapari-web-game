with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

# Let's fix the End Turn button in MANAGE modal.
# Currently: `{phase === 'MANAGE' && !activePlayer.isBot && activePlayer.money >= 0 && (`
# The user wants to let them end turn even with negative balance!
content = content.replace("{phase === 'MANAGE' && !activePlayer.isBot && activePlayer.money >= 0 && (", "{phase === 'MANAGE' && !activePlayer.isBot && (")

# But wait, if they end turn with negative money, the next turn (when `turn` changes to the next player) will start.
# If they are still negative, the game will advance to the next player. The NEXT time it becomes their turn, the phase will be 'ROLL' and `activePlayer.money < 0` will trigger the bankruptcy modal!
# Wait, if they have negative money, they owe money to someone (or the bank). They shouldn't be allowed to just say "I'm done" and end their turn without paying or declaring bankruptcy.
# Wait! In Monopoly, you can't end your turn if you owe money. You MUST sell houses, mortgage, trade, or declare bankruptcy IMMEDIATELY.
# The user's request: "once the player rolls the dice if its balance goes negative this modal should not comes , i want to add like that player should get a chance to recover that money until his next turn doesn't come, and when the next turn comes before rolling the dice this modal should appear and he have to manage it"
# Wait, "recover that money until his next turn doesn't come" means he can stay negative, other people play, and then when his turn comes back around, he has to manage it?
# In actual Monopoly, if you owe rent to someone, you have to pay them NOW. You can't say "I'll pay you next time around the board". But the user explicitly asked for this.
# Let's implement it exactly as requested. They can end their turn with negative balance, and the bankruptcy modal will only appear on their *next* turn before they roll.

# Are there any other restrictions? "And now even the manage is done and the balance comes in positive the next turn button modal didn't appear, fix this issues"
# Yes, because I hid the whole modal `if activePlayer.money >= 0`. So if I remove that condition, they can always click "End Turn" when in MANAGE phase.

with open('frontend/src/App.jsx', 'w') as f:
    f.write(content)
