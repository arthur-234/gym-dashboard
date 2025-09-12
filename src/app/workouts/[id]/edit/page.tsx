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
import { Save, ArrowLeft, Plus, X, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Workout, WorkoutExercise, Exercise } from "@/types";

interface WorkoutForm {
  name: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: number;
  exercises: WorkoutExercise[];
}

export default function EditWorkoutPage() {
  const { state, updateWorkout } = useWorkout();
  const router = useRouter();
  const params = useParams();
  const workoutId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  
  const [form, setForm] = useState<WorkoutForm>({
    name: '',
    description: '',
    category: 'strength',
    difficulty: 'beginner',
    estimatedDuration: 45,
    exercises: []
  });

  const categories = [
    { value: 'strength', label: 'Força' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibilidade' },
    { value: 'sports', label: 'Esportes' },
    { value: 'mixed', label: 'Misto' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Iniciante' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' }
  ];

  const muscleGroups = [
    { value: 'all', label: 'Todos os grupos' },
    { value: 'chest', label: 'Peito' },
    { value: 'back', label: 'Costas' },
    { value: 'shoulders', label: 'Ombros' },
    { value: 'arms', label: 'Braços' },
    { value: 'legs', label: 'Pernas' },
    { value: 'core', label: 'Core/Abdômen' },
    { value: 'glutes', label: 'Glúteos' },
    { value: 'full-body', label: 'Corpo Inteiro' }
  ];

  const exerciseCategories = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'strength', label: 'Força' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibilidade' },
    { value: 'sports', label: 'Esportes' }
  ];

  // Carregar treino
  useEffect(() => {
    const foundWorkout = state.workouts.find(w => w.id === workoutId);
    if (foundWorkout) {
      setWorkout(foundWorkout);
      setForm({
        name: foundWorkout.name,
        description: foundWorkout.description || '',
        category: foundWorkout.category || 'strength',
        difficulty: foundWorkout.difficulty || 'beginner',
        estimatedDuration: foundWorkout.estimatedDuration || 45,
        exercises: foundWorkout.exercises
      });
    }
    setIsLoadingWorkout(false);
  }, [state.workouts, workoutId]);

  // Filtrar exercícios disponíveis
  const filteredExercises = state.exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.muscleGroups.some(mg => mg.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesMuscleGroup = selectedMuscleGroup === 'all' || exercise.muscleGroups.some(mg => mg.toLowerCase().includes(selectedMuscleGroup.toLowerCase()));
    const notInWorkout = !form.exercises.some(we => we.exerciseId === exercise.id);
    
    return matchesSearch && matchesCategory && matchesMuscleGroup && notInWorkout;
  });

  const addExercise = (exercise: Exercise) => {
    const newWorkoutExercise: WorkoutExercise = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      sets: [
        {
          id: crypto.randomUUID(),
          reps: 12,
          weight: exercise.muscleGroups.some(mg => mg.toLowerCase().includes('strength')) ? 20 : undefined,
          restTime: 60
        }
      ]
    };
    
    setForm(prev => ({
      ...prev,
      exercises: [...prev.exercises, newWorkoutExercise]
    }));
  };

  const removeExercise = (index: number) => {
    setForm(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: number) => {
    setForm(prev => {
      const newExercises = [...prev.exercises];
      (newExercises[index] as any)[field] = value;
      return { ...prev, exercises: newExercises };
    });
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newExercises = [...form.exercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newExercises.length) {
      [newExercises[index], newExercises[targetIndex]] = 
      [newExercises[targetIndex], newExercises[index]];
      
      setForm(prev => ({ ...prev, exercises: newExercises }));
    }
  };

  const getExerciseDetails = (exerciseId: string) => {
    return state.exercises.find(ex => ex.id === exerciseId);
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
    
    if (!workout) {
      alert('Treino não encontrado.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateWorkout({
        ...workout,
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        difficulty: form.difficulty as 'beginner' | 'intermediate' | 'advanced',
        estimatedDuration: form.estimatedDuration,
        exercises: form.exercises,
        updatedAt: new Date()
      });
      
      router.push(`/workouts/${workout.id}`);
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      alert('Erro ao atualizar treino. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingWorkout) {
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
                  O treino que você está tentando editar não foi encontrado.
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/workouts/${workout.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Editar Treino</h1>
            <p className="text-muted-foreground">Atualize as informações do seu treino</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          {/* Formulário principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Configure as informações principais do treino
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o objetivo e características do treino..."
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificuldade *</Label>
                    <Select value={form.difficulty} onValueChange={(value) => setForm(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (min) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="15"
                      max="180"
                      value={form.estimatedDuration}
                      onChange={(e) => setForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) || 45 }))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exercícios do treino */}
            <Card>
              <CardHeader>
                <CardTitle>Exercícios do Treino ({form.exercises.length})</CardTitle>
                <CardDescription>
                  Configure os exercícios, séries, repetições e cargas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {form.exercises.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Nenhum exercício adicionado ainda.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Use o painel ao lado para adicionar exercícios ao seu treino.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {form.exercises.map((workoutExercise, index) => {
                      const exercise = getExerciseDetails(workoutExercise.exerciseId);
                      if (!exercise) return null;
                      
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold">{exercise.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {exercise.muscleGroups.join(', ')}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => moveExercise(index, 'up')}
                                >
                                  ↑
                                </Button>
                              )}
                              {index < form.exercises.length - 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => moveExercise(index, 'down')}
                                >
                                  ↓
                                </Button>
                              )}
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeExercise(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="space-y-2">
                              <Label>Séries</Label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={workoutExercise.sets.length}
                                onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Repetições</Label>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                value={workoutExercise.reps}
                                onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            
                            {exercise.muscleGroups.some(mg => mg.toLowerCase().includes('strength')) && (
                              <div className="space-y-2">
                                <Label>Peso (kg)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.5"
                                  value={workoutExercise.weight || 0}
                                  onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label>Descanso (s)</Label>
                              <Input
                                type="number"
                                min="0"
                                max="300"
                                value={workoutExercise.restTime || 60}
                                onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value) || 60)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex justify-end gap-4">
              <Link href={`/workouts/${workout.id}`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>

          {/* Sidebar - Biblioteca de exercícios */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Exercícios</CardTitle>
                <CardDescription>
                  Busque e adicione exercícios ao seu treino
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar exercícios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Filtros */}
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseCategories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Grupo Muscular</Label>
                    <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {muscleGroups.map(group => (
                          <SelectItem key={group.value} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                {/* Lista de exercícios */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredExercises.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {searchTerm || selectedCategory !== 'all' || selectedMuscleGroup !== 'all'
                        ? 'Nenhum exercício encontrado com os filtros aplicados.'
                        : 'Todos os exercícios já foram adicionados ao treino.'
                      }
                    </p>
                  ) : (
                    filteredExercises.map(exercise => (
                      <div key={exercise.id} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{exercise.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {exercise.muscleGroups.map((muscle, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {muscle}
                              </Badge>
                            ))}
                            {exercise.equipment && (
                              <Badge variant="secondary" className="text-xs">
                                {exercise.equipment}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => addExercise(exercise)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}