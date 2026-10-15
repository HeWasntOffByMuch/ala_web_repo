import type { ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'bg-green-600 text-white active:bg-green-700 dark:bg-green-600 dark:active:bg-green-500',
  secondary:
    'bg-neutral-100 text-neutral-900 active:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:active:bg-neutral-700',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
}

export function Button({ variant = 'secondary', className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`min-h-12 w-full rounded-xl px-3 py-2 text-base leading-tight font-medium disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
