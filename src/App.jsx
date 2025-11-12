import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ChatProvider } from './contexts/ChatContext'
import MainLayout from './components/layout/MainLayout'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

const AuthWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return isLogin ? (
      <Login onSwitchToRegister={() => setIsLogin(false)} />
    ) : (
      <Register onSwitchToLogin={() => setIsLogin(true)} />
    )
  }

  return (
    <ChatProvider>
      <MainLayout />
    </ChatProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  )
}

export default App