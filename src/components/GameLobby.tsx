import React, { useState } from 'react';
import { Copy, ArrowRight } from 'lucide-react';

interface GameLobbyProps {
  gameId: string;
  onJoinGame: (id: string) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ gameId, onJoinGame }) => {
  const [joinId, setJoinId] = useState('');
  const [copied, setCopied] = useState(false);

  const copyGameId = () => {
    navigator.clipboard.writeText(gameId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinId.trim()) {
      onJoinGame(joinId.trim());
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl text-white">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Game ID</h2>
          <div className="flex items-center space-x-2">
            <code className="bg-gray-700 px-3 py-2 rounded flex-1 font-mono">
              {gameId}
            </code>
            <button
              onClick={copyGameId}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
              title="Copy Game ID"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copied && (
            <p className="text-sm text-green-400 mt-1">Copied to clipboard!</p>
          )}
        </div>

        <div className="border-t border-gray-700 pt-6">
          <h2 className="text-xl font-semibold mb-3">Join a Game</h2>
          <form onSubmit={handleJoinGame} className="space-y-3">
            <input
              type="text"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              placeholder="Enter Game ID"
              className="w-full bg-gray-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded flex items-center justify-center space-x-2 transition-colors"
              disabled={!joinId.trim()}
            >
              <span>Join Game</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GameLobby;