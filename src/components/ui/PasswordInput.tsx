import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-text-muted hover:text-text-primary focus:outline-none focus-visible:ring-1 focus-visible:ring-accent-indigo rounded-r-xl transition-colors cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
  )
}