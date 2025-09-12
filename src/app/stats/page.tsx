'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Target, Zap, Clock, Trophy, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { AppLayout } from "@/components/AppLayout";

import { useWorkout } from "@/contexts/WorkoutContext";
import { useEffect, useState } from "react";
import { workoutService } from "@/services/workoutService";
import { Workout, Exercise } from "@/types";
import { normalizeMuscleGroup, MUSCLE_GROUP_COLORS } from "@/constants/muscleGroups";

// Função para calcular estatísticas dos treinos
function calculateWorkoutStats(workouts: Workout[], exercises: Exercise[]) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Treinos da semana
  const weeklyWorkouts = workouts.filter(w => new Date(w.createdAt) >= oneWeekAgo);
  
  // Treinos do mês
  const monthlyWorkouts = workouts.filter(w => new Date(w.createdAt) >= oneMonthAgo);
  
  // Dados semanais por dia
  const weeklyData = [];
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayWorkouts = weeklyWorkouts.filter(w => {
      const workoutDate = new Date(w.createdAt);
      return workoutDate.toDateString() === date.toDateString();
    });
    
    const totalDuration = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    
    weeklyData.unshift({
      day: days[date.getDay()],
      workouts: dayWorkouts.length,
      duration: totalDuration
    });
  }
  
  // Dados mensais (últimos 6 meses)
  const monthlyData = [];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    
    const monthWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.createdAt);
      return workoutDate >= date && workoutDate < nextMonth;
    });
    
    monthlyData.push({
      month: months[date.getMonth()],
      workouts: monthWorkouts.length,
      weight: 0 // Placeholder - seria obtido do perfil do usuário
    });
  }
  
  // Distribuição por grupos musculares
  const muscleGroupCount: { [key: string]: number } = {};

  workouts.forEach(workout => {
    workout.exercises.forEach(workoutExercise => {
      // Busca o exercício completo pelo ID
      const exercise = exercises.find(ex => ex.id === workoutExercise.exerciseId);
      if (exercise && exercise.muscleGroups) {
        exercise.muscleGroups.forEach(group => {
          const normalizedGroup = normalizeMuscleGroup(group);
          muscleGroupCount[normalizedGroup] = (muscleGroupCount[normalizedGroup] || 0) + 1;
        });
      }
    });
  });
  
  const muscleGroupData = Object.entries(muscleGroupCount)
    .map(([name, value]) => ({
      name,
      value,
      color: MUSCLE_GROUP_COLORS[name] || '#8884d8'
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 grupos musculares
  
  // Conquistas baseadas nos dados reais
  const totalWorkouts = workouts.length;
  const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
  const weeklyWorkoutCount = weeklyWorkouts.length;
  
  const achievements = [
    {
      title: 'Primeiro Treino',
      description: 'Complete seu primeiro treino',
      completed: totalWorkouts > 0,
      progress: totalWorkouts > 0 ? 100 : 0
    },
    {
      title: 'Consistência Semanal',
      description: 'Complete 3 treinos em uma semana',
      completed: weeklyWorkoutCount >= 3,
      progress: Math.min((weeklyWorkoutCount / 3) * 100, 100)
    },
    {
      title: 'Maratonista',
      description: 'Complete 50 treinos no total',
      completed: totalWorkouts >= 50,
      progress: Math.min((totalWorkouts / 50) * 100, 100)
    },
    {
      title: 'Dedicação Total',
      description: 'Acumule 100 horas de treino',
      completed: totalDuration >= 6000, // 100 horas em minutos
      progress: Math.min((totalDuration / 6000) * 100, 100)
    }
  ];
  
  return {
    weeklyData,
    monthlyData,
    muscleGroupData,
    achievements,
    stats: {
      totalWorkouts,
      weeklyWorkouts: weeklyWorkoutCount,
      monthlyWorkouts: monthlyWorkouts.length,
      totalDuration,
      averageDuration: totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0
    }
  };
}

export default function StatsPage() {
  const { state } = useWorkout();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    weeklyData: Array<{ day: string; workouts: number; duration: number }>;
    monthlyData: Array<{ month: string; workouts: number; weight: number }>;
    muscleGroupData: Array<{ name: string; value: number; color: string }>;
    achievements: Array<{ title: string; description: string; completed: boolean; progress: number }>;
    stats: {
      totalWorkouts: number;
      weeklyWorkouts: number;
      monthlyWorkouts: number;
      totalDuration: number;
      averageDuration: number;
    };
  } | null>(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const response = await workoutService.getWorkouts();
        if (response.success && response.data) {
          const calculatedStats = calculateWorkoutStats(response.data, state.exercises);
          setStats(calculatedStats);
        }
      } catch (error) {
        console.error('Erro ao carregar treinos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkouts();
  }, [state.exercises]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando estatísticas...</div>
        </div>
      </AppLayout>
    );
  }

  if (!stats) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Nenhum dado encontrado</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Estatísticas</h1>
            <p className="text-muted-foreground">Acompanhe seu progresso e conquistas</p>
          </div>
          <Badge variant="outline" className="text-sm">
            <Activity className="h-4 w-4 mr-1" />
            Última atividade: Hoje
          </Badge>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treinos Este Mês</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.stats.monthlyWorkouts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.stats.monthlyWorkouts > 0 ? 'Continue assim!' : 'Comece seu primeiro treino'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.stats.totalDuration / 60)}h</div>
              <p className="text-xs text-muted-foreground">
                Média de {stats.stats.averageDuration}min por treino
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.stats.weeklyWorkouts}</div>
              <p className="text-xs text-muted-foreground">
                Meta: 5 treinos por semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.stats.totalWorkouts}</div>
              <Progress value={Math.min((stats.stats.weeklyWorkouts / 5) * 100, 100)} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((stats.stats.weeklyWorkouts / 5) * 100)}% da meta semanal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
         <Tabs defaultValue="weekly" className="space-y-4">
           <TabsList>
             <TabsTrigger value="weekly">Semanal</TabsTrigger>
             <TabsTrigger value="monthly">Mensal</TabsTrigger>
             <TabsTrigger value="muscle-groups">Grupos Musculares</TabsTrigger>
           </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Treinos da Semana</CardTitle>
                  <CardDescription>Frequência de treinos nos últimos 7 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="workouts" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Duração dos Treinos</CardTitle>
                  <CardDescription>Tempo gasto em cada treino (minutos)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="duration" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Progresso Mensal</CardTitle>
                <CardDescription>Evolução de treinos e peso ao longo dos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={stats.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="workouts" fill="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="muscle-groups" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Grupo Muscular</CardTitle>
                <CardDescription>Porcentagem de treinos por grupo muscular</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={stats.muscleGroupData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.muscleGroupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Conquistas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Conquistas
            </CardTitle>
            <CardDescription>Seus marcos e objetivos alcançados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {stats.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    achievement.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    {!achievement.completed && achievement.progress && (
                      <div className="mt-2">
                        <Progress value={achievement.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{achievement.progress}% completo</p>
                      </div>
                    )}
                  </div>
                  {achievement.completed && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Completo
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}