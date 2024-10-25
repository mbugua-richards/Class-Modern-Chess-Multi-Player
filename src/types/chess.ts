export interface ChessPiece {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
  position: string;
}

export interface Move {
  from: string;
  to: string;
  piece: {
    piece: string;
    color: 'w' | 'b';
  };
}

export interface GameState {
  board: Record<string, Piece | null>;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  moves: string[];
  capturedPieces: ChessPiece[];
  moveHistory: Move[];
  players: {
    w: { id: string; score: number };
    b: { id: string; score: number };
  };
}

export interface Player {
  id: string;
  name: string;
  rating: number;
  avatar?: string;
}

export interface Tournament {
  id: string;
  name: string;
  type: 'knockout' | 'roundRobin' | 'swiss';
  players: Player[];
  rounds: number;
  timeControl: {
    initial: number;
    increment: number;
  };
}

export type PieceColor = 'w' | 'b';
export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type Square = string;

export interface Piece {
  piece: PieceType;
  color: PieceColor;
}