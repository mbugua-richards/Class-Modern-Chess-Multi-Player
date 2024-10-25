import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ChessBoard from './components/ChessBoard';
import GameInfo from './components/GameInfo';
import GameLobby from './components/GameLobby';
import { useMultiplayer } from './hooks/useMultiplayer';

function App() {
  const { gameId, joinGame } = useMultiplayer();
  const [showLobby, setShowLobby] = useState(true);

  const handleJoinGame = (id: string) => {
    joinGame(id);
    setShowLobby(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8">
      <Toaster />
      <div className="max-w-6xl w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Chess Royal</h1>
          <button
            onClick={() => setShowLobby(!showLobby)}
            className="text-white bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            {showLobby ? 'Back to Game' : 'Show Game ID'}
          </button>
        </div>

        {showLobby ? (
          <GameLobby gameId={gameId} onJoinGame={handleJoinGame} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ChessBoard />
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <GameInfo />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;