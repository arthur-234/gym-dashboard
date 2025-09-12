'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface SocketMessage {
  [key: string]: unknown;
}

interface UserData {
  userId: string;
  username: string;
  displayName: string;
  role: string;
  connectedAt?: Date;
  id?: string;
}

interface WorkoutData {
  studentId: string;
  studentName: string;
  workoutId: string;
  workoutName: string;
  personalId?: string;
  personalName?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: UserData[];
  sendMessage: (event: string, data: SocketMessage) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<UserData[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile) return;

    // Conectar ao servidor Socket.IO
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId: profile.id,
        username: profile.username,
        role: profile.role,
        displayName: profile.displayName
      },
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    // Eventos de conexão
    socketInstance.on('connect', () => {
      console.log('Socket conectado:', socketInstance.id);
      setIsConnected(true);
      toast.success('Conectado ao sistema em tempo real');
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket desconectado');
      setIsConnected(false);
      toast.error('Desconectado do sistema em tempo real');
    });

    socketInstance.on('connect_error', () => {
      console.log('Erro de conexão Socket');
      setIsConnected(false);
      // Não mostrar toast de erro para não incomodar o usuário
      // toast.error('Erro na conexão em tempo real');
    });

    // Eventos de usuários online
    socketInstance.on('users_online', (users: UserData[]) => {
      setOnlineUsers(users.map(user => ({
        ...user,
        connectedAt: user.connectedAt ? new Date(user.connectedAt) : new Date(),
        id: user.userId
      })));
    });

    socketInstance.on('user_joined', (userData: UserData) => {
      if (profile.role === 'admin') {
        toast.success(`${userData.displayName} entrou no sistema`, {
          icon: '🟢',
          duration: 2000
        });
      }
    });

    socketInstance.on('user_left', (userData: UserData) => {
      if (profile.role === 'admin') {
        toast(`${userData.displayName} saiu do sistema`, {
          icon: '🔴',
          duration: 2000
        });
      }
    });

    // Eventos de treinos
    socketInstance.on('workout_assigned', (data: WorkoutData) => {
      if (data.studentId === profile.id) {
        toast.success(`Novo treino atribuído: ${data.workoutName}`, {
          icon: '💪',
          duration: 4000
        });
      }
    });

    socketInstance.on('workout_completed', (data: WorkoutData) => {
      if (profile.role === 'admin' && data.personalId === profile.id) {
        toast.success(`${data.studentName} completou o treino: ${data.workoutName}`, {
          icon: '🎉',
          duration: 4000
        });
      }
    });

    // Eventos de mensagens
    socketInstance.on('message_received', (data: { senderName: string; message: string }) => {
      toast(`Mensagem de ${data.senderName}: ${data.message}`, {
        icon: '💬',
        duration: 3000
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [profile]);

  const sendMessage = (event: string, data: SocketMessage) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.log('Socket não conectado, mensagem não enviada:', event, data);
    }
  };

  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('join_room', roomId);
      console.log('Entrou na sala:', roomId);
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_room', roomId);
      console.log('Saiu da sala:', roomId);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    sendMessage,
    joinRoom,
    leaveRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}

export default SocketContext;