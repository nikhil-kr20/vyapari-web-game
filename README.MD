# Vyapari Web Game

Vyapari is a business-themed board game, inspired by the classic Monopoly and tailored with localized themes and rules. The goal is to accumulate wealth, buy properties, build houses, and bankrupt your opponents.

## Architecture Overview

- **Frontend**: React.js powered by Vite. Responsible for rendering the board, handling animations (dice roll, token movement), and managing the user interface.
- **Backend**: Node.js. Serves as a real-time multiplayer server using WebSockets. 
- **Database**: None. All active game states, rooms, and player data are managed directly in server memory.

## Future Roadmap: Complete Offline Android App

Your goal is to transition this web app into a fully functional offline Android app in the future. To prepare for this:

1. **Decoupled Game Engine**: All core game mechanics (e.g., `calculateRent`, `buyProperty`, `movePlayer`) will be isolated in pure, framework-agnostic JavaScript functions.
2. **Local vs Network Modes**: 
   - *Current Web Version:* The React code acts as a visual layer that receives game states from the Node backend via WebSockets.
   - *Future Offline Android Version:* We will skip the Node backend entirely for local play. The React frontend (wrapped in Capacitor or deployed via React Native Web) will run the game mechanics directly on the device, enabling offline Pass & Play or playing against AI bots.

## Directory Structure

- `/frontend` - Contains all React specific logic, components, and local state. (See `frontend/README.md`)
- `/backend` - Contains the Node.js multiplayer server, WebSockets, and in-memory session handlers. (See `backend/README.md`)

## Features Planned
- 2 , 3 or 4 Players support. And also support bot players.
- Properties including standard cities, railways, and utility services.
- Jail, Chance, and Community Chest equivalents.
- Real-time trading, building houses, and taking loans.