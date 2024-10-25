import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Cross, Church, Castle } from 'lucide-react';

interface ChessPieceProps {
  piece: string;
  color: 'w' | 'b';
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, color }) => {
  const getIcon = () => {
    const baseStyle = color === 'w' 
      ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] text-amber-50' 
      : 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] text-amber-950';
    
    const iconProps = {
      className: `w-8 h-8 ${baseStyle} stroke-[1.5]`,
      style: { filter: `drop-shadow(0 2px 2px rgba(0,0,0,0.2))` }
    };

    const textStyle = `text-3xl ${baseStyle} font-chess`;

    switch (piece.toLowerCase()) {
      case 'k':
        return <Crown {...iconProps} className={`${iconProps.className} scale-110`} />;
      case 'q':
        return <Cross {...iconProps} className={`${iconProps.className} scale-105`} />;
      case 'b':
        return <Church {...iconProps} />;
      case 'n':
        return <span className={textStyle} style={{ textShadow: '0 2px 2px rgba(0,0,0,0.2)' }}>♞</span>;
      case 'r':
        return <Castle {...iconProps} />;
      case 'p':
        return <span className={textStyle} style={{ textShadow: '0 2px 2px rgba(0,0,0,0.2)' }}>♟</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center transform-gpu"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {getIcon()}
    </motion.div>
  );
};

export default ChessPiece;