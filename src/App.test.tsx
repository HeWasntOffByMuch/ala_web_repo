import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('wspólne produkty raz, odhaczenie przetrwa powrót do posiłków', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('button', { name: 'Lista zakupów' })).toBeDisabled()

    // Spaghetti i Makaron z tuńczykiem mają wspólne: makaron, czosnek, cebula
    await user.click(screen.getByRole('checkbox', { name: 'Spaghetti' }))
    await user.click(screen.getByRole('checkbox', { name: 'Makaron z tuńczykiem' }))
    expect(screen.getByText('Wybrano: 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))

    expect(screen.getAllByRole('checkbox', { name: 'Makaron' })).toHaveLength(1)
    expect(screen.getAllByRole('checkbox', { name: 'Cebula' })).toHaveLength(1)

    await user.click(screen.getByRole('checkbox', { name: 'Makaron' }))
    expect(screen.getByRole('checkbox', { name: 'Makaron' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Wróć do posiłków' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))

    const makaron = screen.getByRole('checkbox', { name: 'Makaron' })
    expect(makaron).toBeChecked()
    // odhaczony na końcu sekcji "Suche" (jedyny w sekcji, więc sprawdzamy sekcję)
    expect(within(makaron.closest('section')!).getByText('Suche')).toBeInTheDocument()
  })
})

describe('App: wyszukiwanie i dodawanie posiłków', () => {
  it('filtruje listę posiłków', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('searchbox', { name: 'Szukaj posiłku' }), 'losos')
    expect(screen.getByRole('checkbox', { name: 'Łosoś z ziemniakami' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Spaghetti' })).not.toBeInTheDocument()
  })

  it('dodaje własny posiłek z nowym produktem i trafia on na listę zakupów', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: '+ Nowy' }))
    await user.type(screen.getByPlaceholderText('np. Zupa pomidorowa'), 'Sałatka grecka')
    await user.type(screen.getByPlaceholderText('Szukaj produktu lub wpisz nowy'), 'feta')
    await user.click(screen.getByRole('button', { name: 'Dodaj „feta”' }))
    await user.type(screen.getByPlaceholderText('Szukaj produktu lub wpisz nowy'), 'ogórek')
    await user.click(screen.getByRole('checkbox', { name: /Ogórek/ }))
    await user.click(screen.getByRole('button', { name: 'Zapisz posiłek' }))

    await user.click(screen.getByRole('checkbox', { name: 'Sałatka grecka' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
    expect(screen.getByRole('checkbox', { name: 'feta' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Ogórek' })).toBeInTheDocument()
  })
})
