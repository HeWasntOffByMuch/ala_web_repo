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
    expect(screen.getByText(/Wybrano: 2/)).toBeInTheDocument()
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
    await user.click(screen.getByRole('button', { name: 'Dodaj posiłek' }))
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

describe('App: usuwanie produktów z listy', () => {
  it('usuwa produkt z listy i pozwala go przywrócić', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: 'Spaghetti' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))

    await user.click(screen.getByRole('button', { name: 'Usuń Makaron' }))
    expect(screen.queryByRole('checkbox', { name: 'Makaron' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Przywróć usunięte (1)' }))
    expect(screen.getByRole('checkbox', { name: 'Makaron' })).toBeInTheDocument()
  })
})

describe('App: zakończenie misji', () => {
  const finish = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole('checkbox', { name: 'Owsianka z sokiem' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
    for (const name of ['Mleko', 'Płatki owsiane', 'Sok pomarańczowy', 'Woda mineralna']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
  }

  it('odpala sekwencję raz po odhaczeniu ostatniego produktu, bez zmiany stanu listy', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: 'Owsianka z sokiem' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
    for (const name of ['Mleko', 'Płatki owsiane', 'Sok pomarańczowy']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'Woda mineralna' }))
    expect(screen.getByRole('dialog', { name: 'Misja wykonana' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Pomiń/ }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getAllByRole('checkbox', { checked: true }).length).toBeGreaterThanOrEqual(4)

    // powtórka z przycisku nie rusza koszyka
    await user.click(screen.getByRole('button', { name: 'Odtwórz sekwencję' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Pomiń/ }))
    expect(screen.getByRole('checkbox', { name: 'Woda mineralna' })).toBeChecked()
  })

  it('nie odpala sekwencji przy starcie, gdy lista jest już kompletna', () => {
    localStorage.setItem('zakupy.selectedMeals', '["owsianka"]')
    localStorage.setItem('zakupy.inCart', '["mleko","platki-owsiane","sok-pomaranczowy","woda"]')
    render(<App />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('"Powrót do bazy" wraca do posiłków', async () => {
    const user = userEvent.setup()
    render(<App />)
    await finish(user)
    await user.click(screen.getByRole('button', { name: /Powrót do bazy/ }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Posiłki' })).toBeInTheDocument()
  })
})

describe('App: pochwała i wysyłka do żony', () => {
  it('pokazuje pochwałę z imieniem i pozwala wysłać wiadomość', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: 'Owsianka z sokiem' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
    for (const name of ['Mleko', 'Płatki owsiane', 'Sok pomarańczowy', 'Woda mineralna']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/Johnny/)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Wyślij żonie screena' }))
    // jsdom nie ma navigator.share: działa awaryjna ścieżka
    expect(await within(dialog).findByRole('status')).toHaveTextContent(/Udostępnianie nie działa/)
  })
})
