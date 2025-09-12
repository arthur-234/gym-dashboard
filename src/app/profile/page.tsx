'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Key, 
  Settings, 
  Copy, 
  RefreshCw, 
  Shield, 
  Bell, 
  Globe, 
  Palette,
  Activity,
  Trophy,
  Target,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ProfilePage() {
  const { user, profile, updateUserProfile, regenerateToken } = useAuth();
  const [isRegeneratingToken, setIsRegeneratingToken] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [theme, setTheme] = useState<'light' | 'dark'>(profile?.preferences?.theme || 'light');
  const [notifications, setNotifications] = useState<boolean>(profile?.preferences?.notifications || true);
  const [language, setLanguage] = useState(profile?.preferences?.language || 'pt-BR');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleCopyToken = async () => {
    if (profile?.token) {
      await navigator.clipboard.writeText(profile.token);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    }
  };

  const handleRegenerateToken = async () => {
    setIsRegeneratingToken(true);
    try {
      await regenerateToken();
    } catch (error) {
      console.error('Erro ao regenerar token:', error);
    } finally {
      setIsRegeneratingToken(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await updateUserProfile({
        displayName,
        email,
        preferences: {
          theme,
          notifications,
          language
        }
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Meu Perfil</h1>
              <p className="text-muted-foreground">Gerencie suas informações e configurações</p>
            </div>
          </div>

          {updateSuccess && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Perfil atualizado com sucesso!
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
              <TabsTrigger value="preferences">Preferências</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                  <CardDescription>
                    Atualize suas informações básicas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de usuário</Label>
                      <Input
                        id="username"
                        value={user.username}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        O nome de usuário não pode ser alterado
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Nome de exibição</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (opcional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Função</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </Badge>
                        {user.role === 'admin' && (
                          <Shield className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <strong>Conta criada em:</strong><br />
                      {format(user.createdAt, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                    <div>
                      <strong>Último acesso:</strong><br />
                      {format(user.lastLogin, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Token de Autenticação
                  </CardTitle>
                  <CardDescription>
                    Use este token para resetar sua senha quando necessário
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Seu Token Pessoal</Label>
                    <div className="flex gap-2">
                      <Input
                        value={user.token}
                        readOnly
                        className="font-mono text-sm bg-muted"
                        type="password"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyToken}
                        className={tokenCopied ? 'bg-green-50 border-green-200' : ''}
                      >
                        <Copy className={`h-4 w-4 ${tokenCopied ? 'text-green-600' : ''}`} />
                      </Button>
                    </div>
                    {tokenCopied && (
                      <p className="text-xs text-green-600">Token copiado!</p>
                    )}
                  </div>
                  
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Importante:</strong> Guarde este token em local seguro. 
                      Você precisará dele para resetar sua senha na tela de login.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleRegenerateToken}
                      disabled={isRegeneratingToken}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRegeneratingToken ? 'animate-spin' : ''}`} />
                      {isRegeneratingToken ? 'Regenerando...' : 'Regenerar Token'}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Regenerar o token invalidará o token atual. Certifique-se de salvar o novo token.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferências
                  </CardTitle>
                  <CardDescription>
                    Personalize sua experiência no aplicativo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Tema
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Escolha entre tema claro ou escuro
                        </p>
                      </div>
                      <Select value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Notificações
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações sobre treinos e lembretes
                        </p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={(checked: boolean) => setNotifications(checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Idioma
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Idioma da interface do aplicativo
                        </p>
                      </div>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total de Treinos</p>
                        <p className="text-2xl font-bold">{profile?.stats?.totalWorkouts || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Calorias Queimadas</p>
                        <p className="text-2xl font-bold">{profile?.stats?.totalCalories || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Sequência Atual</p>
                        <p className="text-2xl font-bold">{profile?.stats?.currentStreak || 0} dias</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Melhor Sequência</p>
                        <p className="text-2xl font-bold">{profile?.stats?.longestStreak || 0} dias</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="flex items-center gap-2"
            >
              {isUpdating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}