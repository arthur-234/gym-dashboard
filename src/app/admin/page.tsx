'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import FileUpload from '@/components/FileUpload'
import { 
  Users, 
  Dumbbell, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Shield,
  Clock,
  CheckCircle,
  Calendar
} from 'lucide-react'
import WorkoutAssignment from '@/components/admin/WorkoutAssignment'
import { AppLayout } from '@/components/AppLayout'

interface Exercise {
  id: string
  name: string
  category: string
  muscle: string
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado'
  equipment: string
  instructions: string[]
  tips: string[]
  imageUrl?: string
  videoUrl?: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  joinDate: string
  lastLogin: string
  workoutsCompleted: number
}

export default function AdminPage() {
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Supino Reto',
      category: 'Peito',
      muscle: 'Peitoral Maior',
      difficulty: 'Intermediário',
      equipment: 'Barra',
      instructions: [
        'Deite-se no banco com os pés firmes no chão',
        'Segure a barra com pegada pronada, mãos afastadas na largura dos ombros',
        'Desça a barra controladamente até tocar o peito',
        'Empurre a barra de volta à posição inicial'
      ],
      tips: [
        'Mantenha os ombros retraídos durante todo o movimento',
        'Não deixe a barra quicar no peito',
        'Expire ao empurrar a barra para cima'
      ]
    },
    {
      id: '2',
      name: 'Agachamento Livre',
      category: 'Pernas',
      muscle: 'Quadríceps',
      difficulty: 'Intermediário',
      equipment: 'Barra',
      instructions: [
        'Posicione a barra nas costas, apoiada no trapézio',
        'Mantenha os pés afastados na largura dos ombros',
        'Desça flexionando quadris e joelhos simultaneamente',
        'Suba retornando à posição inicial'
      ],
      tips: [
        'Mantenha o peito erguido e olhar para frente',
        'Não deixe os joelhos ultrapassarem a linha dos pés',
        'Desça até as coxas ficarem paralelas ao chão'
      ]
    }
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-01-20',
      workoutsCompleted: 45
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-19',
      workoutsCompleted: 32
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAddingExercise, setIsAddingExercise] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [isPromotingUser, setIsPromotingUser] = useState(false)
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: '',
    category: '',
    muscle: '',
    difficulty: 'Iniciante',
    equipment: '',
    instructions: [''],
    tips: [''],
    imageUrl: '',
    videoUrl: ''
  })

  const categories = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Braços', 'Core', 'Cardio']
  const difficulties = ['Iniciante', 'Intermediário', 'Avançado']

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddExercise = () => {
    if (newExercise.name && newExercise.category && newExercise.muscle) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        name: newExercise.name,
        category: newExercise.category,
        muscle: newExercise.muscle,
        difficulty: newExercise.difficulty || 'Iniciante',
        equipment: newExercise.equipment || '',
        instructions: newExercise.instructions?.filter(i => i.trim()) || [],
        tips: newExercise.tips?.filter(t => t.trim()) || []
      }
      setExercises([...exercises, exercise])
      setNewExercise({
        name: '',
        category: '',
        muscle: '',
        difficulty: 'Iniciante',
        equipment: '',
        instructions: [''],
        tips: [''],
        imageUrl: '',
        videoUrl: ''
      })
      setIsAddingExercise(false)
    }
  }

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id))
  }

  const handleToggleUserStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const handlePromoteToAdmin = () => {
    if (!newAdminName.trim()) return
    
    const userToPromote = users.find(user => 
      user.name.toLowerCase().includes(newAdminName.toLowerCase())
    )
    
    if (userToPromote) {
      setUsers(users.map(user => 
        user.id === userToPromote.id 
          ? { ...user, role: 'admin' }
          : user
      ))
      setNewAdminName('')
      setIsPromotingUser(false)
      alert(`${userToPromote.name} foi promovido a administrador!`)
    } else {
      alert('Usuário não encontrado. Verifique o nome digitado.')
    }
  }

  const handleToggleUserRole = (id: string) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, role: user.role === 'admin' ? 'user' : 'admin' }
        : user
    ))
  }

  const addInstruction = () => {
    setNewExercise({
      ...newExercise,
      instructions: [...(newExercise.instructions || []), '']
    })
  }

  const addTip = () => {
    setNewExercise({
      ...newExercise,
      tips: [...(newExercise.tips || []), '']
    })
  }

  const updateInstruction = (index: number, value: string) => {
    const instructions = [...(newExercise.instructions || [])]
    instructions[index] = value
    setNewExercise({ ...newExercise, instructions })
  }

  const updateTip = (index: number, value: string) => {
    const tips = [...(newExercise.tips || [])]
    tips[index] = value
    setNewExercise({ ...newExercise, tips })
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8" />
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie exercícios, usuários e conteúdo da plataforma
            </p>
          </div>
        </div>

        <Tabs defaultValue="exercises" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Exercícios
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Treinos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="exercises" className="space-y-6">
            {/* Controles de Exercícios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Gerenciar Exercícios
                  </span>
                  <Dialog open={isAddingExercise} onOpenChange={setIsAddingExercise}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Exercício
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Exercício</DialogTitle>
                        <DialogDescription>
                          Preencha as informações do exercício
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome do Exercício</Label>
                            <Input
                              id="name"
                              value={newExercise.name}
                              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                              placeholder="Ex: Supino Reto"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Select value={newExercise.category} onValueChange={(value) => setNewExercise({ ...newExercise, category: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="muscle">Músculo Principal</Label>
                            <Input
                              id="muscle"
                              value={newExercise.muscle}
                              onChange={(e) => setNewExercise({ ...newExercise, muscle: e.target.value })}
                              placeholder="Ex: Peitoral Maior"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="difficulty">Dificuldade</Label>
                            <Select value={newExercise.difficulty} onValueChange={(value: 'Iniciante' | 'Intermediário' | 'Avançado') => setNewExercise({ ...newExercise, difficulty: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {difficulties.map(diff => (
                                  <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="equipment">Equipamento</Label>
                          <Input
                            id="equipment"
                            value={newExercise.equipment}
                            onChange={(e) => setNewExercise({ ...newExercise, equipment: e.target.value })}
                            placeholder="Ex: Barra, Halteres, Peso Corporal"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Instruções</Label>
                          {newExercise.instructions?.map((instruction, index) => (
                            <Input
                              key={index}
                              value={instruction}
                              onChange={(e) => updateInstruction(index, e.target.value)}
                              placeholder={`Passo ${index + 1}`}
                            />
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Passo
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label>Dicas</Label>
                          {newExercise.tips?.map((tip, index) => (
                            <Input
                              key={index}
                              value={tip}
                              onChange={(e) => updateTip(index, e.target.value)}
                              placeholder={`Dica ${index + 1}`}
                            />
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={addTip}>
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Dica
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label>Imagens e Vídeos</Label>
                          <FileUpload
                            acceptedTypes="both"
                            maxSize={50}
                            onFileSelect={(file, type) => {
                              // Simular URL do arquivo após upload
                              const fakeUrl = URL.createObjectURL(file)
                              if (type === 'image') {
                                setNewExercise({ ...newExercise, imageUrl: fakeUrl })
                              } else {
                                setNewExercise({ ...newExercise, videoUrl: fakeUrl })
                              }
                            }}
                            onFileRemove={(type) => {
                              if (type === 'image') {
                                setNewExercise({ ...newExercise, imageUrl: '' })
                              } else {
                                setNewExercise({ ...newExercise, videoUrl: '' })
                              }
                            }}
                            currentImageUrl={newExercise.imageUrl}
                            currentVideoUrl={newExercise.videoUrl}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddingExercise(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAddExercise}>
                            Adicionar Exercício
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar exercícios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  {filteredExercises.map((exercise) => (
                    <Card key={exercise.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{exercise.name}</h3>
                              <Badge variant="secondary">{exercise.category}</Badge>
                              <Badge variant={exercise.difficulty === 'Iniciante' ? 'default' : exercise.difficulty === 'Intermediário' ? 'secondary' : 'destructive'}>
                                {exercise.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <strong>Músculo:</strong> {exercise.muscle} | <strong>Equipamento:</strong> {exercise.equipment}
                            </p>
                            <p className="text-sm">
                              <strong>Instruções:</strong> {exercise.instructions.length} passos | <strong>Dicas:</strong> {exercise.tips.length}
                              {exercise.imageUrl && ' | 📷 Imagem'}
                              {exercise.videoUrl && ' | 🎥 Vídeo'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteExercise(exercise.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Controles de Usuários */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gerenciar Usuários
                  </div>
                  <Dialog open={isPromotingUser} onOpenChange={setIsPromotingUser}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Promover Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Promover Usuário a Administrador</DialogTitle>
                        <DialogDescription>
                          Digite o nome do usuário que deseja promover a administrador.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="adminName">Nome do Usuário</Label>
                          <Input
                            id="adminName"
                            placeholder="Digite o nome do usuário..."
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handlePromoteToAdmin} className="flex-1">
                            Promover
                          </Button>
                          <Button variant="outline" onClick={() => setIsPromotingUser(false)} className="flex-1">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid gap-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{user.name}</h3>
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role === 'admin' ? 'Admin' : 'Usuário'}
                              </Badge>
                              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                {user.status === 'active' ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Entrou em {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                Último login: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                {user.workoutsCompleted} treinos
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant={user.role === 'admin' ? 'outline' : 'default'} 
                              size="sm"
                              onClick={() => handleToggleUserRole(user.id)}
                            >
                              {user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                            </Button>
                            <Button 
                              variant={user.status === 'active' ? 'destructive' : 'default'} 
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === 'active' ? 'Desativar' : 'Ativar'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <WorkoutAssignment />
          </TabsContent>
        </Tabs>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}