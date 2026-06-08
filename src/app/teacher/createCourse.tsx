import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { createCourse } from '@/actions/courses'

export default function CreateCourse() {
  const { token } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      await createCourse(token, {
        name,
        description,
        price: priceNum,
      })
      navigate('/teacher')
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Failed to create course. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 pt-16 pb-16">
      <header className="mb-10 border-b border-white/[0.04] pb-6">
        <Link
          to="/teacher"
          className="text-xs text-text-muted hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 mb-4 group cursor-pointer"
        >
          &larr; Back to Panel
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Create New Course
        </h1>
        <p className="text-text-secondary text-sm">
          Fill in the details to publish a new course.
        </p>
      </header>

      <main className="glass-panel p-8 rounded-2xl border border-white/[0.04] relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Course Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., General English Masterclass"
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-white/5 focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-white placeholder-white/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the course curriculum and objectives..."
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-white/5 focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-white placeholder-white/20 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Price (USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 49.99"
              className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-white/5 focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-white placeholder-white/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      </main>
    </div>
  )
}
