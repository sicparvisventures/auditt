import React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', children, ...props }, ref) => {
    const variants = {
      success: 'bg-success-50 border-success-200 text-success-800',
      warning: 'bg-warning-50 border-warning-200 text-warning-800',
      error: 'bg-accent-50 border-accent-200 text-christmas',
      info: 'bg-primary-50 border-primary-200 text-olive',
    }

    const icons = {
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertCircle,
      info: Info,
    }

    const Icon = icons[variant]

    return (
      <div
        ref={ref}
        className={`flex items-start p-4 border rounded-md ${variants[variant]} ${className || ''}`}
        {...props}
      >
        <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {children}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'
