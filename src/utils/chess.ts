export type PieceColor = 'w' | 'b';
export type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p';
export type Square = string; // e.g., 'e4'

export interface Piece {
  piece: PieceType;
  color: PieceColor;
}

export interface GameState {
  board: Record<Square, Piece | null>;
  turn: PieceColor;
  isCheck: boolean;
  isCheckmate: boolean;
}

export const getSquareColor = (square: Square): 'light' | 'dark' => {
  const file = square.charCodeAt(0) - 97; // 'a' -> 0
  const rank = parseInt(square[1]) - 1;
  return (file + rank) % 2 === 0 ? 'light' : 'dark';
};

export const createInitialBoard = (): Record<Square, Piece | null> => {
  const board: Record<Square, Piece | null> = {};
  const pieces: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

  // Initialize all squares to null
  for (let rank = 1; rank <= 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const square = `${String.fromCharCode(97 + file)}${rank}`;
      board[square] = null;
    }
  }

  // Set up pieces
  for (let file = 0; file < 8; file++) {
    const fileChar = String.fromCharCode(97 + file);
    
    // Main pieces
    board[`${fileChar}1`] = { piece: pieces[file], color: 'w' };
    board[`${fileChar}8`] = { piece: pieces[file], color: 'b' };
    
    // Pawns
    board[`${fileChar}2`] = { piece: 'p', color: 'w' };
    board[`${fileChar}7`] = { piece: 'p', color: 'b' };
  }

  return board;
};