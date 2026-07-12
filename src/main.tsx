import '@/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Layout from '@/layout'
import HomePage from '@/app/home'
import LoginPage from '@/app/login'
import RegisterPage from '@/app/register'
import StudentLayout from '@/app/student/StudentLayout'
import StudentDashboard from '@/app/student/dashboard'
import ProfilePage from '@/app/shared/profile'
import StudentEnrollment from '@/app/student/enrollment'
import StudentCourseContent from '@/app/student/courseContent'
import StudentVideoPage from '@/app/student/video'
import StudentExamFlow from '@/app/student/examFlow'
import StudentAttemptView from '@/app/student/viewAttempt'
import StudentResultsDashboard from '@/app/teacher/studentResultsDashboard'
import TeacherLayout from '@/app/teacher/TeacherLayout'
import TeacherDashboard from '@/app/teacher/dashboard'
import TeacherCourseContent from '@/app/teacher/courseContent'
import TeacherCourseVideos from '@/app/teacher/courseVideos'
import TeacherCourseExams from '@/app/teacher/courseExams'
import TeacherVideoPage from '@/app/teacher/video'
import CreateExam from '@/app/teacher/createExam'
import TeacherExamView from '@/app/teacher/exam'
import CourseStudents from '@/app/teacher/students'
import CourseResults from '@/app/teacher/courseResults'
import StudentSpecificResults from '@/app/teacher/studentResults'
import GradeExamAttempt from '@/app/teacher/gradeAttempt'
import AdminLayout from '@/app/admin/AdminLayout'
import AdminDashboard from '@/app/admin/dashboard'
import UserProfile from '@/app/shared/UserProfile'
import AdminAdminsList from '@/app/admin/users/admins'
import AdminTeachersList from '@/app/admin/users/teachers'
import AdminStudentsList from '@/app/admin/users/students'
import UserCreateForm from '@/app/admin/users/UserCreateForm'
import AdminCoursesList from '@/app/admin/courses'
import AdminEnrollments from '@/app/admin/enrollments'
import AdminEnrollmentDetail from '@/app/admin/enrollmentDetail'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="enrollment/:courseId" element={<StudentEnrollment />} />
            <Route path=":courseId" element={<StudentCourseContent />} />
            <Route path=":courseId/videos/:videoId" element={<StudentVideoPage />} />
            <Route path=":courseId/exams/:examId" element={<StudentExamFlow />} />
            <Route path="attempt/:attemptId" element={<StudentAttemptView />} />
          </Route>
          <Route path="/teacher" element={<TeacherLayout />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="profile" element={<ProfilePage />} />

            <Route path=":courseId" element={<TeacherCourseContent />} />
            <Route path=":courseId/videos" element={<TeacherCourseVideos />} />
            <Route path=":courseId/exams" element={<TeacherCourseExams />} />
            <Route path=":courseId/videos/:videoId" element={<TeacherVideoPage />} />
            <Route path=":courseId/exams/new" element={<CreateExam />} />
            <Route path=":courseId/exams/:examId" element={<TeacherExamView />} />
            <Route path=":courseId/exams/:examId/edit" element={<CreateExam />} />
            <Route path=":courseId/students" element={<CourseStudents />} />
            <Route path="student/:id/profile" element={<UserProfile />} />
            <Route path="student/:id/results" element={<StudentResultsDashboard />} />
            <Route path=":courseId/results" element={<CourseResults />} />
            <Route path=":courseId/student/:studentId" element={<StudentSpecificResults />} />
            <Route path="attempt/:attemptId" element={<GradeExamAttempt />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="admins" element={<AdminAdminsList />} />
            <Route path="admins/new" element={<UserCreateForm role="ADMIN" />} />
            <Route path="teachers" element={<AdminTeachersList />} />
            <Route path="teachers/new" element={<UserCreateForm role="TEACHER" />} />
            <Route path="students" element={<AdminStudentsList />} />
            <Route path="students/new" element={<UserCreateForm role="STUDENT" />} />
            <Route path="user/:id" element={<UserProfile />} />
            <Route path="courses" element={<AdminCoursesList />} />
            <Route path="enrollments" element={<AdminEnrollments />} />
            <Route path="enrollments/:id" element={<AdminEnrollmentDetail />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)


