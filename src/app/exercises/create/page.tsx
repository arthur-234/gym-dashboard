'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MUSCLE_GROUP_OPTIONS } from "@/constants/muscleGroups";

interface ExerciseForm {
  name: string;
  description: string;
  category: string;
  muscleGroup: string;
  difficulty: string;
  equipment: string[];
  instructions: string[];
}

export default function CreateExercisePage() {
  const { addExercise } = useWorkout();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newEquipment, setNewEquipment] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  
  const [form, setForm] = useState<ExerciseForm>({
    name: '',
    description: '',
    category: 'strength',
    muscleGroup: 'chest',
    difficulty: 'beginner',
    equipment: [],
    instructions: []
  });

  const categories = [
    { value: 'strength', label: 'Força' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'flexibility', label: 'Flexibilidade' },
    { value: 'sports', label: 'Esportes' },
    { value: 'other', label: 'Outro' }
  ];

  // Usando constantes padronizadas de grupos musculares

  const difficulties = [
    { value: 'beginner', label: 'Iniciante' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' }
  ];

  const addEquipment = () => {
    if (newEquipment.trim() && !form.equipment.includes(newEquipment.trim())) {
      setForm(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  const removeEquipment = (equipment: string) => {
    setForm(prev => ({
      ...prev,
      equipment: prev.equipment.filter(eq => eq !== equipment)
    }));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setForm(prev => ({
        ...prev,
        instructions: [...prev.instructions, newInstruction.trim()]
      }));
      setNewInstruction('');
    }
  };

  const removeInstruction = (index: number) => {
    setForm(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const moveInstruction = (index: number, direction: 'up' | 'down') => {
    const newInstructions = [...form.instructions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newInstructions.length) {
      [newInstructions[index], newInstructions[targetIndex]] = 
      [newInstructions[targetIndex], newInstructions[index]];
      
      setForm(prev => ({ ...prev, instructions: newInstructions }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      alert('Por favor, insira um nome para o exercício.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      addExercise({
        name: form.name.trim(),
        description: form.description.trim(),
        muscleGroups: [form.muscleGroup],
        equipment: form.equipment.join(', '),
        instructions: form.instructions
      });
      
      router.push('/exercises');
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
      alert('Erro ao criar exercício. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/exercises">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Configure as informações principais do exercício
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Exercício *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Supino Reto com Barra"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o exercício, seus benefícios e características..."
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
                  <Label htmlFor="muscleGroup">Grupo Muscular *</Label>
                  <Select value={form.muscleGroup} onValueChange={(value) => setForm(prev => ({ ...prev, muscleGroup: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
              </div>
            </CardContent>
          </Card>

          {/* Equipamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Equipamentos</CardTitle>
              <CardDescription>
                Liste os equipamentos necessários para este exercício
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Equipamentos adicionados */}
              {form.equipment.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.equipment.map((equipment, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {equipment}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEquipment(equipment)}
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Adicionar equipamento */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: Barra, Halteres, Banco..."
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEquipment())}
                />
                <Button type="button" onClick={addEquipment}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle>Instruções de Execução</CardTitle>
              <CardDescription>
                Adicione as instruções passo a passo para executar o exercício
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Instruções adicionadas */}
              {form.instructions.length > 0 && (
                <div className="space-y-2">
                  {form.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 border rounded">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-sm">{instruction}</div>
                      <div className="flex gap-1">
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveInstruction(index, 'up')}
                            className="h-6 w-6 p-0"
                          >
                            ↑
                          </Button>
                        )}
                        {index < form.instructions.length - 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveInstruction(index, 'down')}
                            className="h-6 w-6 p-0"
                          >
                            ↓
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInstruction(index)}
                          className="h-6 w-6 p-0 text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Adicionar instrução */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ex: Deite-se no banco com os pés apoiados no chão..."
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  rows={2}
                />
                <Button type="button" onClick={addInstruction} className="self-start">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-end gap-4">
            <Link href="/exercises">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar Exercício'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}