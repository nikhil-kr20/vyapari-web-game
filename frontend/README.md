# Vyapari - Frontend React UI

This document details all functions and components that make up the Android-ready user interface of the Vyapari Game. Since players share the same device (pass-and-play), the UI focuses on centralizing interactions and making transitions very clear.

## User Interface UI & Hooks

### `useLocalMatch()`
- **Brief**: Subscribes the React App to the local Game Engine.
- **Detailed**: Reacts instantly to changes in the `GameStateManager`. When the internal engine states "Player 2's turn", this hook updates the React view to display Player 2's dashboard, highlighting their properties and colors.

### `useSharedDeviceTurns()`
- **Brief**: Manages the screen transitions between players.
- **Detailed**: Displays large, clear modals like "Pass the phone to Player 3" when a turn ends. Secures the opponent's private cards if necessary and rotates the board's perspective visually so it is comfortable for the person holding the device.

## Core React Components

### `BoardRenderer.jsx`
- **Brief**: Renders the Monopoly-style square grid.
- **Detailed**: Renders the 40 distinct tiles, injecting custom Indian-themed Vyapari backgrounds and names (e.g., Delhi, Mumbai, Railways). Handles exact X/Y coordinate mapping for tokens on the local screen.

### `DiceRollerAnimation.jsx`
- **Brief**: Physics-based 3D CSS dice animation.
- **Detailed**: Upon clicking "Roll", it takes the predetermined random numbers from the local engine and calculates keyframes so the virtual dice tumble and land cleanly on the correct numbers, ensuring a premium feel. 

### `PlayerDashboard.jsx`
- **Brief**: The bottom HUD displaying cash.
- **Detailed**: A fixed UI menu showing the current active player's face/color, exact cash, and a collapsible inventory of their property cards. Allows them to click "Build House" or "Mortgage" locally.

## React Actions

### `animateTokenMove(playerToken, start, end)`
- **Brief**: Smooth pawn movement.
- **Detailed**: Transverses the matrix of standard tiles, moving the token step-by-step (e.g. moving past 3 spaces looks like 3 distinct hops) via Framer Motion or pure CSS layouts so players easily see the path crossed.

### `showPurchaseModal(propertyCard)`
- **Brief**: Interactive Buy/Auction screen.
- **Detailed**: Pops a fullscreen modal over the board for the active player when they land on an unowned city. Shows the Title Deed stats. Gives "Buy for ₹X" or "Pass/Auction" options directly feeding back to `evaluateLanding()` in the local engine.

### `showBankruptcyWarning()`
- **Brief**: Game over/Debt screen.
- **Detailed**: Blocks the player from ending their turn if they owe rent they cannot cover. Forces them into a "Sell Mode" where clicking on houses/properties mortgages them to the central logical bank until the owed number turns green.
