# Gym Dashboard Backend Server

🚀 Servidor Socket.IO para comunicação em tempo real do Gym Dashboard.

## 📋 Funcionalidades

- **Socket.IO**: Comunicação em tempo real
- **Autenticação**: Sistema de roles (admin/user)
- **Notificações**: Atribuição e conclusão de treinos
- **Chat**: Sistema de mensagens entre usuários
- **Monitoramento**: Usuários online e atividades
- **API REST**: Endpoints para status e estatísticas

## 🛠️ Tecnologias

- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **Socket.IO**: WebSocket em tempo real
- **CORS**: Controle de acesso
- **dotenv**: Variáveis de ambiente

## 🚀 Deploy na Render

### 1. Preparação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd gym-dashboard/server

# Instale as dependências
npm install
```

### 2. Configuração na Render

1. **Acesse**: [render.com](https://render.com)
2. **Conecte**: Seu repositório GitHub
3. **Crie**: New Web Service
4. **Configure**:
   - **Name**: `gym-dashboard-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`

### 3. Variáveis de Ambiente

Configure no painel da Render:

```env
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.vercel.app
PORT=10000
```

### 4. Configuração Automática

A Render detectará automaticamente:
- ✅ `package.json`
- ✅ Script de start
- ✅ Porta do ambiente

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Copiar configurações
cp .env.example .env

# Editar variáveis
nano .env

# Executar em desenvolvimento
npm run dev

# Executar em produção
npm start
```

## 📡 Endpoints da API

### Status do Servidor
```http
GET /
```

### Health Check
```http
GET /health
```

### Estatísticas
```http
GET /stats
```

## 🔌 Eventos Socket.IO

### Cliente → Servidor

- `join_room(roomId)`: Entrar em sala
- `leave_room(roomId)`: Sair de sala
- `workout_assigned(data)`: Atribuir treino
- `workout_completed(data)`: Completar treino
- `send_message(data)`: Enviar mensagem
- `admin_broadcast(data)`: Anúncio admin
- `activity_update(data)`: Atualizar atividade

### Servidor → Cliente

- `user_joined(userData)`: Usuário conectou
- `user_left(userData)`: Usuário desconectou
- `users_online(userList)`: Lista de online
- `workout_assigned(data)`: Treino atribuído
- `workout_completed(data)`: Treino completado
- `message_received(data)`: Mensagem recebida
- `admin_announcement(data)`: Anúncio admin
- `student_activity(data)`: Atividade do aluno

## 🔐 Autenticação

```javascript
const socket = io('wss://seu-backend.render.com', {
  auth: {
    userId: 'user123',
    username: 'joao',
    role: 'user', // 'admin' ou 'user'
    displayName: 'João Silva'
  }
});
```

## 📊 Monitoramento

### Logs
```bash
# Ver logs na Render
# Dashboard → Service → Logs
```

### Métricas
- **Usuários Online**: `/stats`
- **Health Check**: `/health`
- **Uptime**: Automático na Render

## 🛡️ Segurança

- ✅ **CORS**: Configurado para frontend
- ✅ **Autenticação**: Middleware Socket.IO
- ✅ **Rate Limiting**: Proteção contra spam
- ✅ **Validação**: Dados de entrada
- ✅ **Logs**: Monitoramento de atividades

## 🔄 CI/CD

### Deploy Automático
1. **Push**: Para branch `main`
2. **Build**: Automático na Render
3. **Deploy**: Sem downtime
4. **Health Check**: Verificação automática

### Rollback
```bash
# Na Render Dashboard
# Deployments → Previous Version → Redeploy
```

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de CORS**:
```javascript
// Adicionar origem no server.js
origin: ['https://novo-frontend.com']
```

**Conexão WebSocket falha**:
```javascript
// Verificar transports
transports: ['websocket', 'polling']
```

**Timeout de conexão**:
```javascript
// Aumentar timeout
timeout: 20000
```

### Logs Úteis
```bash
# Conexões
🟢 Usuário conectado: João (user)
🔴 Usuário desconectado: João (timeout)

# Eventos
💪 Treino atribuído
🎉 Treino completado
💬 Mensagem enviada
📢 Anúncio admin
```

## 📞 Suporte

- **Logs**: Render Dashboard
- **Métricas**: `/health` e `/stats`
- **Documentação**: Socket.IO oficial
- **Monitoramento**: Render Analytics

---

**🎯 Pronto para produção!** O servidor está configurado para escalar automaticamente na Render.