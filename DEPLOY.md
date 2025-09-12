# 🚀 Guia de Deploy - Gym Dashboard

Guia completo para hospedar o Gym Dashboard em produção.

## 📋 Visão Geral

- **Frontend**: Vercel (Next.js)
- **Backend**: Render (Socket.IO + Express)
- **Banco de Dados**: JSON local (futuro: PostgreSQL)
- **Real-time**: Socket.IO

## 🎯 Pré-requisitos

- ✅ Conta no [Vercel](https://vercel.com)
- ✅ Conta no [Render](https://render.com)
- ✅ Repositório no GitHub
- ✅ Node.js 18+ instalado

## 🔧 Preparação

### 1. Estrutura do Projeto
```
gym-dashboard/
├── src/                 # Frontend Next.js
├── server/             # Backend Socket.IO
├── .env.example        # Variáveis do frontend
├── server/.env.example # Variáveis do backend
└── DEPLOY.md          # Este guia
```

### 2. Configurar Variáveis

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_SOCKET_URL=https://gym-dashboard-backend.onrender.com
```

**Backend (server/.env)**:
```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://gym-dashboard-frontend.vercel.app
```

## 🌐 Deploy do Backend (Render)

### Passo 1: Criar Serviço Backend

**Opção A: Via Dashboard Render**
1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique "New" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `gym-dashboard-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `curl -fsSL https://bun.sh/install | bash && export PATH="$HOME/.bun/bin:$PATH" && bun install`
   - **Start Command**: `export PATH="$HOME/.bun/bin:$PATH" && bun run server.js`

**Opção B: Via Blueprint (render-backend.yaml)**
```bash
# Use o arquivo render-backend.yaml fornecido
```git add .
git commit -m "feat: backend Socket.IO para produção"
git push origin main
```

### Passo 2: Configurar na Render

1. **Acesse**: [render.com](https://render.com)
2. **Clique**: "New +" → "Web Service"
3. **Conecte**: Seu repositório GitHub
4. **Configure**:

```yaml
Name: gym-dashboard-backend
Environment: Node
Build Command: cd server && npm install
Start Command: cd server && npm start
Root Directory: (deixe vazio)
```

### Passo 3: Variáveis de Ambiente

No painel da Render, adicione:

```env
NODE_ENV=production
FRONTEND_URL=https://gym-dashboard-frontend.vercel.app
```

### Passo 4: Deploy

- ✅ Clique "Create Web Service"
- ✅ Aguarde o build (5-10 min)
- ✅ Anote a URL: `https://gym-dashboard-backend.onrender.com`

## 🎨 Deploy do Frontend (Vercel)

### Passo 1: Configurar Vercel

1. **Acesse**: [vercel.com](https://vercel.com)
2. **Clique**: "New Project"
3. **Importe**: Seu repositório GitHub
4. **Configure**:

```yaml
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: (auto-detectado)
```

### Passo 2: Variáveis de Ambiente

**Opção 1: Via Dashboard Vercel**
No painel da Vercel → Settings → Environment Variables:

```env
NEXT_PUBLIC_SOCKET_URL=https://gym-dashboard-skgw.onrender.com
```

**Opção 2: Via vercel.json (Automático)**
O arquivo `vercel.json` já está configurado com as variáveis corretas.

**Opção 3: Detecção Automática**
O sistema detecta automaticamente o ambiente:
- Desenvolvimento: `http://localhost:3001`
- Produção: `https://gym-dashboard-skgw.onrender.com`

### Passo 3: Deploy

- ✅ Clique "Deploy"
- ✅ Aguarde o build (3-5 min)
- ✅ Anote a URL: `https://gym-dashboard-frontend.vercel.app`

## 🔄 Configuração Final

### 1. Atualizar CORS no Backend

Edite `server/server.js`:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://gym-dashboard-frontend.vercel.app', // Sua URL real
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
};
```

### 2. Redeploy do Backend

```bash
git add server/server.js
git commit -m "fix: atualizar CORS com URL do frontend"
git push origin main
```

## ✅ Verificação

### 1. Testar Backend

```bash
# Health check
curl https://gym-dashboard-backend.onrender.com/health

# Resposta esperada:
{
  "status": "healthy",
  "uptime": 123.45,
  "onlineUsers": 0
}
```

### 2. Testar Frontend

1. **Acesse**: Sua URL do Vercel
2. **Faça login**: Sistema deve funcionar
3. **Verifique**: Console do navegador (sem erros Socket.IO)

### 3. Testar Socket.IO

1. **Abra**: Duas abas do frontend
2. **Faça login**: Em ambas
3. **Teste**: Notificações em tempo real

## 🔧 Troubleshooting

### Problema: CORS Error

**Sintoma**: `Access-Control-Allow-Origin` error

**Solução**:
```javascript
// server/server.js
origin: ['https://sua-url-real.vercel.app']
```

### Problema: Socket.IO não conecta

**Sintoma**: `WebSocket connection failed`

**Solução**:
```javascript
// Verificar URL no frontend
NEXT_PUBLIC_SOCKET_URL=https://gym-dashboard-backend.onrender.com
```

### Problema: Build falha

**Sintoma**: Deploy falha no Render/Vercel

**Solução**:
```bash
# Testar localmente
cd server && npm install && npm start
npm run build
```

## 📊 Monitoramento

### Render Dashboard
- **Logs**: Real-time logs
- **Métricas**: CPU, Memory, Response time
- **Health**: Auto-restart se falhar

### Vercel Dashboard
- **Analytics**: Page views, performance
- **Functions**: Serverless metrics
- **Deployments**: History e rollback

## 🔄 CI/CD Automático

### Auto-deploy configurado:

1. **Push** para `main` → **Deploy automático**
2. **Pull Request** → **Preview deploy**
3. **Merge** → **Production deploy**

### Comandos úteis:

```bash
# Deploy manual (se necessário)
vercel --prod

# Logs do Render
# Via dashboard ou CLI da Render

# Rollback
# Via dashboard do Vercel/Render
```

## 🎯 Próximos Passos

### Melhorias Futuras:

1. **Banco de Dados**: PostgreSQL na Render
2. **Autenticação**: JWT + refresh tokens
3. **CDN**: Cloudflare para assets
4. **Monitoring**: Sentry para errors
5. **Analytics**: Google Analytics
6. **SSL**: Certificados automáticos

### Escalabilidade:

1. **Redis**: Para sessions Socket.IO
2. **Load Balancer**: Múltiplas instâncias
3. **Database**: Cluster PostgreSQL
4. **Cache**: Redis para queries

---

## 🎉 Conclusão

✅ **Backend**: Socket.IO rodando na Render  
✅ **Frontend**: Next.js rodando na Vercel  
✅ **Real-time**: Comunicação funcionando  
✅ **Produção**: Ambiente limpo (sem usuários)  
✅ **Escalável**: Pronto para crescer  

**🚀 Seu Gym Dashboard está no ar!**

### URLs Finais:
- **Frontend**: `https://gym-dashboard-frontend.vercel.app`
- **Backend**: `https://gym-dashboard-backend.onrender.com`
- **Health**: `https://gym-dashboard-backend.onrender.com/health`
- **Stats**: `https://gym-dashboard-backend.onrender.com/stats`