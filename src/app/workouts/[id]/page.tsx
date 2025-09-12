'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Play, Edit, Trash2, Clock, Target, Dumbbell, Plus, Minus, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Workout, WorkoutExercise } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExerciseProgress {
  exerciseId: string;
  sets: {
    reps: number;
    weight: number;
    completed: boolean;
  }[];
}

export default function WorkoutDetailPage() {
  const { state, deleteWorkout, updateWorkout } = useWorkout();
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState<ExerciseProgress[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer para cronômetro
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExecuting && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExecuting, startTime]);

  // Carregar treino
  useEffect(() => {
    const foundWorkout = state.workouts.find(w => w.id === workoutId);
    if (foundWorkout) {
      setWorkout(foundWorkout);
      // Inicializar progresso
      const initialProgress = foundWorkout.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets.map(() => ({
          reps: 10,
          weight: 0,
          completed: false
        }))
      }));
      setProgress(initialProgress);
    }
    setIsLoading(false);
  }, [state.workouts, workoutId]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    setIsExecuting(true);
    setStartTime(new Date());
    setElapsedTime(0);
  };

  const finishWorkout = async () => {
    if (!workout || !startTime) return;
    
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Atualizar estatísticas do treino
    const updatedWorkout = {
      ...workout,
      lastPerformed: endTime,
      totalSessions: ((workout as any).totalSessions || 0) + 1
    };
    
    updateWorkout(updatedWorkout);
    
    setIsExecuting(false);
    setStartTime(null);
    setElapsedTime(0);
    
    // Reset progress
    const resetProgress = workout.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      sets: Array(ex.sets.length).fill(null).map(() => ({
        reps: ex.reps || 10,
        weight: ex.weight || 0,
        completed: false
      }))
    }));
    setProgress(resetProgress);
    
    alert('Treino finalizado com sucesso!');
  };

  const updateSetProgress = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight' | 'completed', value: number | boolean) => {
    setProgress(prev => {
      const newProgress = [...prev];
      if (field === 'completed') {
        newProgress[exerciseIndex].sets[setIndex].completed = value as boolean;
      } else {
        newProgress[exerciseIndex].sets[setIndex][field] = value as number;
      }
      return newProgress;
    });
  };

  const handleDelete = async () => {
    if (!workout) return;
    
    if (confirm('Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.')) {
      await deleteWorkout(workout.id);
      router.push('/workouts');
    }
  };

  const getExerciseDetails = (exerciseId: string) => {
    return state.exercises.find(ex => ex.id === exerciseId);
  };

  const getCompletedSets = (exerciseIndex: number) => {
    return progress[exerciseIndex]?.sets.filter(set => set.completed).length || 0;
  };

  const getTotalSets = (exerciseIndex: number) => {
    return progress[exerciseIndex]?.sets.length || 0;
  };

  const getWorkoutProgress = () => {
    const totalSets = progress.reduce((acc, ex) => acc + ex.sets.length, 0);
    const completedSets = progress.reduce((acc, ex) => acc + ex.sets.filter(set => set.completed).length, 0);
    return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando treino...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!workout) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Treino não encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  O treino que você está procurando não foi encontrado.
                </p>
                <Link href="/workouts">
                  <Button>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar para Treinos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/workouts">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{workout.name}</h1>
              {workout.description && (
                <p className="text-muted-foreground mt-1">{workout.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isExecuting ? (
              <>
                <Button onClick={startWorkout} className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Treino
                </Button>
                <Link href={`/workouts/${workout.id}/edit`}>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </>
            ) : (
              <Button onClick={finishWorkout} className="bg-red-600 hover:bg-red-700">
                <Check className="h-4 w-4 mr-2" />
                Finalizar Treino
              </Button>
            )}
          </div>
        </div>

        {/* Status do treino */}
        {isExecuting && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Tempo: {formatTime(elapsedTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Progresso: {getWorkoutProgress()}%
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Treino em Andamento
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações do treino */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Exercícios</p>
                  <p className="text-2xl font-bold">{workout.exercises.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duração Estimada</p>
                  <p className="text-2xl font-bold">{workout.estimatedDuration || 45} min</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Última Execução</p>
                  <p className="text-2xl font-bold">
                    {workout.lastPerformed 
                      ? format(new Date(workout.lastPerformed), 'dd/MM', { locale: ptBR })
                      : 'Nunca'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de exercícios */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exercícios</h2>
          
          {workout.exercises.map((workoutExercise, exerciseIndex) => {
            const exercise = getExerciseDetails(workoutExercise.exerciseId);
            const exerciseProgress = progress[exerciseIndex];
            
            if (!exercise || !exerciseProgress) return null;
            
            return (
              <Card key={exerciseIndex} className={isExecuting ? 'border-blue-200' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                      <CardDescription>
                        {workoutExercise.sets.length} séries × {workoutExercise.reps || workoutExercise.sets[0]?.reps || 0} repetições
                        {workoutExercise.weight && ` × ${workoutExercise.weight}kg`}
                        {workoutExercise.restTime && ` • ${workoutExercise.restTime}s descanso`}
                      </CardDescription>
                    </div>
                    {isExecuting && (
                      <Badge variant={getCompletedSets(exerciseIndex) === getTotalSets(exerciseIndex) ? 'default' : 'secondary'}>
                        {getCompletedSets(exerciseIndex)}/{getTotalSets(exerciseIndex)} séries
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                {isExecuting && (
                  <CardContent>
                    <div className="space-y-3">
                      {exerciseProgress.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-4 p-3 border rounded">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {setIndex + 1}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Label className="text-xs">Reps:</Label>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateSetProgress(exerciseIndex, setIndex, 'reps', Math.max(1, set.reps - 1))}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={set.reps}
                                onChange={(e) => updateSetProgress(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                className="w-16 h-6 text-center text-xs"
                                min="1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateSetProgress(exerciseIndex, setIndex, 'reps', set.reps + 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {workoutExercise.weight !== undefined && (
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Peso:</Label>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateSetProgress(exerciseIndex, setIndex, 'weight', Math.max(0, set.weight - 2.5))}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) => updateSetProgress(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                                  className="w-16 h-6 text-center text-xs"
                                  min="0"
                                  step="0.5"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateSetProgress(exerciseIndex, setIndex, 'weight', set.weight + 2.5)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="text-xs text-muted-foreground">kg</span>
                            </div>
                          )}
                          
                          <Button
                            type="button"
                            variant={set.completed ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateSetProgress(exerciseIndex, setIndex, 'completed', !set.completed)}
                            className={set.completed ? 'bg-green-600 hover:bg-green-700' : ''}
                          >
                            {set.completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
                
                {!isExecuting && exercise.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}