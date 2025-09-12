'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Exercise } from '@/types';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2, Dumbbell, Target, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ExerciseDetailPage() {
  const { state, deleteExercise } = useWorkout();
  const router = useRouter();
  const params = useParams();
  const exerciseId = params.id as string;
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundExercise = state.exercises.find(ex => ex.id === exerciseId);
    setExercise(foundExercise || null);
    setIsLoading(false);
  }, [state.exercises, exerciseId]);

  const handleDelete = async () => {
    if (!exercise) return;
    
    const confirmed = confirm(`Tem certeza que deseja excluir o exercício "${exercise.name}"?`);
    if (confirmed) {
      deleteExercise(exercise.id);
      router.push('/exercises');
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return 'Não definido';
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando exercício...</div>
        </div>
      </AppLayout>
    );
  }

  if (!exercise) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-muted-foreground">Exercício não encontrado</div>
          <Link href="/exercises">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Exercícios
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/exercises">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{exercise.name}</h1>
              <p className="text-muted-foreground">{exercise.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href={`/exercises/${exercise.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Grupos Musculares</h4>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscleGroups.map((group, index) => (
                    <Badge key={index} variant="secondary">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {exercise.equipment && (
                <div>
                  <h4 className="font-medium mb-2">Equipamento</h4>
                  <Badge variant="outline">{exercise.equipment}</Badge>
                </div>
              )}
              
              {exercise.difficulty && (
                <div>
                  <h4 className="font-medium mb-2">Dificuldade</h4>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {getDifficultyLabel(exercise.difficulty)}
                  </Badge>
                </div>
              )}
              
              {exercise.category && (
                <div>
                  <h4 className="font-medium mb-2">Categoria</h4>
                  <Badge variant="outline">{exercise.category}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detalhes Técnicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Detalhes Técnicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Músculos Primários</h4>
                  <div className="flex flex-wrap gap-2">
                    {exercise.targetMuscles.map((muscle, index) => (
                      <Badge key={index} variant="default">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Músculos Secundários</h4>
                  <div className="flex flex-wrap gap-2">
                    {exercise.secondaryMuscles.map((muscle, index) => (
                      <Badge key={index} variant="secondary">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {exercise.exerciseType && (
                <div>
                  <h4 className="font-medium mb-2">Tipo de Exercício</h4>
                  <Badge variant="outline">{exercise.exerciseType}</Badge>
                </div>
              )}
              
              {exercise.force && (
                <div>
                  <h4 className="font-medium mb-2">Tipo de Força</h4>
                  <Badge variant="outline">{exercise.force}</Badge>
                </div>
              )}
              
              {exercise.mechanic && (
                <div>
                  <h4 className="font-medium mb-2">Mecânica</h4>
                  <Badge variant="outline">{exercise.mechanic}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instruções */}
        {exercise.instructions && exercise.instructions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Instruções de Execução
              </CardTitle>
              <CardDescription>
                Siga estas etapas para executar o exercício corretamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Dicas */}
        {exercise.tips && exercise.tips.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Dicas de Execução
              </CardTitle>
              <CardDescription>
                Dicas importantes para maximizar os resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Variações */}
        {exercise.variations && exercise.variations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Variações do Exercício</CardTitle>
              <CardDescription>
                Outras formas de executar este exercício
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {exercise.variations.map((variation, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{variation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}