const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configuração do CORS
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://gym-dashboard-frontend.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Configuração do Socket.IO
const io = socketIo(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling']
});

// Armazenamento em memória para usuários online
const onlineUsers = new Map();
const userRooms = new Map();

// Middleware de autenticação do Socket.IO
io.use((socket, next) => {
  const { userId, username, role, displayName } = socket.handshake.auth;
  
  if (!userId || !username) {
    return next(new Error('Authentication error'));
  }
  
  socket.userId = userId;
  socket.username = username;
  socket.role = role || 'user';
  socket.displayName = displayName || username;
  
  next();
});

// Eventos do Socket.IO
io.on('connection', (socket) => {
  console.log(`🟢 Usuário conectado: ${socket.displayName} (${socket.role})`);
  
  // Adicionar usuário à lista de online
  onlineUsers.set(socket.userId, {
    id: socket.userId,
    username: socket.username,
    displayName: socket.displayName,
    role: socket.role,
    socketId: socket.id,
    connectedAt: new Date()
  });
  
  // Notificar outros usuários (apenas admins veem login de usuários)
  if (socket.role === 'user') {
    socket.broadcast.to('admins').emit('user_joined', {
      userId: socket.userId,
      username: socket.username,
      displayName: socket.displayName,
      role: socket.role
    });
  }
  
  // Entrar na sala de admins se for admin
  if (socket.role === 'admin') {
    socket.join('admins');
    console.log(`👑 Admin ${socket.displayName} entrou na sala de admins`);
  }
  
  // Enviar lista de usuários online para admins
  socket.emit('users_online', Array.from(onlineUsers.values()));
  
  // Entrar em sala específica
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    userRooms.set(socket.userId, roomId);
    console.log(`📍 ${socket.displayName} entrou na sala: ${roomId}`);
  });
  
  // Sair de sala específica
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    userRooms.delete(socket.userId);
    console.log(`📍 ${socket.displayName} saiu da sala: ${roomId}`);
  });
  
  // Atribuição de treino
  socket.on('workout_assigned', (data) => {
    const { studentId, studentName, workoutId, workoutName, personalId, personalName } = data;
    
    // Enviar notificação para o aluno específico
    const studentUser = Array.from(onlineUsers.values()).find(user => user.id === studentId);
    if (studentUser) {
      io.to(studentUser.socketId).emit('workout_assigned', {
        studentId,
        studentName,
        workoutId,
        workoutName,
        personalId,
        personalName,
        timestamp: new Date()
      });
    }
    
    console.log(`💪 Treino "${workoutName}" atribuído a ${studentName} por ${personalName}`);
  });
  
  // Treino completado
  socket.on('workout_completed', (data) => {
    const { studentId, studentName, workoutId, workoutName, personalId } = data;
    
    // Notificar o personal trainer
    const personalUser = Array.from(onlineUsers.values()).find(user => user.id === personalId);
    if (personalUser) {
      io.to(personalUser.socketId).emit('workout_completed', {
        studentId,
        studentName,
        workoutId,
        workoutName,
        personalId,
        timestamp: new Date()
      });
    }
    
    console.log(`🎉 ${studentName} completou o treino: ${workoutName}`);
  });
  
  // Sistema de mensagens
  socket.on('send_message', (data) => {
    const { recipientId, message, type = 'text' } = data;
    
    const recipient = Array.from(onlineUsers.values()).find(user => user.id === recipientId);
    if (recipient) {
      io.to(recipient.socketId).emit('message_received', {
        senderId: socket.userId,
        senderName: socket.displayName,
        message,
        type,
        timestamp: new Date()
      });
    }
    
    console.log(`💬 Mensagem de ${socket.displayName} para ${recipient?.displayName || 'usuário desconhecido'}`);
  });
  
  // Broadcast para admins
  socket.on('admin_broadcast', (data) => {
    if (socket.role === 'admin') {
      socket.broadcast.emit('admin_announcement', {
        message: data.message,
        adminName: socket.displayName,
        timestamp: new Date()
      });
      console.log(`📢 Anúncio de ${socket.displayName}: ${data.message}`);
    }
  });
  
  // Status de atividade
  socket.on('activity_update', (data) => {
    const { activity, details } = data;
    
    // Notificar personal trainer se for atividade de aluno
    if (socket.role === 'user' && details?.personalId) {
      const personalUser = Array.from(onlineUsers.values()).find(user => user.id === details.personalId);
      if (personalUser) {
        io.to(personalUser.socketId).emit('student_activity', {
          studentId: socket.userId,
          studentName: socket.displayName,
          activity,
          details,
          timestamp: new Date()
        });
      }
    }
  });
  
  // Desconexão
  socket.on('disconnect', (reason) => {
    console.log(`🔴 Usuário desconectado: ${socket.displayName} (${reason})`);
    
    // Remover da lista de online
    onlineUsers.delete(socket.userId);
    userRooms.delete(socket.userId);
    
    // Notificar outros usuários
    if (socket.role === 'user') {
      socket.broadcast.to('admins').emit('user_left', {
        userId: socket.userId,
        username: socket.username,
        displayName: socket.displayName,
        role: socket.role
      });
    }
    
    // Atualizar lista de usuários online
    io.emit('users_online', Array.from(onlineUsers.values()));
  });
});

// Rotas da API REST
app.get('/', (req, res) => {
  res.json({
    message: 'Gym Dashboard Socket.IO Server',
    status: 'running',
    timestamp: new Date(),
    onlineUsers: onlineUsers.size,
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    onlineUsers: onlineUsers.size
  });
});

app.get('/stats', (req, res) => {
  res.json({
    onlineUsers: Array.from(onlineUsers.values()),
    totalConnections: onlineUsers.size,
    admins: Array.from(onlineUsers.values()).filter(user => user.role === 'admin').length,
    students: Array.from(onlineUsers.values()).filter(user => user.role === 'user').length
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor Socket.IO rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, fechando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado com sucesso');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, fechando servidor...');
  server.close(() => {
    console.log('✅ Servidor fechado com sucesso');
    process.exit(0);
  });
});