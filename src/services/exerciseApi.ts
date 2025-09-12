// Serviço para integração com APIs de exercícios
import { Exercise } from '@/types';

// Configurações das APIs
const EXERCISE_DB_BASE_URL = 'https://exercisedb-api.vercel.app/api/v1';
const FREE_EXERCISE_DB_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main';
const API_NINJAS_BASE_URL = 'https://api.api-ninjas.com/v1';

// Interface para resposta da ExerciseDB API
interface ExerciseDBResponse {
  exerciseId: string;
  name: string;
  imageUrl?: string;
  equipments: string[];
  bodyParts: string[];
  exerciseType: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  videoUrl?: string;
  keywords: string[];
  overview?: string;
  instructions: string[];
  exerciseTips?: string[];
  variations?: string[];
  difficulty?: string;
}

// Interface para resposta da Free Exercise DB
interface FreeExerciseDBResponse {
  id: string;
  name: string;
  force?: string;
  level: string;
  mechanic?: string;
  equipment?: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

// Interface para resposta da API Ninjas
interface APINinjasResponse {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

class ExerciseApiService {
  // Buscar exercícios da ExerciseDB
  async fetchFromExerciseDB(limit: number = 50): Promise<Exercise[]> {
    try {
      const response = await fetch(`${EXERCISE_DB_BASE_URL}/exercises?limit=${limit}`);
      if (!response.ok) throw new Error('Erro ao buscar exercícios da ExerciseDB');
      
      const data: ExerciseDBResponse[] = await response.json();
      return data.map(this.mapExerciseDBToExercise);
    } catch (error) {
      console.error('Erro na ExerciseDB:', error);
      return [];
    }
  }

  // Buscar exercícios da Free Exercise DB
  async fetchFromFreeExerciseDB(): Promise<Exercise[]> {
    try {
      const response = await fetch(`${FREE_EXERCISE_DB_BASE_URL}/dist/exercises.json`);
      if (!response.ok) throw new Error('Erro ao buscar exercícios da Free Exercise DB');
      
      const data: FreeExerciseDBResponse[] = await response.json();
      return data.map(this.mapFreeExerciseDBToExercise);
    } catch (error) {
      console.error('Erro na Free Exercise DB:', error);
      return [];
    }
  }

  // Buscar exercícios da API Ninjas (requer API key)
  async fetchFromAPINinjas(muscle?: string, apiKey?: string): Promise<Exercise[]> {
    if (!apiKey) {
      console.warn('API Key não fornecida para API Ninjas');
      return [];
    }

    try {
      const url = muscle 
        ? `${API_NINJAS_BASE_URL}/exercises?muscle=${muscle}`
        : `${API_NINJAS_BASE_URL}/exercises`;
      
      const response = await fetch(url, {
        headers: {
          'X-Api-Key': apiKey
        }
      });
      
      if (!response.ok) throw new Error('Erro ao buscar exercícios da API Ninjas');
      
      const data: APINinjasResponse[] = await response.json();
      return data.map(this.mapAPINinjasToExercise);
    } catch (error) {
      console.error('Erro na API Ninjas:', error);
      return [];
    }
  }

  // Buscar exercícios de todas as fontes
  async fetchAllExercises(apiKey?: string): Promise<Exercise[]> {
    const [exerciseDBData, freeExerciseDBData, apiNinjasData] = await Promise.all([
      this.fetchFromExerciseDB(100),
      this.fetchFromFreeExerciseDB(),
      apiKey ? this.fetchFromAPINinjas(undefined, apiKey) : Promise.resolve([])
    ]);

    // Combinar e remover duplicatas
    const allExercises = [...exerciseDBData, ...freeExerciseDBData, ...apiNinjasData];
    const uniqueExercises = this.removeDuplicates(allExercises);
    
    return uniqueExercises;
  }

  // Buscar exercícios por grupo muscular
  async fetchByMuscleGroup(muscleGroup: string, apiKey?: string): Promise<Exercise[]> {
    const [exerciseDBData, apiNinjasData] = await Promise.all([
      this.fetchFromExerciseDB(50),
      apiKey ? this.fetchFromAPINinjas(muscleGroup.toLowerCase(), apiKey) : Promise.resolve([])
    ]);

    const filteredExerciseDB = exerciseDBData.filter(exercise => 
      exercise.muscleGroups.some(muscle => 
        muscle.toLowerCase().includes(muscleGroup.toLowerCase())
      )
    );

    const allExercises = [...filteredExerciseDB, ...apiNinjasData];
    return this.removeDuplicates(allExercises);
  }

  // Mapear ExerciseDB para Exercise
  private mapExerciseDBToExercise(data: ExerciseDBResponse): Exercise {
    return {
      id: data.exerciseId,
      name: data.name,
      description: data.overview,
      muscleGroups: data.bodyParts,
      equipment: data.equipments?.[0],
      instructions: data.instructions,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      targetMuscles: data.targetMuscles,
      secondaryMuscles: data.secondaryMuscles,
      exerciseType: this.mapExerciseType(data.exerciseType),
      keywords: data.keywords,
      tips: data.exerciseTips,
      variations: data.variations,
      category: 'strength'
    };
  }

  // Mapear Free Exercise DB para Exercise
  private mapFreeExerciseDBToExercise(data: FreeExerciseDBResponse): Exercise {
    return {
      id: data.id,
      name: data.name,
      muscleGroups: data.primaryMuscles,
      equipment: data.equipment,
      instructions: data.instructions,
      images: data.images?.map(img => `${FREE_EXERCISE_DB_BASE_URL}/exercises/${img}`),
      imageUrl: data.images?.[0] ? `${FREE_EXERCISE_DB_BASE_URL}/exercises/${data.images[0]}` : undefined,
      targetMuscles: data.primaryMuscles,
      secondaryMuscles: data.secondaryMuscles,
      difficulty: this.mapDifficulty(data.level),
      force: data.force as 'push' | 'pull' | 'static',
      mechanic: data.mechanic as 'compound' | 'isolation',
      category: data.category
    };
  }

  // Mapear API Ninjas para Exercise
  private mapAPINinjasToExercise(data: APINinjasResponse): Exercise {
    return {
      id: this.generateId(data.name),
      name: data.name,
      muscleGroups: [data.muscle],
      equipment: data.equipment,
      instructions: [data.instructions],
      difficulty: this.mapDifficulty(data.difficulty),
      exerciseType: this.mapExerciseType(data.type),
      category: data.type
    };
  }

  // Utilitários
  private mapExerciseType(type: string): 'strength' | 'cardio' | 'flexibility' | 'balance' {
    const typeMap: Record<string, 'strength' | 'cardio' | 'flexibility' | 'balance'> = {
      'weight_reps': 'strength',
      'strength': 'strength',
      'cardio': 'cardio',
      'flexibility': 'flexibility',
      'stretching': 'flexibility',
      'balance': 'balance'
    };
    return typeMap[type.toLowerCase()] || 'strength';
  }

  private mapDifficulty(level: string): 'beginner' | 'intermediate' | 'advanced' {
    const difficultyMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced',
      'expert': 'advanced'
    };
    return difficultyMap[level.toLowerCase()] || 'beginner';
  }

  private generateId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  private removeDuplicates(exercises: Exercise[]): Exercise[] {
    const seen = new Set<string>();
    return exercises.filter(exercise => {
      const key = exercise.name.toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

export const exerciseApiService = new ExerciseApiService();
export default exerciseApiService;