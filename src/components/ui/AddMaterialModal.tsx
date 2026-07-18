import { useState } from 'react'
import { createPortal } from 'react-dom'
import { fetchUploadSignature } from '@/actions/courses'
import { saveMaterialDetails } from '@/actions/materials'

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  token: string;
  onSuccess: (material: any) => void;
}

export function AddMaterialModal({ isOpen, onClose, videoId, token, onSuccess }: AddMaterialModalProps) {
  const [newMaterialName, setNewMaterialName] = useState('')
  const [newMaterialFile, setNewMaterialFile] = useState<File | null>(null)
  const [isSavingMaterial, setIsSavingMaterial] = useState(false)
  const [addMaterialProgress, setAddMaterialProgress] = useState<string | null>(null)
  const [addMaterialError, setAddMaterialError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAddMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !videoId) return

    if (!newMaterialName.trim()) {
      setAddMaterialError('Name is required')
      return
    }

    if (!newMaterialFile) {
      setAddMaterialError('Please select a file')
      return
    }

    setIsSavingMaterial(true)
    setAddMaterialError(null)
    setAddMaterialProgress('Requesting upload signature...')

    try {
      const signatureData = await fetchUploadSignature(token)

      setAddMaterialProgress('Uploading file to cloud...')
      const formData = new FormData()
      formData.append('file', newMaterialFile)
      formData.append('api_key', signatureData.api_key)
      formData.append('timestamp', signatureData.timestamp.toString())
      formData.append('signature', signatureData.signature)
      formData.append('folder', signatureData.folder)

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!cloudRes.ok) {
        throw new Error('Cloudinary upload failed')
      }

      const cloudData = await cloudRes.json()

      setAddMaterialProgress('Saving material details...')
      const newMaterial = await saveMaterialDetails(token, {
        videoId: parseInt(videoId, 10),
        name: newMaterialName,
        url: cloudData.secure_url,
        publicId: cloudData.public_id,
      })

      onSuccess(newMaterial)
      setNewMaterialName('')
      setNewMaterialFile(null)
      onClose()
    } catch (err: any) {
      console.error(err)
      setAddMaterialError(err.message || 'An error occurred during upload.')
    } finally {
      setIsSavingMaterial(false)
      setAddMaterialProgress(null)
    }
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
        onClick={() => !isSavingMaterial && onClose()}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="relative w-full max-w-lg rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-indigo/25 to-transparent" />
          
          <button
            type="button"
            onClick={() => onClose()}
            disabled={isSavingMaterial}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-xl font-bold text-text-primary mb-6">Upload Lecture Material</h3>

          <form onSubmit={handleAddMaterialSubmit} className="space-y-6">
            {addMaterialError && (
              <div className="p-4 rounded-xl bg-red-500/12 border border-red-500/25 text-xs text-red-900 font-medium">
                {addMaterialError}
              </div>
            )}

            {addMaterialProgress && (
              <div className="p-4 rounded-xl bg-accent-indigo/5 border border-accent-indigo/10 text-xs text-accent-indigo animate-pulse">
                {addMaterialProgress}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                Material Name
              </label>
              <input
                type="text"
                value={newMaterialName}
                onChange={(e) => setNewMaterialName(e.target.value)}
                placeholder="e.g., Chapter 1 Notes (PDF)"
                className="w-full px-4 py-3 rounded-xl bg-black/5 border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary placeholder-text-muted outline-none transition-all"
                disabled={isSavingMaterial}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                File Document
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    setNewMaterialFile(e.dataTransfer.files[0])
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setNewMaterialFile(e.target.files[0])
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-black/5 border border-border-subtle focus:border-accent-indigo focus:ring-1 focus:ring-accent-indigo text-sm text-text-primary outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-black/5 file:text-text-primary hover:file:bg-black/5"
                disabled={isSavingMaterial}
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => onClose()}
                disabled={isSavingMaterial}
                className="flex-grow py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingMaterial}
                className="flex-grow py-3 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-accent-indigo to-accent-violet hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSavingMaterial ? 'Uploading...' : 'Upload Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  )
}
