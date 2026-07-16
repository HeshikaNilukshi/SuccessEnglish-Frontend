import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { createCourse, updateCourse } from '@/actions/courses'

interface CreateCourseModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
  onSuccess: () => void
  course?: Course | null
}

export function CreateCourseModal({ isOpen, onClose, token, onSuccess, course = null }: CreateCourseModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (course) {
        setName(course.name)
        setDescription(course.description || '')
        setPrice(course.price.toString())
      } else {
        setName('')
        setDescription('')
        setPrice('')
      }
    }
  }, [isOpen, course])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    if (!name.trim()) {
      setError('Course name is required')
      return
    }

    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid price (0 or greater)')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (course) {
        await updateCourse(token, course.id, {
          name,
          description,
          price: priceNum,
        })
      } else {
        await createCourse(token, {
          name,
          description,
          price: priceNum,
        })
      }
      onSuccess()
      // Reset form
      setName('')
      setDescription('')
      setPrice('')
      onClose()
    } catch (err: any) {
      console.error(err)
      setError(err.message || `Failed to ${course ? 'update' : 'create'} course. Please try again.`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (submitting) return
    setError(null)
    onClose()
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
        onClick={handleClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="relative w-full max-w-lg rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
          
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-xl font-bold text-text-primary mb-6">
            {course ? 'Edit Course Details' : 'Create New Course'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-900 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Course Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., General English Masterclass"
                className="w-full px-4 py-3 rounded-xl bg-black/5 border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-text-muted outline-none transition-all"
                disabled={submitting}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the course curriculum and objectives..."
                className="w-full px-4 py-3 rounded-xl bg-black/5 border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-text-muted outline-none transition-all resize-none"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Price (Rs.)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 49.99"
                className="w-full px-4 py-3 rounded-xl bg-black/5 border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-text-muted outline-none transition-all"
                disabled={submitting}
                required
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="flex-grow py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-grow py-3 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Saving...' : course ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  )
}
