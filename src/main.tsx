import '@/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/layout'
import HomePage from '@/app/home'
import SignInPage from '@/app/signin'
import RegisterPage from '@/app/register'
import StudentLayout from '@/StudentLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import StudentDashboard from '@/app/student/dashboard'
import { AuthProvider } from '@/contexts/AuthContext'
import StudentProfile from '@/app/student/profile'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/student" element={<ProtectedRoute />}>
            <Route element={<StudentLayout />}>
              <Route index element={<StudentDashboard />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)

