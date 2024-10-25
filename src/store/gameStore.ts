import { create } from 'zustand';
import { GameState, PieceColor, Square, Piece, createInitialBoard } from '../utils/chess';
import { isValidMove, isCheck, isCheckmate } from '../utils/moveValidator';
import { toast } from 'react-hot-toast';

interface Player {
  id: string;
  score: number;
  name?: string;
}

interface GameStore {
  gameState: GameState;
  selectedPiece: Square | null;
  possibleMoves: Square[];
  capturedPieces: Piece[];
  players: Record<PieceColor, Player>;
  setSelectedPiece: (position: Square | null) => void;
  makeMove: (from: Square, to: Square) => void;
  resetGame: () => void;
  updateGameState: (newState: GameState) => void;
  updateScore: (color: PieceColor) => void;
}

const createInitialState = (): GameState => ({
  board: createInitialBoard(),
  turn: 'w',
  isCheck: false,
  isCheckmate: false,
  moveHistory: [],
  players: {
    w: { id: '', score: 0 },
    b: { id: '', score: 0 },
  }
});

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: createInitialState(),
  selectedPiece: null,
  possibleMoves: [],
  capturedPieces: [],
  players: {
    w: { id: '', score: 0 },
    b: { id: '', score: 0 },
  },
  
  setSelectedPiece: (position) => {
    set((state) => {
      if (!position) return { selectedPiece: null, possibleMoves: [] };
      
      const piece = state.gameState.board[position];
      if (!piece || piece.color !== state.gameState.turn) {
        return { selectedPiece: null, possibleMoves: [] };
      }
      
      const moves = calculatePossibleMoves(position, state.gameState);
      return { selectedPiece: position, possibleMoves: moves };
    });
  },
  
  makeMove: (from, to) => {
    set((state) => {
      const piece = state.gameState.board[from];
      const targetPiece = state.gameState.board[to];
      
      if (!piece || !isValidMove(from, to, piece, state.gameState)) {
        return state;
      }
      
      const newBoard = { ...state.gameState.board };
      newBoard[to] = newBoard[from];
      newBoard[from] = null;
      
      const newCapturedPieces = [...state.capturedPieces];
      if (targetPiece) {
        newCapturedPieces.push(targetPiece);
      }

      const nextTurn = state.gameState.turn === 'w' ? 'b' : 'w';
      const newCheck = isCheck(newBoard, nextTurn);
      const newCheckmate = isCheckmate(newBoard, nextTurn);

      if (newCheck) {
        toast.error(`${nextTurn === 'w' ? 'White' : 'Black'} is in check!`, {
          duration: 3000,
          position: 'top-center',
        });
      }

      if (newCheckmate) {
        const winner = state.gameState.turn;
        toast.success(`Checkmate! ${winner === 'w' ? 'White' : 'Black'} wins!`, {
          duration: 5000,
          position: 'top-center',
        });
      }

      const moveHistory = [...state.gameState.moveHistory, { 
        from, 
        to, 
        piece: {
          piece: piece.piece,
          color: piece.color
        }
      }];
      
      return {
        gameState: {
          ...state.gameState,
          board: newBoard,
          turn: nextTurn,
          isCheck: newCheck,
          isCheckmate: newCheckmate,
          moveHistory,
        },
        selectedPiece: null,
        possibleMoves: [],
        capturedPieces: newCapturedPieces,
      };
    });
  },
  
  resetGame: () => {
    set({
      gameState: createInitialState(),
      selectedPiece: null,
      possibleMoves: [],
      capturedPieces: [],
      players: {
        w: { id: '', score: 0 },
        b: { id: '', score: 0 },
      },
    });
    toast.success('Game reset!', {
      duration: 2000,
      position: 'top-center',
    });
  },

  updateGameState: (newState) => {
    set((state) => ({
      ...state,
      gameState: newState,
    }));
  },

  updateScore: (color) => {
    set((state) => ({
      ...state,
      players: {
        ...state.players,
        [color]: {
          ...state.players[color],
          score: state.players[color].score + 1,
        },
      },
    }));
  },
}));

function calculatePossibleMoves(position: Square, gameState: GameState): Square[] {
  const piece = gameState.board[position];
  if (!piece) return [];

  const moves: Square[] = [];
  
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const targetPos = `${String.fromCharCode(97 + file)}${rank + 1}`;
      if (isValidMove(position, targetPos, piece, gameState)) {
        moves.push(targetPos);
      }
    }
  }

  return moves;
}