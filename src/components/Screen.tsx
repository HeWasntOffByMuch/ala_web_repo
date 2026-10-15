import type { ReactNode } from 'react'

interface ScreenProps {
  title: string
  status?: ReactNode
  actions: ReactNode
  children: ReactNode
}

export function Screen({ title, status, actions, children }: ScreenProps) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[480px] flex-col bg-white sm:border-x sm:border-neutral-200 dark:bg-neutral-950 sm:dark:border-neutral-800">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <h1 className="text-lg font-semibold">{title}</h1>
          {status != null && <p className="text-sm text-neutral-500 tabular-nums dark:text-neutral-400">{status}</p>}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="sticky bottom-0 z-10 grid grid-cols-2 gap-2 border-t border-neutral-200 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
        {actions}
      </footer>
    </div>
  )
}
