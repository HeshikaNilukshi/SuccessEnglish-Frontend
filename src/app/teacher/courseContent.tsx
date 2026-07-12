import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse, fetchVideosByCourse, fetchExamsByCourse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/EmptyState'
import { AddVideoModal } from '@/components/ui/AddVideoModal'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export default function TeacherCourseContent() {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()

  const [course, setCourse] = useState<Course | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'videos' | 'exams'>('videos')

  // Add Video states
  // Add Video states
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false)

  useEffect(() => {
    const loadContent = async () => {
      if (!courseId || !token) return
      try {
        setLoading(true)
        setError(null)
        const id = parseInt(courseId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid Course ID')
        }

        const [courseData, videosData, examsData] = await Promise.all([
          fetchCourse(id, token),
          fetchVideosByCourse(token, id),
          fetchExamsByCourse(token, id)
        ])

        setCourse(courseData)
        setVideos(videosData)
        setExams(examsData)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load course content.')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [courseId, token])



  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8">
        <header className="mb-6">
          <div className="h-4 w-32 bg-black/5 rounded mb-4 animate-pulse" />
          <div className="h-10 w-80 bg-black/5 rounded mb-3 animate-pulse" />
          <div className="h-4 w-60 bg-black/5 rounded mb-10 animate-pulse" />
        </header>
        <div className="h-12 w-80 bg-black/5 rounded-xl mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-black/5 rounded-xl border border-border-subtle p-5 flex flex-col justify-between animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto text-center p-12 mt-16 rounded-2xl glass-panel border-border-subtle shadow-xl space-y-6">
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-3xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-text-primary">Error</h3>
          <p className="text-text-secondary text-sm leading-relaxed">{error || 'Course content unavailable.'}</p>
        </div>
        <Link
          to="/teacher"
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const breadcrumbs = [
    { label: 'Home', href: '/teacher' },
    { label: course.name }
  ]

  const headerActions = (
    <TooltipProvider>
      <div className="flex flex-wrap gap-3">
        <Tooltip>
          <TooltipTrigger>
            <Link
              to={`/teacher/${course.id}/students`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all block cursor-pointer"
            >
              👥 View Students
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-bg-secondary text-text-primary border border-border-subtle">
            View student enrollments and details
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <Link
              to={`/teacher/${course.id}/results`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all block cursor-pointer"
            >
              📊 Exam Results
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-bg-secondary text-text-primary border border-border-subtle">
            View student test submissions
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )

  return (
    <PageShell
      title={course.name}
      subtitle={course.description || "Course details and curriculum management."}
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'videos' | 'exams')} className="w-full flex-grow flex flex-col">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <TabsList className="bg-bg-secondary/80 border border-border-subtle p-1 rounded-xl h-auto">
            <TabsTrigger
              value="videos"
              className="py-2 px-4 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer data-active:bg-gradient-to-r data-active:from-accent-indigo data-active:to-accent-violet data-active:text-white data-active:shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            >
              🎥 Videos <Badge className="ml-1.5 bg-black/10 text-text-primary border-none select-none">{videos.length}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="exams"
              className="py-2 px-4 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer data-active:bg-gradient-to-r data-active:from-accent-indigo data-active:to-accent-violet data-active:text-white data-active:shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            >
              📝 Exams <Badge className="ml-1.5 bg-black/10 text-text-primary border-none select-none">{exams.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <div>
            {activeTab === 'videos' ? (
              <button
                type="button"
                onClick={() => setIsAddVideoOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:border-border-subtle active:scale-[0.98] transition-all cursor-pointer"
              >
                + Add Video
              </button>
            ) : (
              <Link
                to={`/teacher/${course.id}/exams/new`}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-violet to-accent-pink hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all"
              >
                + Add Exam
              </Link>
            )}
          </div>
        </div>

        <TabsContent value="videos" className="outline-none flex-grow">
          {videos.length === 0 ? (
            <EmptyState
              icon="🎬"
              title="No Videos Uploaded"
              description="Add a lecture video to this course using the action buttons above."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Link
                  key={video.id}
                  to={`/teacher/${course.id}/videos/${video.id}`}
                  className="group relative flex flex-col justify-between rounded-2xl glass-panel glass-panel-hover p-6 min-h-[140px] text-left cursor-pointer"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-indigo to-accent-violet rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-black/5 border border-border-subtle flex items-center justify-center text-lg group-hover:bg-accent-indigo/10 group-hover:border-accent-indigo/30 transition-all duration-300">
                        🎥
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono text-text-muted border-border-subtle px-1.5 py-0.5">
                        ID: #{video.id}
                      </Badge>
                    </div>
                    
                    <h3 className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent-indigo transition-colors duration-300 line-clamp-1">
                      {video.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                    <span>Uploaded {new Date(video.createdAt).toLocaleDateString()}</span>
                    <div
                      className="text-accent-indigo font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5"
                    >
                      Watch Video &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="exams" className="outline-none flex-grow">
          {exams.length === 0 ? (
            <EmptyState
              icon="✍️"
              title="No Exams Created"
              description="Create a course assessment using the Add Exam button above."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/teacher/${course.id}/exams/${exam.id}`}
                  className="group relative flex flex-col justify-between rounded-2xl glass-panel glass-panel-hover p-6 min-h-[140px] text-left cursor-pointer"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-violet to-accent-pink rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-black/5 border border-border-subtle flex items-center justify-center text-lg group-hover:bg-accent-violet/10 group-hover:border-accent-violet/30 transition-all duration-300">
                        📝
                      </div>
                      <Badge variant="outline" className="text-[10px] font-mono text-text-muted border-border-subtle px-1.5 py-0.5">
                        {exam.duration > 0 ? `${exam.duration} mins` : 'Untimed'}
                      </Badge>
                    </div>
                    
                    <h3 className="text-base font-bold text-text-primary tracking-tight group-hover:text-accent-violet transition-colors duration-300 line-clamp-1">
                      {exam.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
                    <span>Questions: {exam._count?.questions ?? 0}</span>
                    <div
                      className="text-accent-violet font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5"
                    >
                      View Exam &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Video Modal */}
      {/* Add Video Modal */}
      <AddVideoModal
        isOpen={isAddVideoOpen}
        onClose={() => setIsAddVideoOpen(false)}
        courseId={courseId!}
        token={token!}
        onSuccess={(newVideo) => setVideos((prev) => [newVideo, ...prev])}
      />
    </PageShell>
  )
}
