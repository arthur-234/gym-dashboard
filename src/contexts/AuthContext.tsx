'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { LocalAuth, User } from '@/lib/auth'

interface UserProfile {
  id: string
  username: string
  displayName: string
  email?: string
  role: 'user' | 'admin'
  isAdmin?: boolean
  token: string
  createdAt: Date
  lastLogin: Date
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
    language: string
  }
  stats: {
    totalWorkouts: number
    totalCalories: number
    currentStreak: number
    longestStreak: number
  }
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signUp: (username: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  regenerateToken: () => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const createUserProfile = async (user: User): Promise<UserProfile> => {
    const profile: UserProfile = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      isAdmin: user.role === 'admin',
      token: user.token,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'pt-BR'
      },
      stats: {
        totalWorkouts: 0,
        totalCalories: 0,
        currentStreak: 0,
        longestStreak: 0
      }
    }
    
    return profile
  }

  const signIn = async (username: string, password: string) => {
    try {
      const user = await LocalAuth.signIn(username, password)
      setUser(user)
      const userProfile = await createUserProfile(user)
      setProfile(userProfile)
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  }

  const signUp = async (username: string, password: string, displayName: string) => {
    try {
      const user = await LocalAuth.signUp(username, password, displayName)
      setUser(user)
      const userProfile = await createUserProfile(user)
      setProfile(userProfile)
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      LocalAuth.signOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Erro no logout:', error)
      throw error
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('Usuário não autenticado')
    
    try {
      const updatedUser = await LocalAuth.updateProfile(user.id, updates)
      setUser(updatedUser)
      
      // Atualizar perfil local
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await LocalAuth.resetPassword(token, newPassword)
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      throw error
    }
  }

  const regenerateToken = (): string => {
    if (!user) throw new Error('Usuário não autenticado')
    
    try {
      const newToken = LocalAuth.regenerateToken(user.id)
      setUser(prev => prev ? { ...prev, token: newToken } : null)
      setProfile(prev => prev ? { ...prev, token: newToken } : null)
      return newToken
    } catch (error) {
      console.error('Erro ao regenerar token:', error)
      throw error
    }
  }



  useEffect(() => {
    if (!mounted) return

    // Verificar se há usuário logado no localStorage
    const currentUser = LocalAuth.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      createUserProfile(currentUser).then(profile => {
        setProfile(profile)
      })
    }
    setLoading(false)
  }, [mounted])

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    resetPassword,
    regenerateToken
  }

  if (!mounted) {
    return null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}