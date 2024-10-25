import React from 'react';
import { motion } from 'framer-motion';
import { Piece } from '../utils/chess';
import ChessPiece from './ChessPiece';

interface CapturedPiecesProps {
  pieces: Piece[];
  color: 'w' | 'b';
}

const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color }) => {
  const colorPieces = pieces.filter(p => p.color === color);
  
  return (
    <div className="flex flex-wrap gap-1 p-2">
      {colorPieces.map((piece, index) => (
        <motion.div
          key={`${piece.piece}-${index}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-8 h-8 relative"
        >
          <ChessPiece piece={piece.piece} color={piece.color} />
        </motion.div>
      ))}
    </div>
  );
};

export default CapturedPieces;