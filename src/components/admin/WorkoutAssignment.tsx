'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, User, Dumbbell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Workout } from '@/types';

interface UserWorkoutAssignment {
  id: string;
  userId: string;
  userName: string;
  workoutId: string;
  workoutName: string;
  assignedAt: Date;
  status: 'active' | 'completed' | 'paused';
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Mock data - em produção viria de uma API
const mockUsers: User[] = [];

const mockWorkouts: Workout[] = [];

export default function WorkoutAssignment() {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState<UserWorkoutAssignment[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedWorkout, setSelectedWorkout] = useState<string>('');
  const [searchUser, setSearchUser] = useState('');
  const [searchWorkout, setSearchWorkout] = useState('');

  // Mock assignments - em produção viria de uma API
  useEffect(() => {
    const mockAssignments: UserWorkoutAssignment[] = [];
    setAssignments(mockAssignments);
  }, []);

  // Verificar se é admin
  if (profile?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <User className="mx-auto h-12 w-12 mb-4" />
            <p>Acesso restrito a administradores</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAssignWorkout = () => {
    if (!selectedUser || !selectedWorkout) return;

    const user = mockUsers.find(u => u.id === selectedUser);
    const workout = mockWorkouts.find(w => w.id === selectedWorkout);

    if (!user || !workout) return;

    const newAssignment: UserWorkoutAssignment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      workoutId: workout.id,
      workoutName: workout.name,
      assignedAt: new Date(),
      status: 'active'
    };

    setAssignments(prev => [...prev, newAssignment]);
    setSelectedUser('');
    setSelectedWorkout('');
  };

  const handleRemoveAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  const handleStatusChange = (assignmentId: string, newStatus: 'active' | 'completed' | 'paused') => {
    setAssignments(prev => 
      prev.map(a => 
        a.id === assignmentId ? { ...a, status: newStatus } : a
      )
    );
  };

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  const filteredWorkouts = mockWorkouts.filter(workout => 
    workout.name.toLowerCase().includes(searchWorkout.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Atribuição */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Atribuir Treino a Usuário
          </CardTitle>
          <CardDescription>
            Selecione um usuário e um treino para criar uma nova atribuição
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-select">Usuário</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Buscar usuário..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{user.name}</span>
                          <span className="text-sm text-muted-foreground">({user.email})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workout-select">Treino</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Buscar treino..."
                  value={searchWorkout}
                  onChange={(e) => setSearchWorkout(e.target.value)}
                />
                <Select value={selectedWorkout} onValueChange={setSelectedWorkout}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um treino" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredWorkouts.map(workout => (
                      <SelectItem key={workout.id} value={workout.id}>
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4" />
                          <span>{workout.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {workout.difficulty}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleAssignWorkout}
            disabled={!selectedUser || !selectedWorkout}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Atribuir Treino
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Atribuições */}
      <Card>
        <CardHeader>
          <CardTitle>Treinos Atribuídos</CardTitle>
          <CardDescription>
            Gerencie as atribuições de treinos para usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Dumbbell className="mx-auto h-12 w-12 mb-4" />
              <p>Nenhum treino atribuído ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{assignment.userName}</span>
                      <Dumbbell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{assignment.workoutName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Atribuído em: {assignment.assignedAt.toLocaleDateString('pt-BR')}</span>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status === 'active' ? 'Ativo' : 
                         assignment.status === 'completed' ? 'Concluído' : 'Pausado'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select 
                      value={assignment.status} 
                      onValueChange={(value: 'active' | 'completed' | 'paused') => 
                        handleStatusChange(assignment.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="paused">Pausado</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAssignment(assignment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}