import { useState, useEffect } from 'react'
import Hero from '@/components/Hero'
import CourseGrid from '@/components/CourseGrid'
import AboutUs from '@/components/AboutUs'
import ContactUs from '@/components/ContactUs'
import { fetchCourses, fetchMyEnrollments } from '@/actions/courses'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const { token, user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCourses = async () => {
    setLoading(true)
    setError(null)
    try {
      const data: Course[] = await fetchCourses()
      setCourses(data)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to connect to the LMS courses database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    const loadEnrollments = async () => {
      if (!token || user?.role !== 'STUDENT') {
        setEnrolledCourseIds([])
        return
      }
      try {
        const enrollments = await fetchMyEnrollments(token)
        const ids = enrollments.map(e => e.courseId)
        setEnrolledCourseIds(ids)
      } catch (err) {
        console.error('Failed to load user enrollments on home page:', err)
      }
    }
    loadEnrollments()
  }, [token, user])

  return (
    <div className="relative">
      <div className="absolute top-[800px] left-[-15%] w-[600px] h-[600px] bg-accent-pink/5 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="absolute top-[1400px] right-[-15%] w-[500px] h-[500px] bg-accent-indigo/6 rounded-full blur-[160px] pointer-events-none z-0" />

      <Hero />
      <CourseGrid
        courses={courses}
        loading={loading}
        error={error}
        onRetry={loadCourses}
        enrolledCourseIds={enrolledCourseIds}
      />
      <AboutUs />
      <ContactUs />
    </div>
  )
}
