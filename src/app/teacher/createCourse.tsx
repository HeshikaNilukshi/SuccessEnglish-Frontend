import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { createCourse } from '@/actions/courses'
import PageShell from '@/components/teacher/PageShell'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

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

  const breadcrumbs = [
    { label: 'Home', href: '/teacher' },
    { label: 'Create Course' }
  ]

  return (
    <PageShell
      title="Create New Course"
      subtitle="Fill in the details to publish a new course."
      breadcrumbs={breadcrumbs}
    >
      <div className="w-full max-w-2xl mx-auto">
        <Card className="glass-panel border-border-subtle relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-text-primary">Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-900 font-medium">
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
                  className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-white/20 outline-none transition-all"
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
                  className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-white/20 outline-none transition-all resize-none"
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
                  className="w-full px-4 py-3 rounded-xl bg-bg-secondary border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-white/20 outline-none transition-all"
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
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
