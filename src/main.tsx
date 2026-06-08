import '@/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/layout'
import HomePage from '@/app/home'
import SignInPage from '@/app/signin'
import RegisterPage from '@/app/register'
import StudentLayout from '@/StudentLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import StudentDashboard from '@/app/student/dashboard'
import StudentProfile from '@/app/student/profile'
import StudentEnrollment from '@/app/student/enrollment'
import StudentCourseContent from '@/app/student/courseContent'
import StudentVideoPage from '@/app/student/video'
import TeacherLayout from '@/TeacherLayout'
import TeacherRoute from '@/components/TeacherRoute'
import TeacherDashboard from '@/app/teacher/dashboard'
import CreateCourse from '@/app/teacher/createCourse'
import TeacherCourseContent from '@/app/teacher/courseContent'
import CreateVideo from '@/app/teacher/createVideo'
import TeacherVideoPage from '@/app/teacher/video'
import CreateExam from '@/app/teacher/createExam'
import TeacherExamView from '@/app/teacher/exam'
import CourseStudents from '@/app/teacher/students'
import CourseResults from '@/app/teacher/courseResults'
import StudentSpecificResults from '@/app/teacher/studentResults'
import GradeExamAttempt from '@/app/teacher/gradeAttempt'

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
              <Route path="enrollment/:courseId" element={<StudentEnrollment />} />
              <Route path=":courseId" element={<StudentCourseContent />} />
              <Route path=":courseId/videos/:videoId" element={<StudentVideoPage />} />
            </Route>
          </Route>
          <Route path="/teacher" element={<TeacherRoute />}>
            <Route element={<TeacherLayout />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="courses/new" element={<CreateCourse />} />
              <Route path=":courseId" element={<TeacherCourseContent />} />
              <Route path=":courseId/videos/new" element={<CreateVideo />} />
              <Route path=":courseId/videos/:videoId" element={<TeacherVideoPage />} />
              <Route path=":courseId/exams/new" element={<CreateExam />} />
              <Route path=":courseId/exams/:examId" element={<TeacherExamView />} />
              <Route path=":courseId/students" element={<CourseStudents />} />
              <Route path=":courseId/results" element={<CourseResults />} />
              <Route path=":courseId/student/:studentId" element={<StudentSpecificResults />} />
              <Route path="attempt/:attemptId" element={<GradeExamAttempt />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)


