// Tipos relacionados aos treinos
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscleGroups: string[];
  equipment?: string;
  instructions?: string[];
  imageUrl?: string;
  images?: string[]; // Array de URLs de imagens
  videoUrl?: string; // URL do vídeo demonstrativo
  gifUrl?: string; // URL do GIF animado
  category?: string;
  muscleGroup?: string;
  targetMuscles?: string[]; // Músculos primários
  secondaryMuscles?: string[]; // Músculos secundários
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  exerciseType?: 'strength' | 'cardio' | 'flexibility' | 'balance';
  force?: 'push' | 'pull' | 'static';
  mechanic?: 'compound' | 'isolation';
  tips?: string[]; // Dicas de execução
  variations?: string[]; // Variações do exercício
  keywords?: string[]; // Palavras-chave para busca
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight?: number;
  duration?: number; // em segundos
  restTime?: number; // em segundos
  completed?: boolean;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  weight?: number;
  reps?: number;
  restTime?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  category?: string;
  exercises: WorkoutExercise[];
  duration?: number; // duração estimada em minutos
  estimatedDuration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  lastPerformed?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Omit<WorkoutExercise, 'id'>[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
}

// Tipos para estatísticas
export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalWeight: number;
  averageDuration: number;
  favoriteExercises: Exercise[];
}