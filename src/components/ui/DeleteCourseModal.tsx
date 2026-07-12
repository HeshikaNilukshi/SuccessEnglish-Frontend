import { useState } from 'react'
import { createPortal } from 'react-dom'
import { deleteCourse } from '@/actions/courses'

interface DeleteCourseModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
  courseId: number
  courseName: string
  onSuccess: () => void
}

export function DeleteCourseModal({ isOpen, onClose, token, courseId, courseName, onSuccess }: DeleteCourseModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleDelete = async () => {
    if (!token || !courseId) return
    setSubmitting(true)
    setError(null)

    try {
      await deleteCourse(token, courseId)
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to delete course. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
        onClick={() => !submitting && onClose()}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="relative w-full max-w-md rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/25 to-transparent" />
          
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl mx-auto text-red-600">
              ⚠️
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-text-primary">Delete Course</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-text-primary">"{courseName}"</span>?
                This action is permanent and will remove all associated content, videos, exams, and student enrollments. This cannot be undone.
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-900 font-medium">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-grow py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="flex-grow py-3 text-sm font-bold text-white rounded-2xl bg-red-600 hover:bg-red-700 hover:shadow-[0_0_20px_rgba(220,38,38,0.25)] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Deleting...' : 'Delete Course'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
