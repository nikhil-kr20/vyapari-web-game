import { GameProvider, useGame } from './context/GameContext.jsx';
import SetupScreen from './components/SetupScreen.jsx';
import GameScreen from './components/GameScreen.jsx';
import './App.css';

function MainApp() {
  const { state } = useGame();

  if (!state || state.phase === 'SETUP') {
    return <SetupScreen />;
  }

  return <GameScreen />;
}

function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}

export default App;
