import { Piece, PieceType, Square, GameState } from './chess';

export function isValidMove(
  from: Square,
  to: Square,
  piece: Piece,
  gameState: GameState
): boolean {
  const [fromFile, fromRank] = [from.charCodeAt(0) - 97, parseInt(from[1]) - 1];
  const [toFile, toRank] = [to.charCodeAt(0) - 97, parseInt(to[1]) - 1];
  const dx = toFile - fromFile;
  const dy = toRank - fromRank;
  const targetPiece = gameState.board[to];

  if (targetPiece?.color === piece.color) return false;

  // Create a temporary board to test for check
  const tempBoard = { ...gameState.board };
  tempBoard[to] = tempBoard[from];
  tempBoard[from] = null;

  // Don't allow moves that put or leave the king in check
  if (isCheck(tempBoard, piece.color)) return false;

  switch (piece.piece) {
    case 'p':
      return validatePawnMove(fromRank, toRank, dx, dy, piece.color, !!targetPiece);
    case 'n':
      return validateKnightMove(dx, dy);
    case 'b':
      return validateBishopMove(dx, dy, from, to, gameState);
    case 'r':
      return validateRookMove(dx, dy, from, to, gameState);
    case 'q':
      return validateQueenMove(dx, dy, from, to, gameState);
    case 'k':
      return validateKingMove(dx, dy);
    default:
      return false;
  }
}

export function isCheck(board: Record<Square, Piece | null>, color: PieceColor): boolean {
  // Find the king
  let kingPosition: Square | null = null;
  for (const [pos, piece] of Object.entries(board)) {
    if (piece?.piece === 'k' && piece.color === color) {
      kingPosition = pos as Square;
      break;
    }
  }

  if (!kingPosition) return false;

  // Check if any opponent piece can capture the king
  for (const [pos, piece] of Object.entries(board)) {
    if (piece && piece.color !== color) {
      const gameState = { board, turn: piece.color } as GameState;
      if (isValidMove(pos as Square, kingPosition, piece, gameState)) {
        return true;
      }
    }
  }

  return false;
}

export function isCheckmate(board: Record<Square, Piece | null>, color: PieceColor): boolean {
  if (!isCheck(board, color)) return false;

  // Try all possible moves for all pieces
  for (const [pos, piece] of Object.entries(board)) {
    if (piece?.color === color) {
      for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
          const targetPos = `${String.fromCharCode(97 + file)}${rank + 1}` as Square;
          const gameState = { board, turn: color } as GameState;
          
          if (isValidMove(pos as Square, targetPos, piece, gameState)) {
            // Try the move
            const tempBoard = { ...board };
            tempBoard[targetPos] = tempBoard[pos as Square];
            tempBoard[pos as Square] = null;
            
            // If this move gets out of check, it's not checkmate
            if (!isCheck(tempBoard, color)) {
              return false;
            }
          }
        }
      }
    }
  }

  return true;
}

function validatePawnMove(
  fromRank: number,
  toRank: number,
  dx: number,
  dy: number,
  color: 'w' | 'b',
  hasTarget: boolean
): boolean {
  const direction = color === 'w' ? 1 : -1;
  const startRank = color === 'w' ? 1 : 6;

  if (hasTarget) {
    return Math.abs(dx) === 1 && dy === direction;
  }

  if (fromRank === startRank) {
    return dx === 0 && (dy === direction || dy === direction * 2);
  }

  return dx === 0 && dy === direction;
}

function validateKnightMove(dx: number, dy: number): boolean {
  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

function validateBishopMove(
  dx: number,
  dy: number,
  from: Square,
  to: Square,
  gameState: GameState
): boolean {
  if (Math.abs(dx) !== Math.abs(dy)) return false;
  return !isPathBlocked(from, to, gameState);
}

function validateRookMove(
  dx: number,
  dy: number,
  from: Square,
  to: Square,
  gameState: GameState
): boolean {
  if (dx !== 0 && dy !== 0) return false;
  return !isPathBlocked(from, to, gameState);
}

function validateQueenMove(
  dx: number,
  dy: number,
  from: Square,
  to: Square,
  gameState: GameState
): boolean {
  if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) return false;
  return !isPathBlocked(from, to, gameState);
}

function validateKingMove(dx: number, dy: number): boolean {
  return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
}

function isPathBlocked(from: Square, to: Square, gameState: GameState): boolean {
  const [fromFile, fromRank] = [from.charCodeAt(0) - 97, parseInt(from[1]) - 1];
  const [toFile, toRank] = [to.charCodeAt(0) - 97, parseInt(to[1]) - 1];
  
  const dx = Math.sign(toFile - fromFile);
  const dy = Math.sign(toRank - fromRank);
  
  let currentFile = fromFile + dx;
  let currentRank = fromRank + dy;
  
  while (currentFile !== toFile || currentRank !== toRank) {
    const square = `${String.fromCharCode(97 + currentFile)}${currentRank + 1}`;
    if (gameState.board[square]) return true;
    
    currentFile += dx;
    currentRank += dy;
  }
  
  return false;
}