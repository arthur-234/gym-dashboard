'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell, Target, TrendingUp, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEffect } from "react";

export default function Home() {
  const { state, loadWorkouts, loadExercises } = useWorkout();
  const { user, profile } = useAuth();
  
  useEffect(() => {
    loadWorkouts();
    loadExercises();
  }, [loadWorkouts, loadExercises]);

  // Estatísticas calculadas
  const totalWorkouts = state.workouts.length;
  const totalExercises = state.exercises.length;
  const completedWorkouts = state.workouts.filter(w => w.completedAt).length;
  const thisWeekWorkouts = state.workouts.filter(w => {
    if (!w.completedAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(w.completedAt) > weekAgo;
  }).length;

  return (
    <ProtectedRoute>
      <AppLayout>
      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Treinos
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              {completedWorkouts} concluídos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Exercícios Disponíveis
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExercises}</div>
            <p className="text-xs text-muted-foreground">
              Na sua biblioteca
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Esta Semana
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              Treinos realizados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progresso
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de conclusão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Criar Novo Treino
            </CardTitle>
            <CardDescription>
              Monte um treino personalizado com seus exercícios favoritos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/workouts/create">
              <Button className="w-full">
                Começar Agora
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Meus Treinos
            </CardTitle>
            <CardDescription>
              Visualize e gerencie todos os seus treinos criados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/workouts">
              <Button variant="outline" className="w-full">
                Ver Treinos
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Biblioteca de Exercícios
            </CardTitle>
            <CardDescription>
              Explore exercícios e adicione novos à sua biblioteca
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/exercises">
              <Button variant="outline" className="w-full">
                Explorar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Treinos Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Treinos Recentes</CardTitle>
          <CardDescription>
            Seus últimos treinos realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.workouts.length === 0 ? (
            <div className="text-center py-8">
              <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum treino ainda</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro treino personalizado
              </p>
              <Link href="/workouts/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Treino
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {state.workouts
                .filter(w => w.completedAt)
                .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
                .slice(0, 5)
                .map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Dumbbell className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{workout.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {workout.completedAt && new Date(workout.completedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {workout.exercises.length} exercícios
                    </div>
                  </div>
                ))}
              
              {state.workouts.filter(w => w.completedAt).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum treino concluído ainda
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      </AppLayout>
    </ProtectedRoute>
  );
}
