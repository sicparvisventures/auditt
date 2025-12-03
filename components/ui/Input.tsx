import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="form-label">
            {label}
          </label>
        )}
        <input
          type={type}
          className={`form-input ${error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : ''} ${className || ''}`}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="form-error">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
