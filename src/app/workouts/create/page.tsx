'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Search, Target, Dumbbell, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useWorkout } from "@/contexts/WorkoutContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Exercise, WorkoutExercise, WorkoutSet } from "@/types";
import { MUSCLE_GROUP_OPTIONS, getUniqueMuscleGroups, normalizeMuscleGroup } from "@/constants/muscleGroups";

interface WorkoutForm {
  name: string;
  description: string;
  category: string;
  exercises: WorkoutExercise[];
}

export default function CreateWorkoutPage() {
  const { state, loadExercises, addWorkout } = useWorkout();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [form, setForm] = useState<WorkoutForm>({
    name: '',
    description: '',
    category: 'strength',
    exercises: []
  });

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  // Filtrar exercícios disponíveis
  const filteredExercises = state.exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.muscleGroups.some(mg => {
      const normalizedMg = normalizeMuscleGroup(mg);
      const normalizedCategory = normalizeMuscleGroup(selectedCategory);
      return normalizedMg === normalizedCategory || normalizedMg.toLowerCase().includes(normalizedCategory.toLowerCase());
    });
    const notSelected = !form.exercises.find(we => we.exerciseId === exercise.id);
    
    return matchesSearch && matchesCategory && notSelected;
  });

  // Grupos musculares únicos dos exercícios
  const categories = getUniqueMuscleGroups(state.exercises);

  const addExerciseToWorkout = (exercise: Exercise) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    const workoutExercise: WorkoutExercise = {
      id: `we_${timestamp}_${randomId}`,
      exerciseId: exercise.id,
      sets: [
        {
          id: `set_${timestamp}_${randomId}`,
          reps: 10,
          weight: 0,
          restTime: 60,
          completed: false
        }
      ],
      notes: ''
    };
    
    setForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, workoutExercise]
    }));
  };

  const removeExerciseFromWorkout = (exerciseId: string) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const addSetToExercise = (exerciseId: string) => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    
    const newSet: WorkoutSet = {
      id: `set_${timestamp}_${randomId}`,
      reps: 10,
      weight: 0,
      restTime: 60,
      completed: false
    };
    
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: [...ex.sets, newSet] }
          : ex
      )
    }));
  };

  const removeSetFromExercise = (exerciseId: string, setId: string) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: ex.sets.filter(set => set.id !== setId) }
          : ex
      )
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof WorkoutSet, value: string | number) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              sets: ex.sets.map(set => 
                set.id === setId 
                  ? { ...set, [field]: value }
                  : set
              )
            }
          : ex
      )
    }));
  };

  const updateExerciseNotes = (exerciseId: string, notes: string) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, notes }
          : ex
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert('Por favor, insira um nome para o treino.');
      return;
    }
    
    if (form.exercises.length === 0) {
      alert('Por favor, adicione pelo menos um exercício ao treino.');
      return;
    }
    
    // Validar se todos os exercícios têm pelo menos uma série
    const invalidExercises = form.exercises.filter(ex => ex.sets.length === 0);
    if (invalidExercises.length > 0) {
      alert('Todos os exercícios devem ter pelo menos uma série.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Calcular duração estimada baseada no número de séries e tempo de descanso
      const estimatedDuration = form.exercises.reduce((total, exercise) => {
        const setsTime = exercise.sets.length * 2; // 2 minutos por série (estimativa)
        const restTime = exercise.sets.reduce((rest, set) => rest + (set.restTime || 60), 0) / 60; // converter para minutos
        return total + setsTime + restTime;
      }, 0);
      
      addWorkout({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        exercises: form.exercises,
        estimatedDuration: Math.round(estimatedDuration),
        difficulty: 'intermediate', // Pode ser calculado baseado nos exercícios
        tags: Array.from(new Set(form.exercises.flatMap(ex => {
          const exercise = getExerciseById(ex.exerciseId);
          return exercise ? exercise.muscleGroups : [];
        })))
      });
      
      router.push('/workouts');
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      alert('Erro ao criar treino. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getExerciseById = (exerciseId: string) => {
    return state.exercises.find(ex => ex.id === exerciseId);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/workouts">
              <Button variant="outline" size="sm" className="hover:bg-gray-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Dumbbell className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Criar Novo Treino
                </h1>
                <p className="text-muted-foreground text-lg mt-1">Monte seu treino personalizado com exercícios selecionados</p>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !form.name || form.exercises.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3"
            size="lg"
          >
            <Save className="h-5 w-5 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar Treino'}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações básicas */}
              <Card>
                <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <Target className="h-5 w-5" />
                     Informações do Treino
                   </CardTitle>
                   <CardDescription>
                     Configure as informações básicas do seu treino personalizado
                   </CardDescription>
                 </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                     <Label htmlFor="name">Nome do Treino *</Label>
                     <Input
                       id="name"
                       placeholder="Ex: Treino de Peito e Tríceps"
                       value={form.name}
                       onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                       required
                     />
                   </div>
                  
                  <div className="space-y-2">
                     <Label htmlFor="category">Categoria</Label>
                     <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strength">💪 Força</SelectItem>
                        <SelectItem value="cardio">❤️ Cardio</SelectItem>
                        <SelectItem value="flexibility">🤸 Flexibilidade</SelectItem>
                        <SelectItem value="sports">⚽ Esportes</SelectItem>
                        <SelectItem value="other">📋 Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                     <Label htmlFor="description">Descrição (opcional)</Label>
                     <Textarea
                       id="description"
                       placeholder="Descreva o objetivo e características deste treino..."
                       value={form.description}
                       onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                       rows={4}
                       className="resize-none"
                     />
                  </div>
                </CardContent>
              </Card>

          {/* Exercícios selecionados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Exercícios do Treino ({form.exercises.length})
              </CardTitle>
              <CardDescription>
                Configure séries, repetições e descanso para cada exercício
              </CardDescription>
            </CardHeader>
            <CardContent>
              {form.exercises.length > 0 && (
                <div className="space-y-6 mb-6">
                  {form.exercises.map((workoutExercise, index) => {
                    const exercise = getExerciseById(workoutExercise.exerciseId);
                    if (!exercise) return null;
                    
                    return (
                      <div key={workoutExercise.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{exercise.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {exercise.muscleGroups.map((muscle, index) => (
                              <Badge key={index} variant="outline">{muscle}</Badge>
                            ))}
                            {exercise.equipment && (
                              <Badge variant="outline">{exercise.equipment}</Badge>
                            )}
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeExerciseFromWorkout(workoutExercise.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Séries */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Séries ({workoutExercise.sets.length})</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addSetToExercise(workoutExercise.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Série
                            </Button>
                          </div>
                          
                          <div className="grid gap-3">
                            {workoutExercise.sets.map((set, setIndex) => (
                              <div key={set.id} className="grid grid-cols-4 gap-3 items-center p-3 bg-muted/50 rounded">
                                <div>
                                  <Label className="text-xs">Série {setIndex + 1}</Label>
                                </div>
                                <div>
                                  <Label className="text-xs">Repetições</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={set.reps}
                                    onChange={(e) => updateSet(workoutExercise.id, set.id, 'reps', parseInt(e.target.value) || 0)}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Peso (kg)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    value={set.weight}
                                    onChange={(e) => updateSet(workoutExercise.id, set.id, 'weight', parseFloat(e.target.value) || 0)}
                                    className="h-8"
                                  />
                                </div>
                                <div className="flex items-end gap-2">
                                  <div className="flex-1">
                                    <Label className="text-xs">Descanso (s)</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={set.restTime}
                                      onChange={(e) => updateSet(workoutExercise.id, set.id, 'restTime', parseInt(e.target.value) || 0)}
                                      className="h-8"
                                    />
                                  </div>
                                  {workoutExercise.sets.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeSetFromExercise(workoutExercise.id, set.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Notas do exercício */}
                        <div className="mt-4">
                          <Label className="text-xs">Notas (opcional)</Label>
                          <Textarea
                            placeholder="Observações sobre este exercício..."
                            value={workoutExercise.notes}
                            onChange={(e) => updateExerciseNotes(workoutExercise.id, e.target.value)}
                            rows={2}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <Separator className="my-6" />
              
              {/* Adicionar exercícios */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  <h4 className="text-lg font-semibold">Adicionar Exercícios</h4>
                </div>
                
                {/* Filtros */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Filtros de Exercícios
                    </CardTitle>
                    <CardDescription>
                      Use os filtros para encontrar os exercícios ideais para seu treino
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Buscar exercícios</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar exercícios por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Grupo Muscular</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="🎯 Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">🌟 Todas categorias</SelectItem>
                            {MUSCLE_GROUP_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.icon} {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Lista de exercícios disponíveis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredExercises.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        {state.exercises.length === 0 
                          ? 'Nenhum exercício disponível'
                          : 'Nenhum exercício encontrado'
                        }
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        {state.exercises.length === 0 
                          ? 'Aguarde um momento...'
                          : 'Tente ajustar os filtros de busca'
                        }
                      </p>
                    </div>
                  ) : (
                    filteredExercises.map(exercise => (
                      <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold">
                              {exercise.name}
                            </h4>
                            <Button
                              size="sm"
                              onClick={() => addExerciseToWorkout(exercise)}
                              className="ml-3 shrink-0"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Adicionar
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {exercise.muscleGroups.map((muscle, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="text-xs"
                              >
                                💪 {muscle}
                              </Badge>
                            ))}
                          </div>
                          {exercise.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {exercise.description}
                            </p>
                          )}
                          {exercise.difficulty && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground">Dificuldade:</span>
                              <Badge 
                                variant={exercise.difficulty === 'beginner' ? 'default' : exercise.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                                className="text-xs"
                              >
                                {exercise.difficulty === 'beginner' ? '🟢 Iniciante' : 
                                 exercise.difficulty === 'intermediate' ? '🟡 Intermediário' : '🔴 Avançado'}
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end gap-4">
            <Link href="/workouts">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Treino'}
            </Button>
          </div>
        </form>


      </div>
      </AppLayout>
    </ProtectedRoute>
  );
}