import { createPortal } from 'react-dom'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmText?: string
  isDeleting?: boolean
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Item?',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmText = 'Delete',
  isDeleting = false,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-[#060813]/70 backdrop-blur-md z-50 transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div
          className="relative w-full max-w-md rounded-3xl bg-bg-secondary/95 backdrop-blur-xl border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 md:p-8 animate-popover-in text-center overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
          <div className="absolute top-[-20%] left-[20%] w-[200px] h-[200px] bg-red-500/8 rounded-full blur-[60px] pointer-events-none" />

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-full hover:bg-black/5 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden flex items-center justify-center bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-500/10">
            <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-text-primary mb-1">{title}</h3>
          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 text-sm font-bold text-text-secondary hover:text-text-primary rounded-2xl border border-border-subtle hover:border-border-subtle bg-black/5 hover:bg-black/5 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 text-sm font-bold text-white rounded-2xl bg-red-500/80 hover:bg-red-500 border border-red-500/30 hover:border-red-500/60 transition-all duration-200 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
