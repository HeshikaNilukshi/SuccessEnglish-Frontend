import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { fetchCourse } from '@/actions/courses'
import { requestEnrollment } from '@/actions/enrollments'
import { formatPrice } from '@/lib/utils'
import PageShell from '@/components/teacher/PageShell'

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Enrollment' }
]

export default function StudentEnrollment() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId || !token) return
      try {
        setLoading(true)
        const id = parseInt(courseId, 10)
        if (isNaN(id)) {
          throw new Error('Invalid Course ID')
        }
        const data = await fetchCourse(id, token)
        setCourse(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load course details')
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [courseId, token])

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setSubmitError('Please upload an image file (PNG, JPG, or WEBP)')
      return
    }
    setSubmitError(null)
    setReceiptFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !course || !receiptFile) return

    try {
      setSubmitting(true)
      setSubmitError(null)
      await requestEnrollment(token, course.id, receiptFile)
      navigate('/student')
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit enrollment request')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-8 animate-pulse">
        <div className="h-4 w-32 bg-black/5 rounded mb-4" />
        <div className="h-10 w-64 bg-black/5 rounded mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 h-[350px] bg-black/5 rounded-2xl" />
          <div className="lg:col-span-7 h-[350px] bg-black/5 rounded-2xl" />
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
          <h3 className="text-xl font-bold text-text-primary">Course Not Found</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            {error || 'The course you are looking for does not exist or has been removed.'}
          </p>
        </div>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold text-text-primary bg-black/5 border border-border-subtle hover:bg-black/5 transition-all cursor-pointer"
        >
          Return Home
        </Link>
      </div>
    )
  }



  return (
    <PageShell
      title={
        <>
          Course <span className="gradient-text-accent">Enrollment</span>
        </>
      }
      subtitle="Complete your payment and upload your receipt to request enrollment."
      breadcrumbs={breadcrumbs}
    >

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-in-up animate-delay-100">
        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-2xl glass-panel border border-border-subtle p-8 shadow-xl h-full flex flex-col justify-between group">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
            
            <div className="space-y-8">
              <div>
                <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Course Details</h2>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-text-primary tracking-tight">{course.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-black/5 border border-border-subtle px-2.5 py-1 rounded-lg text-text-secondary select-all">
                      ID: #{course.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-black/5" />

              <div>
                <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Student Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                      {user?.name?.charAt(0) ?? 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary leading-none">{user?.name}</p>
                      <p className="text-xs text-text-muted mt-1 leading-none">{user?.email}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] font-mono bg-black/5 border border-border-subtle px-2.5 py-1 rounded-lg text-text-secondary select-all">
                      Student ID: #{user?.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-subtle">
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Amount Need to be Paid</h2>
              <div className="text-4xl font-extrabold text-text-primary tracking-tight">
                {formatPrice(course.price)}
              </div>
              <p className="text-[11px] text-text-muted mt-2">
                Please deposit the exact amount to Success English Academy and upload the receipt image on the right.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-2xl glass-panel border border-border-subtle p-8 shadow-xl h-full flex flex-col group">
            <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-violet/25 to-transparent" />
            
            <div className="flex-grow flex flex-col min-h-0">
              <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Upload Payment Receipt</h2>
              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Please upload a high-quality photo or screenshot of your bank transfer/deposit slip.
              </p>

              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer min-h-[220px] ${
                  dragActive
                    ? 'border-accent-indigo bg-accent-indigo/[0.03]'
                    : 'border-border-subtle hover:border-border-subtle hover:bg-black/5'
                }`}
              >
                <input
                  type="file"
                  id="receipt-file-input"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleInputChange}
                  accept="image/*"
                />

                {receiptPreview ? (
                  <div className="space-y-4 my-auto flex flex-col items-center justify-center h-full w-full">
                    <div className="relative w-full max-w-[320px] flex-grow aspect-[4/3] rounded-xl overflow-hidden border border-border-subtle bg-black/40">
                      <img
                        src={receiptPreview}
                        alt="Receipt Preview"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>
                    <div className="shrink-0">
                      <p className="text-xs text-text-primary font-semibold truncate max-w-[300px] mx-auto">
                        {receiptFile?.name}
                      </p>
                      <p className="text-[10px] text-text-muted mt-1">
                        Click or drag a new image to replace
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 py-4 my-auto">
                    <div className="w-12 h-12 rounded-xl bg-black/5 border border-border-subtle flex items-center justify-center text-xl mx-auto text-text-muted">
                      📄
                    </div>
                    <div className="text-sm font-semibold text-text-secondary">
                      Drag and drop your receipt here, or <span className="text-accent-indigo hover:underline">browse</span>
                    </div>
                    <p className="text-[10px] text-text-muted">
                      Supports JPEG, PNG, or WEBP images
                    </p>
                  </div>
                )}
              </div>
            </div>

            {submitError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-900 font-medium text-xs px-4 py-3 rounded-xl mt-4 shrink-0">
                {submitError}
              </div>
            )}

            <div className="mt-8 shrink-0">
              <button
                type="submit"
                disabled={submitting || !receiptFile}
                className="w-full py-4 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:shadow-none disabled:hover:scale-100 disabled:active:scale-100 transition-all cursor-pointer select-none"
              >
                {submitting ? 'Submitting Enrollment Request...' : 'Enroll Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  )
}
