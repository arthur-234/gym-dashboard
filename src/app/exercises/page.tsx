'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Target, MoreVertical, Edit, Trash2, Info } from "lucide-react";
import { searchExercises } from '@/data/exerciseDatabase'
import { ExerciseImage } from '@/components/ui/exercise-image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useEffect, useState } from "react";

import { MUSCLE_GROUP_OPTIONS, getUniqueMuscleGroups, normalizeMuscleGroup } from '@/constants/muscleGroups';

export default function ExercisesPage() {
  const { state, loadExercises, deleteExercise } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'muscleGroup'>('name');
  
  useEffect(() => {
    loadExercises();
  }, [loadExercises]);



  // Filtrar e ordenar exercícios
  const filteredExercises = state.exercises
    .filter(exercise => {
      const matchesSearch = searchTerm === '' || searchExercises(searchTerm).includes(exercise) ||
                           exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || exercise.muscleGroups.some(mg => {
        const normalizedMg = normalizeMuscleGroup(mg);
        const normalizedCategory = normalizeMuscleGroup(filterCategory);
        return normalizedMg === normalizedCategory || normalizedMg.toLowerCase().includes(normalizedCategory.toLowerCase());
      });
      const matchesMuscleGroup = filterMuscleGroup === 'all' || exercise.muscleGroups.some(mg => {
        const normalizedMg = normalizeMuscleGroup(mg);
        const normalizedGroup = normalizeMuscleGroup(filterMuscleGroup);
        return normalizedMg === normalizedGroup || normalizedMg.toLowerCase().includes(normalizedGroup.toLowerCase());
      });
      
      return matchesSearch && matchesCategory && matchesMuscleGroup;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);

        case 'muscleGroup':
          return (a.muscleGroups[0] || '').localeCompare(b.muscleGroups[0] || '');
        default:
          return 0;
      }
    });

  const handleDeleteExercise = async (exerciseId: string) => {
    if (confirm('Tem certeza que deseja excluir este exercício?')) {
      await deleteExercise(exerciseId);
    }
  };


      case 'advanced':
        return 'Avançado';
      default:
        return difficulty;
    }
  };

  return (
    <AppLayout>
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-muted-foreground">
            {state.exercises.length} exercício{state.exercises.length !== 1 ? 's' : ''} na biblioteca
          </p>
        </div>
        
        <Link href="/exercises/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Exercício
          </Button>
        </Link>
      </div>

      {/* Filtros e busca */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Filtro por categoria */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  {MUSCLE_GROUP_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Filtro por grupo muscular */}
              <Select value={filterMuscleGroup} onValueChange={setFilterMuscleGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Grupo muscular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os grupos</SelectItem>
                  {MUSCLE_GROUP_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Ordenação */}
              <Select value={sortBy} onValueChange={(value: 'name' | 'muscleGroup') => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="muscleGroup">Grupo Muscular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de exercícios */}
      {filteredExercises.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {state.exercises.length === 0 ? 'Nenhum exercício na biblioteca' : 'Nenhum exercício encontrado'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {state.exercises.length === 0 
                  ? 'Comece adicionando exercícios à sua biblioteca'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
              {state.exercises.length === 0 && (
                <Link href="/exercises/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Exercício
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{exercise.name}</CardTitle>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {exercise.muscleGroups.map((muscle, index) => (
                        <Badge key={index} variant="outline">
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.equipment && (
                        <Badge variant="secondary">
                          {exercise.equipment}
                        </Badge>
                      )}
                    </div>
                    
                    {exercise.description && (
                      <CardDescription className="line-clamp-2">
                        {exercise.description}
                      </CardDescription>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/exercises/${exercise.id}`}>
                          <Info className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/exercises/${exercise.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Imagem do exercício */}
                {exercise.images && exercise.images.length > 0 && (
                  <div className="mb-4">
                    <ExerciseImage
                      images={exercise.images}
                      alt={exercise.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Equipamentos */}
                {exercise.equipment && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Equipamentos:</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {exercise.equipment}
                      </Badge>
                    </div>
                  </div>
                )}
                
                {/* Músculos principais */}
                {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Músculos principais:</h4>
                    <p className="text-sm text-muted-foreground">
                      {exercise.targetMuscles.join(', ')}
                    </p>
                  </div>
                )}
                
                {/* Instruções resumidas */}
                {exercise.instructions && exercise.instructions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Instruções:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {exercise.instructions.join(' • ')}
                    </p>
                  </div>
                )}
                
                {/* Ações */}
                <div className="flex gap-2 mt-4">
                  <Link href={`/exercises/${exercise.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm">
                      <Info className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Link href={`/exercises/${exercise.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}