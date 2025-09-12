'use client';

import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { Workout, Exercise, WorkoutTemplate } from '@/types';
import { workoutService } from '@/services/workoutService';

// Estado do contexto
interface WorkoutState {
  workouts: Workout[];
  exercises: Exercise[];
  templates: WorkoutTemplate[];
  currentWorkout: Workout | null;
  isLoading: boolean;
  error: string | null;
}

// Ações do reducer
type WorkoutAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WORKOUTS'; payload: Workout[] }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'UPDATE_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'SET_EXERCISES'; payload: Exercise[] }
  | { type: 'ADD_EXERCISE'; payload: Exercise }
  | { type: 'UPDATE_EXERCISE'; payload: Exercise }
  | { type: 'DELETE_EXERCISE'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: WorkoutTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: WorkoutTemplate }
  | { type: 'SET_CURRENT_WORKOUT'; payload: Workout | null };

// Estado inicial
const initialState: WorkoutState = {
  workouts: [],
  exercises: [],
  templates: [],
  currentWorkout: null,
  isLoading: false,
  error: null,
};

// Reducer
function workoutReducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_WORKOUTS':
      return { ...state, workouts: action.payload, isLoading: false };
    
    case 'ADD_WORKOUT':
      return {
        ...state,
        workouts: [...state.workouts, action.payload],
        isLoading: false,
      };
    
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout.id === action.payload.id ? action.payload : workout
        ),
        isLoading: false,
      };
    
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(workout => workout.id !== action.payload),
        isLoading: false,
      };
    
    case 'SET_EXERCISES':
      return { ...state, exercises: action.payload, isLoading: false };
    
    case 'ADD_EXERCISE':
      return {
        ...state,
        exercises: [...state.exercises, action.payload],
        isLoading: false,
      };
    
    case 'UPDATE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.map(exercise =>
          exercise.id === action.payload.id ? action.payload : exercise
        ),
        isLoading: false,
      };
    
    case 'DELETE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.filter(exercise => exercise.id !== action.payload),
        isLoading: false,
      };
    
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload, isLoading: false };
    
    case 'ADD_TEMPLATE':
      return {
        ...state,
        templates: [...state.templates, action.payload],
        isLoading: false,
      };
    
    case 'SET_CURRENT_WORKOUT':
      return { ...state, currentWorkout: action.payload };
    
    default:
      return state;
  }
}

// Contexto
interface WorkoutContextType {
  state: WorkoutState;
  dispatch: React.Dispatch<WorkoutAction>;
  // Funções auxiliares
  loadWorkouts: () => void;
  loadExercises: () => void;
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  addExercise: (exercise: Omit<Exercise, 'id'>) => void;
  updateExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  setCurrentWorkout: (workout: Workout | null) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Provider
interface WorkoutProviderProps {
  children: ReactNode;
}

export function WorkoutProvider({ children }: WorkoutProviderProps) {
  const [state, dispatch] = useReducer(workoutReducer, initialState);

  // Funções auxiliares
  const addWorkout = (workoutData: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    const workout: Workout = {
      ...workoutData,
      id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Salvar no localStorage
    const currentWorkouts = [...state.workouts, workout];
    localStorage.setItem('gym-dashboard-workouts', JSON.stringify(currentWorkouts));
    
    dispatch({ type: 'ADD_WORKOUT', payload: workout });
  };

  const updateWorkout = (workout: Workout) => {
    const updatedWorkout = {
      ...workout,
      updatedAt: new Date(),
    };
    
    // Atualizar no localStorage
    const updatedWorkouts = state.workouts.map(w => 
      w.id === workout.id ? updatedWorkout : w
    );
    localStorage.setItem('gym-dashboard-workouts', JSON.stringify(updatedWorkouts));
    
    dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
  };

  const deleteWorkout = (id: string) => {
    // Remover do localStorage
    const filteredWorkouts = state.workouts.filter(w => w.id !== id);
    localStorage.setItem('gym-dashboard-workouts', JSON.stringify(filteredWorkouts));
    
    dispatch({ type: 'DELETE_WORKOUT', payload: id });
  };

  const addExercise = (exerciseData: Omit<Exercise, 'id'>) => {
    const exercise: Exercise = {
      ...exerciseData,
      id: crypto.randomUUID(),
    };
    dispatch({ type: 'ADD_EXERCISE', payload: exercise });
  };

  const updateExercise = (exercise: Exercise) => {
    dispatch({ type: 'UPDATE_EXERCISE', payload: exercise });
  };

  const deleteExercise = (id: string) => {
    dispatch({ type: 'DELETE_EXERCISE', payload: id });
  };

  const setCurrentWorkout = (workout: Workout | null) => {
    dispatch({ type: 'SET_CURRENT_WORKOUT', payload: workout });
  };

  const loadWorkouts = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Carregar treinos do localStorage
      const savedWorkouts = localStorage.getItem('gym-dashboard-workouts');
      let workouts: Workout[] = [];
      
      if (savedWorkouts) {
        workouts = JSON.parse(savedWorkouts).map((workout: Workout) => ({
          ...workout,
          createdAt: new Date(workout.createdAt),
          updatedAt: new Date(workout.updatedAt),
          completedAt: workout.completedAt ? new Date(workout.completedAt) : undefined
        }));
      } else {
        // Dados de exemplo apenas na primeira vez
        workouts = [
          {
            id: '1',
            name: 'Treino de Peito e Tríceps',
            description: 'Treino focado em peito e tríceps',
            exercises: [
              {
                id: '1',
                exerciseId: '1',
                sets: [
                  { id: '1', reps: 12, weight: 80, restTime: 90, completed: false },
                  { id: '2', reps: 10, weight: 85, restTime: 90, completed: false },
                  { id: '3', reps: 8, weight: 90, restTime: 90, completed: false }
                ],
                notes: ''
              }
            ],
            duration: 60,
            difficulty: 'intermediate',
            tags: ['Peito', 'Tríceps'],
            category: 'strength',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            completedAt: new Date('2024-01-15')
          },
          {
            id: '2',
            name: 'Treino de Costas e Bíceps',
            description: 'Treino focado em costas e bíceps',
            exercises: [
              {
                id: '2',
                exerciseId: '2',
                sets: [
                  { id: '4', reps: 10, weight: 70, restTime: 90, completed: false },
                  { id: '5', reps: 8, weight: 75, restTime: 90, completed: false }
                ],
                notes: ''
              }
            ],
            duration: 55,
            difficulty: 'beginner',
            tags: ['Costas', 'Bíceps'],
            category: 'strength',
            createdAt: new Date('2024-01-16'),
            updatedAt: new Date('2024-01-16')
          }
        ];
        
        // Salvar dados de exemplo no localStorage
        localStorage.setItem('gym-dashboard-workouts', JSON.stringify(workouts));
      }
      
      setTimeout(() => {
        dispatch({ type: 'SET_WORKOUTS', payload: workouts });
      }, 300);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar treinos' });
    }
  }, []);

  const loadExercises = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await workoutService.getExercises();
      if (response.success && response.data) {
        dispatch({ type: 'SET_EXERCISES', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar exercícios' });
      }
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar exercícios' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Carregar exercícios automaticamente
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const value: WorkoutContextType = {
    state,
    dispatch,
    loadWorkouts,
    loadExercises,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addExercise,
    updateExercise,
    deleteExercise,
    setCurrentWorkout,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

// Hook personalizado
export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
}