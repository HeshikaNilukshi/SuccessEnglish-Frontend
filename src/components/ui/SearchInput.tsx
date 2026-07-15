import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <style>{`
        input[type="text"].search-input-glass {
          background-color: rgba(255, 255, 255, 0.55) !important;
        }
      `}</style>
      <input
        type="text"
        className={cn("auth-input search-input-glass pl-10", className)}
        {...props}
      />
      <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none">
        <Search className="h-4 w-4 text-text-muted" />
      </div>
    </div>
  )
}
