import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import { nanoid } from 'nanoid';

const WEBSOCKET_URL = 'wss://chess-websocket.stackblitz.io';
const STORAGE_KEY = 'chess_game_state';

export const useMultiplayer = () => {
  const [gameId, setGameId] = useState<string>(nanoid());
  const [socket, setSocket] = useState<Socket | null>(null);
  const { gameState, updateGameState, makeMove, updateScore } = useGameStore();
  
  const initializeSocket = useCallback((id: string) => {
    if (socket) {
      socket.disconnect();
    }

    const newSocket: Socket = io(WEBSOCKET_URL, {
      query: { gameId: id },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to game server');
    });

    newSocket.on('move', ({ from, to, color }) => {
      makeMove(from, to);
      if (gameState.isCheckmate) {
        updateScore(color);
      }
    });

    newSocket.on('game_state', (newState) => {
      updateGameState(newState);
    });

    newSocket.on('player_joined', () => {
      newSocket.emit('request_state');
    });

    newSocket.on('request_state', () => {
      newSocket.emit('game_state', gameState);
    });

    setSocket(newSocket);
    return newSocket;
  }, [makeMove, updateGameState, updateScore]); // Remove gameState from dependencies

  const joinGame = useCallback((id: string) => {
    setGameId(id);
    localStorage.setItem('current_game_id', id);
    initializeSocket(id);
  }, [initializeSocket]);

  // Initialize socket only once on mount
  useEffect(() => {
    const savedGameId = localStorage.getItem('current_game_id');
    const initialGameId = savedGameId || gameId;
    
    if (savedGameId) {
      setGameId(savedGameId);
    }

    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        updateGameState(parsedState);
      } catch (error) {
        console.error('Error loading saved game state:', error);
      }
    }

    const newSocket = initializeSocket(initialGameId);

    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array for initialization

  // Save game state when it changes
  useEffect(() => {
    if (!gameState.isCheckmate) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('current_game_id');
    }
  }, [gameState]);

  return {
    gameId,
    joinGame,
  };
};