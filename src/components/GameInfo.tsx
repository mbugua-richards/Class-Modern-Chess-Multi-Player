import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Clock, Crown, RotateCcw, Trophy } from 'lucide-react';
import CapturedPieces from './CapturedPieces';

const GameInfo: React.FC = () => {
  const { gameState, resetGame, capturedPieces, players } = useGameStore();

  return (
    <div className="text-white space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Game Status</h2>
        <button
          onClick={resetGame}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          title="Reset Game"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5" />
          <span>Turn: {gameState.turn === 'w' ? 'White' : 'Black'}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>White: {players.w.score}</span>
            </div>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Black: {players.b.score}</span>
            </div>
          </div>
        </div>

        {gameState.isCheck && (
          <div className="flex items-center space-x-3 text-red-400">
            <Crown className="w-5 h-5" />
            <span>Check!</span>
          </div>
        )}

        {gameState.isCheckmate && (
          <div className="mt-4 p-4 bg-red-500 bg-opacity-20 rounded-lg text-center">
            <p className="font-bold">Checkmate!</p>
            <p className="text-sm opacity-80">
              {gameState.turn === 'w' ? 'Black' : 'White'} wins!
            </p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Move History</h3>
          <div className="bg-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto">
            {gameState.moveHistory?.map((move, index) => (
              <div key={index} className="text-sm opacity-80">
                {index + 1}. {move.piece.color === 'w' ? 'White' : 'Black'} {move.piece.piece.toUpperCase()} {move.from} → {move.to}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Captured Pieces</h3>
          <div className="bg-gray-700 rounded-lg p-2">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-400 mb-1">White's captures:</p>
                <CapturedPieces pieces={capturedPieces} color="w" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Black's captures:</p>
                <CapturedPieces pieces={capturedPieces} color="b" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;