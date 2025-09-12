// Sistema de autenticação local

export interface User {
  id: string
  username: string
  displayName: string
  email?: string
  role: 'user' | 'admin'
  token: string
  createdAt: Date
  lastLogin: Date
}

export interface UserCredentials {
  username: string
  password: string
}

// Gerar token único para cada usuário
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Gerar ID único
function generateId(): string {
  return 'user_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Usuários padrão do sistema
const defaultUsers: User[] = [
  {
    id: 'admin_001',
    username: 'admin',
    displayName: 'Administrador',
    email: 'admin@gym-dashboard.com',
    role: 'admin',
    token: 'admin_token_' + Date.now(),
    createdAt: new Date(),
    lastLogin: new Date()
  }
]

// Classe para gerenciar autenticação local
export class LocalAuth {
  private static readonly USERS_KEY = 'gym_dashboard_users'
  private static readonly CURRENT_USER_KEY = 'gym_dashboard_current_user'
  private static readonly PASSWORDS_KEY = 'gym_dashboard_passwords'

  // Inicializar sistema com usuários padrão
  static initialize() {
    if (typeof window === 'undefined') return
    
    const existingUsers = localStorage.getItem(this.USERS_KEY)
    const existingPasswords = localStorage.getItem(this.PASSWORDS_KEY)
    
    if (!existingUsers) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaultUsers))
    }
    
    if (!existingPasswords) {
      const defaultPasswords = {
        'admin': 'admin' // senha padrão do admin
      }
      localStorage.setItem(this.PASSWORDS_KEY, JSON.stringify(defaultPasswords))
    }
  }

  // Obter todos os usuários
  static getUsers(): User[] {
    if (typeof window === 'undefined') return []
    
    const users = localStorage.getItem(this.USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  // Obter senhas (apenas para verificação)
  private static getPasswords(): Record<string, string> {
    if (typeof window === 'undefined') return {}
    
    const passwords = localStorage.getItem(this.PASSWORDS_KEY)
    return passwords ? JSON.parse(passwords) : {}
  }

  // Salvar usuários
  private static saveUsers(users: User[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
  }

  // Salvar senhas
  private static savePasswords(passwords: Record<string, string>) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.PASSWORDS_KEY, JSON.stringify(passwords))
  }

  // Login
  static async signIn(username: string, password: string): Promise<User> {
    const users = this.getUsers()
    const passwords = this.getPasswords()
    
    const user = users.find(u => u.username === username)
    
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    
    if (passwords[username] !== password) {
      throw new Error('Senha incorreta')
    }
    
    // Atualizar último login
    user.lastLogin = new Date()
    this.saveUsers(users)
    
    // Salvar usuário atual
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
    
    return user
  }

  // Registro
  static async signUp(username: string, password: string, displayName: string): Promise<User> {
    const users = this.getUsers()
    const passwords = this.getPasswords()
    
    // Verificar se usuário já existe
    if (users.find(u => u.username === username)) {
      throw new Error('Nome de usuário já existe')
    }
    
    // Criar novo usuário
    const newUser: User = {
      id: generateId(),
      username,
      displayName,
      role: 'user',
      token: generateToken(),
      createdAt: new Date(),
      lastLogin: new Date()
    }
    
    // Salvar usuário e senha
    users.push(newUser)
    passwords[username] = password
    
    this.saveUsers(users)
    this.savePasswords(passwords)
    
    // Salvar usuário atual
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser))
    
    return newUser
  }

  // Obter usuário atual
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const user = localStorage.getItem(this.CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  }

  // Logout
  static signOut() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.CURRENT_USER_KEY)
  }

  // Reset de senha com token
  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const users = this.getUsers()
    const passwords = this.getPasswords()
    
    const user = users.find(u => u.token === token)
    
    if (!user) {
      throw new Error('Token inválido')
    }
    
    // Atualizar senha
    passwords[user.username] = newPassword
    
    // Gerar novo token
    user.token = generateToken()
    
    this.saveUsers(users)
    this.savePasswords(passwords)
    
    return true
  }

  // Atualizar perfil do usuário
  static async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const users = this.getUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado')
    }
    
    // Atualizar usuário
    users[userIndex] = { ...users[userIndex], ...updates }
    this.saveUsers(users)
    
    // Se for o usuário atual, atualizar também
    const currentUser = this.getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(users[userIndex]))
    }
    
    return users[userIndex]
  }

  // Regenerar token do usuário
  static regenerateToken(userId: string): string {
    const users = this.getUsers()
    const user = users.find(u => u.id === userId)
    
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    
    const newToken = generateToken()
    user.token = newToken
    
    this.saveUsers(users)
    
    // Se for o usuário atual, atualizar também
    const currentUser = this.getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user))
    }
    
    return newToken
  }
}

// Inicializar sistema ao carregar
if (typeof window !== 'undefined') {
  LocalAuth.initialize()
}