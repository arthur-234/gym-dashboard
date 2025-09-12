'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showResetForm, setShowResetForm] = useState(false)
  
  const { signIn, signUp, resetPassword } = useAuth()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (isSignUp) {
        await signUp(username, password, displayName)
      } else {
        await signIn(username, password)
      }
      router.push('/')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erro na autenticação')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await resetPassword(resetToken, newPassword)
      setShowResetForm(false)
      setResetToken('')
      setNewPassword('')
      alert('Senha resetada com sucesso!')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erro ao resetar senha')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">💪</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {showResetForm ? 'Resetar Senha' : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </CardTitle>
          <CardDescription>
            {showResetForm 
              ? 'Use seu token para resetar sua senha'
              : (isSignUp 
                ? 'Crie sua conta para começar seus treinos'
                : 'Entre na sua conta para continuar'
              )
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!showResetForm ? (
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nome completo</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Seu nome"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSignUp ? 'Criar conta' : 'Entrar'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetToken">Token de Reset</Label>
                <Input
                  id="resetToken"
                  type="text"
                  placeholder="Digite seu token pessoal"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Digite sua nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resetar Senha
              </Button>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowResetForm(false)}
              >
                Voltar ao Login
              </Button>
            </form>
          )}
          
          <div className="space-y-2 text-center text-sm">
            {!isSignUp && !showResetForm && (
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={() => setShowResetForm(true)}
              >
                Esqueceu sua senha?
              </Button>
            )}
            
            {!showResetForm && (
              <div>
                <span className="text-muted-foreground">
                  {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                </span>{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                  }}
                >
                  {isSignUp ? 'Entrar' : 'Criar conta'}
                </Button>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/">
              <Button variant="link" className="p-0 h-auto font-normal text-xs">
                ← Voltar ao início
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}