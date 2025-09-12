import usersData from '@/data/users.json';
import { toast } from 'react-hot-toast';

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
  profile: {
    // Para Personal Trainers (admin)
    phone?: string;
    specialties?: string[];
    experience?: string;
    // Para Alunos (user)
    age?: number;
    weight?: number;
    height?: number;
    goal?: string;
    personalTrainerId?: string;
  };
  stats: {
    // Para Personal Trainers
    studentsCount?: number;
    workoutsCreated?: number;
    totalSessions?: number;
    // Para Alunos
    workoutsCompleted?: number;
    totalCalories?: number;
    currentStreak?: number;
    longestStreak?: number;
  };
}

export interface UsersDatabase {
  users: UserProfile[];
  metadata: {
    version: string;
    lastUpdated: string;
    totalUsers: number;
    totalPersonals: number;
    totalStudents: number;
  };
}

class UserService {
  private storageKey = 'gym-dashboard-users';
  private database: UsersDatabase;

  constructor() {
    this.database = this.loadDatabase();
  }

  private loadDatabase(): UsersDatabase {
    try {
      // Verificar se está no cliente (browser)
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          return JSON.parse(stored);
        }
        // Se não há dados no localStorage, usar dados iniciais do JSON
        this.saveDatabase(usersData as UsersDatabase);
      }
      return usersData as UsersDatabase;
    } catch (error) {
      console.error('Erro ao carregar banco de usuários:', error);
      return usersData as UsersDatabase;
    }
  }

  private saveDatabase(data?: UsersDatabase): void {
    try {
      const dataToSave = data || this.database;
      dataToSave.metadata.lastUpdated = new Date().toISOString();
      dataToSave.metadata.totalUsers = dataToSave.users.length;
      dataToSave.metadata.totalPersonals = dataToSave.users.filter(u => u.role === 'admin').length;
      dataToSave.metadata.totalStudents = dataToSave.users.filter(u => u.role === 'user').length;
      
      // Verificar se está no cliente (browser)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      }
      this.database = dataToSave;
    } catch (error) {
      console.error('Erro ao salvar banco de usuários:', error);
    }
  }

  // Buscar todos os usuários
  getAllUsers(): UserProfile[] {
    return this.database.users;
  }

  // Buscar usuários por papel
  getUsersByRole(role: 'admin' | 'user'): UserProfile[] {
    return this.database.users.filter(user => user.role === role);
  }

  // Buscar Personal Trainers (admins)
  getPersonalTrainers(): UserProfile[] {
    return this.getUsersByRole('admin');
  }

  // Buscar Alunos (users)
  getStudents(): UserProfile[] {
    return this.getUsersByRole('user');
  }

  // Buscar usuário por ID
  getUserById(id: string): UserProfile | null {
    return this.database.users.find(user => user.id === id) || null;
  }

  // Buscar usuário por username
  getUserByUsername(username: string): UserProfile | null {
    return this.database.users.find(user => user.username === username) || null;
  }

  // Buscar alunos de um personal trainer
  getStudentsByPersonalId(personalId: string): UserProfile[] {
    return this.database.users.filter(user => 
      user.role === 'user' && user.profile.personalTrainerId === personalId
    );
  }

  // Adicionar novo usuário
  addUser(userData: Omit<UserProfile, 'id' | 'createdAt' | 'lastLogin'>): UserProfile {
    const newUser: UserProfile = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    this.database.users.push(newUser);
    this.saveDatabase();
    
    toast.success(`${newUser.role === 'admin' ? 'Personal Trainer' : 'Aluno'} ${newUser.displayName} adicionado com sucesso!`);
    return newUser;
  }

  // Atualizar usuário
  updateUser(id: string, updates: Partial<UserProfile>): UserProfile | null {
    const userIndex = this.database.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      toast.error('Usuário não encontrado');
      return null;
    }

    this.database.users[userIndex] = {
      ...this.database.users[userIndex],
      ...updates,
      lastLogin: new Date().toISOString(),
    };

    this.saveDatabase();
    toast.success('Usuário atualizado com sucesso!');
    return this.database.users[userIndex];
  }

  // Atualizar último login
  updateLastLogin(id: string): void {
    const userIndex = this.database.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.database.users[userIndex].lastLogin = new Date().toISOString();
      this.saveDatabase();
    }
  }

  // Atrelar aluno a personal trainer
  assignStudentToPersonal(studentId: string, personalId: string): boolean {
    const student = this.getUserById(studentId);
    const personal = this.getUserById(personalId);

    if (!student || student.role !== 'user') {
      toast.error('Aluno não encontrado');
      return false;
    }

    if (!personal || personal.role !== 'admin') {
      toast.error('Personal Trainer não encontrado');
      return false;
    }

    this.updateUser(studentId, {
      profile: {
        ...student.profile,
        personalTrainerId: personalId
      }
    });

    toast.success(`Aluno ${student.displayName} atrelado ao Personal ${personal.displayName}`);
    return true;
  }

  // Remover atrelamento
  unassignStudentFromPersonal(studentId: string): boolean {
    const student = this.getUserById(studentId);
    if (!student || student.role !== 'user') {
      toast.error('Aluno não encontrado');
      return false;
    }

    this.updateUser(studentId, {
      profile: {
        ...student.profile,
        personalTrainerId: undefined
      }
    });

    toast.success(`Aluno ${student.displayName} desatrelado do Personal`);
    return true;
  }

  // Buscar usuários por termo
  searchUsers(term: string): UserProfile[] {
    const searchTerm = term.toLowerCase();
    return this.database.users.filter(user => 
      user.displayName.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }

  // Obter estatísticas do sistema
  getSystemStats() {
    return {
      ...this.database.metadata,
      activeUsers: this.database.users.filter(u => u.status === 'active').length,
      inactiveUsers: this.database.users.filter(u => u.status === 'inactive').length,
    };
  }

  // Exportar dados (para backup)
  exportData(): string {
    return JSON.stringify(this.database, null, 2);
  }

  // Importar dados (para restore)
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as UsersDatabase;
      this.saveDatabase(data);
      toast.success('Dados importados com sucesso!');
      return true;
    } catch {
      toast.error('Erro ao importar dados');
      return false;
    }
  }
}

export const userService = new UserService();
export default userService;