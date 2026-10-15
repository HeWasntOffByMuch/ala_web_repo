import { useId } from 'react'

interface CheckRowProps {
  label: string
  description?: string
  checked: boolean
  onToggle: () => void
  /** `highlight` marks a chosen row, `strike` greys out and crosses out a done row. */
  checkedStyle: 'highlight' | 'strike'
}

export function CheckRow({ label, description, checked, onToggle, checkedStyle }: CheckRowProps) {
  const id = useId()
  const labelId = `${id}-label`
  const descriptionId = `${id}-description`
  const checkedClasses =
    checkedStyle === 'highlight'
      ? 'has-checked:bg-green-50 dark:has-checked:bg-green-950/50'
      : 'has-checked:text-neutral-400 has-checked:line-through dark:has-checked:text-neutral-500'

  return (
    <li>
      <label
        className={`flex min-h-12 w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors duration-150 select-none active:bg-neutral-100 motion-reduce:transition-none dark:active:bg-neutral-900 ${checkedClasses}`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          aria-labelledby={labelId}
          aria-describedby={description ? descriptionId : undefined}
          className="size-5 shrink-0 accent-green-600"
        />
        <span className="min-w-0 flex-1">
          <span id={labelId} className="block">
            {label}
          </span>
          {description && (
            <span id={descriptionId} className="block truncate text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </span>
          )}
        </span>
      </label>
    </li>
  )
}
