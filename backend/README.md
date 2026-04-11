# Local Game Engine (The "Backend")

For an offline Android app, the "backend" acts as the brain of the game running entirely inside the device. It sits behind the scenes of the React UI, processing rules impartially.

## Core Services

### `GameStateManager`
- **Brief**: The central brain holding the current match memory.
- **Detailed**: An object managing the array of local players (their money, property lists, and board position), the current turn index, the bank's available reserves, and property ownership maps. When a UI button is clicked, it asks this manager if the move is legal.

### `AI_Controller` (For non-human players)
- **Brief**: Manages Bot behaviors.
- **Detailed**: If 1 human plays against 3 bots on the same device, this module evaluates logic trees for the AI. It calculates if a bot should buy a landed property, automatically pays rent, or decides to build houses based on simple probability checks. 

## Engine Functions

### `rollVirtualDice()`
- **Brief**: Cryptographically random dice output.
- **Detailed**: Generates two integers (1-6). It checks if a 'Double' is rolled. If a player rolls 3 consecutive doubles, it forces their position index strictly to the "Jail" block. It returns the final integer to the frontend parser.

### `evaluateLanding(playerId, tileId)`
- **Brief**: The massive rule-checking method.
- **Detailed**: Executed instantly after a player's token reaches its destination.
  - *If Unowned:* Validates price and exposes a `TriggerBuy` callback for human players (or auto-buys for AI).
  - *If Owned by Adversary:* Automatically runs `processRent()`.
  - *If Tax/Corner:* Modifies the `GameStateManager` balance appropriately.

### `processRent(debtorId, creditorId, propertyId)`
- **Brief**: Enforces payouts between players.
- **Detailed**: Looks at the `PropertyDatabase` to find the exact rent (checking if a monopoly is owned, or how many houses are built). Automatically subtracts from `debtorId` and adds to `creditorId`. If the debtor reaches negative funds, it fires the `initiateBankruptcy()` sequence.

### `handleBanking(action, playerId, data)`
- **Brief**: Single device transaction handler.
- **Detailed**: Processes manual actions invoked on the device screen like mortgaging properties, buying houses, or redeeming mortgages. Validates color sets and ensures players aren't cheating local memory.
