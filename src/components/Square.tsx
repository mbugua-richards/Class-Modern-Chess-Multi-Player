import React from 'react';
import { motion } from 'framer-motion';
import ChessPiece from './ChessPiece';
import { Piece } from '../utils/chess';

interface SquareProps {
  position: string;
  piece: Piece | null;
  color: 'light' | 'dark';
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({ position, piece, color, isSelected, isValidMove, onClick }) => {
  const baseColor = color === 'light' 
    ? 'bg-gradient-to-br from-amber-100 to-amber-200' 
    : 'bg-gradient-to-br from-amber-800 to-amber-900';
  
  const selectedColor = 'ring-4 ring-blue-400 ring-opacity-80';
  const validMoveColor = piece 
    ? 'ring-4 ring-green-500 ring-opacity-60' 
    : 'after:absolute after:inset-0 after:bg-green-500 after:bg-opacity-30 after:rounded-full after:w-1/3 after:h-1/3 after:m-auto';

  return (
    <motion.div
      className={`
        relative aspect-square cursor-pointer
        ${baseColor}
        ${isSelected ? selectedColor : ''}
        ${isValidMove ? validMoveColor : ''}
        transition-all duration-200
        hover:brightness-110
        shadow-inner
        rounded-sm
        flex items-center justify-center
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {piece && <ChessPiece piece={piece.piece} color={piece.color} />}
      {(position[1] === '1' || position[1] === '8') && (
        <span className={`absolute bottom-1 right-1 text-xs ${color === 'light' ? 'text-amber-800' : 'text-amber-200'} font-semibold`}>
          {position[0]}
        </span>
      )}
      {(position[0] === 'a' || position[0] === 'h') && (
        <span className={`absolute top-1 left-1 text-xs ${color === 'light' ? 'text-amber-800' : 'text-amber-200'} font-semibold`}>
          {position[1]}
        </span>
      )}
    </motion.div>
  );
};

export default Square;