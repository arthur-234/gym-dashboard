'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Dumbbell, Clock, Target, Calendar, MoreVertical, Play, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Workout } from "@/types";
import toast from "react-hot-toast";

export default function WorkoutsPage() {
  const { state, loadWorkouts, deleteWorkout } = useWorkout();
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('created');
  const [assignedWorkouts, setAssignedWorkouts] = useState<string[]>([]);
  
  const isAdmin = profile?.role === 'admin';
  
  useEffect(() => {
    loadWorkouts();
    
    // Carregar treinos atrelados do localStorage para usuários não-admin
    if (!isAdmin && profile?.id) {
      const stored = localStorage.getItem(`assignedWorkouts_${profile.id}`);
      if (stored) {
        setAssignedWorkouts(JSON.parse(stored));
      }
    }
  }, [loadWorkouts, isAdmin, profile?.id]);

  // Filtrar e ordenar treinos
  const filteredWorkouts = state.workouts
    .filter(workout => {
      // Para usuários não-admin, mostrar apenas treinos atrelados
      if (!isAdmin && !assignedWorkouts.includes(workout.id)) {
        return false;
      }
      
      const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           workout.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' ||
                           (filterStatus === 'completed' && workout.completedAt) ||
                           (filterStatus === 'pending' && !workout.completedAt);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

  const handleDeleteWorkout = async (workoutId: string) => {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
      await deleteWorkout(workoutId);
    }
  };

  const getWorkoutDuration = (workout: Workout) => {
    const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    const estimatedMinutes = totalSets * 2; // Estimativa de 2 minutos por série
    return `~${estimatedMinutes} min`;
  };

  const getWorkoutStats = (workout: Workout) => {
    const totalExercises = workout.exercises.length;
    const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
    return { totalExercises, totalSets };
  };

  return (
    <AppLayout>
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <p className="text-muted-foreground">
            {state.workouts.length} treino{state.workouts.length !== 1 ? 's' : ''} criado{state.workouts.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {isAdmin && (
          <Link href="/workouts/create">
            <Button variant="outline" className="hover:bg-muted">
              <Plus className="h-4 w-4 mr-2" />
              Novo Treino
            </Button>
          </Link>
        )}
      </div>

      {/* Filtros e busca */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar treinos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtro por status */}
            <Select value={filterStatus} onValueChange={(value: 'all' | 'completed' | 'pending') => setFilterStatus(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Ordenação */}
            <Select value={sortBy} onValueChange={(value: 'name' | 'created' | 'updated') => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created">Mais recentes</SelectItem>
                <SelectItem value="updated">Atualizados</SelectItem>
                <SelectItem value="name">Nome A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de treinos */}
      {filteredWorkouts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Dumbbell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {state.workouts.length === 0 ? 'Nenhum treino criado' : 'Nenhum treino encontrado'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {state.workouts.length === 0 
                  ? 'Comece criando seu primeiro treino personalizado'
                  : 'Tente ajustar os filtros de busca'
                }
              </p>
              {state.workouts.length === 0 && isAdmin && (
                <Link href="/workouts/create">
                  <Button variant="outline" className="hover:bg-muted">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Treino
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorkouts.map((workout) => {
            const stats = getWorkoutStats(workout);
            
            return (
              <Card key={workout.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{workout.name}</CardTitle>
                      {workout.description && (
                        <CardDescription className="line-clamp-2">
                          {workout.description}
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
                          <Link href={`/workouts/${workout.id}`}>
                            <Play className="h-4 w-4 mr-2" />
                            Iniciar Treino
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/workouts/${workout.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Status badge */}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={workout.completedAt ? 'default' : 'secondary'}>
                      {workout.completedAt ? 'Concluído' : 'Pendente'}
                    </Badge>
                    {workout.completedAt && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(workout.completedAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Estatísticas do treino */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-medium">{stats.totalExercises}</div>
                      <div className="text-xs text-muted-foreground">Exercícios</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-medium">{stats.totalSets}</div>
                      <div className="text-xs text-muted-foreground">Séries</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="text-sm font-medium">{getWorkoutDuration(workout)}</div>
                      <div className="text-xs text-muted-foreground">Duração</div>
                    </div>
                  </div>
                  
                  {/* Ações */}
                  <div className="flex gap-2">
                    <Link href={`/workouts/${workout.id}`} className="flex-1">
                      <Button className="w-full" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        {workout.completedAt ? 'Refazer' : 'Iniciar'}
                      </Button>
                    </Link>
                    <Link href={`/workouts/${workout.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Data de criação */}
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Criado em {new Date(workout.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}