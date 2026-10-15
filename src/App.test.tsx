import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import App from './App'
import type { Data } from './types'

const data: Data = {
  categories: ['Warzywa', 'Suche'],
  products: [
    { id: 'makaron', name: 'Makaron', category: 'Suche' },
    { id: 'ryz', name: 'Ryż', category: 'Suche' },
    { id: 'pomidory', name: 'Pomidory', category: 'Warzywa' },
    { id: 'cebula', name: 'Cebula', category: 'Warzywa' },
    { id: 'czosnek', name: 'Czosnek', category: 'Warzywa' },
  ],
  meals: [
    { id: 'spaghetti', name: 'Spaghetti', products: ['makaron', 'pomidory', 'czosnek'] },
    { id: 'risotto', name: 'Risotto', products: ['ryz', 'cebula', 'czosnek'] },
    { id: 'salatka', name: 'Sałatka', products: ['pomidory', 'cebula'] },
  ],
}

it('builds a deduplicated list and keeps in-cart products across screen changes', async () => {
  const user = userEvent.setup()
  render(<App data={data} />)

  expect(screen.getByRole('button', { name: 'Lista zakupów' })).toBeDisabled()
  await user.click(screen.getByText('Spaghetti'))
  await user.click(screen.getByText('Risotto'))
  expect(screen.getByText('Wybrano: 2')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
  expect(screen.getByRole('heading', { name: 'Lista zakupów' })).toBeInTheDocument()
  expect(screen.getAllByRole('checkbox', { name: 'Czosnek' })).toHaveLength(1)
  expect(screen.getAllByRole('checkbox')).toHaveLength(5)

  await user.click(screen.getByText('Czosnek'))
  expect(screen.getByRole('checkbox', { name: 'Czosnek' })).toBeChecked()

  await user.click(screen.getByRole('button', { name: 'Wróć do posiłków' }))
  expect(screen.getByRole('checkbox', { name: 'Spaghetti' })).toBeChecked()
  expect(screen.getByRole('checkbox', { name: 'Risotto' })).toBeChecked()

  await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
  expect(screen.getByRole('checkbox', { name: 'Czosnek' })).toBeChecked()
  expect(screen.getByRole('checkbox', { name: 'Cebula' })).not.toBeChecked()
})
