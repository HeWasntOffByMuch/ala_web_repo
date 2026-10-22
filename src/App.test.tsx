import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('wspólne produkty raz, odhaczenie przetrwa powrót do posiłków', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('button', { name: 'Lista zakupów' })).toBeDisabled()

    // oba makarony mają wspólne: makaron, pomidory
    await user.click(screen.getByRole('checkbox', { name: 'Makaron z łososiem' }))
    await user.click(screen.getByRole('checkbox', { name: 'Makaron z burratą' }))
    expect(screen.getByText(/Wybrano: 2/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))

    expect(screen.getAllByRole('checkbox', { name: 'Makaron' })).toHaveLength(1)
    expect(screen.getAllByRole('checkbox', { name: 'Pomidory' })).toHaveLength(1)

    await user.click(screen.getByRole('checkbox', { name: 'Makaron' }))
    expect(screen.getByRole('checkbox', { name: 'Makaron' })).toBeChecked()

    await user.click(screen.getByRole('button', { name: 'Wróć do posiłków' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))

    const makaron = screen.getByRole('checkbox', { name: 'Makaron' })
    expect(makaron).toBeChecked()
    expect(within(makaron.closest('section')!).getByText('Suche')).toBeInTheDocument()
  })
})

describe('App: wyszukiwanie i dodawanie posiłków', () => {
  it('filtruje listę posiłków', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('searchbox', { name: 'Szukaj posiłku' }), 'losos')
    expect(screen.getByRole('checkbox', { name: 'Makaron z łososiem' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox', { name: 'Korytko' })).not.toBeInTheDocument()
  })

  it('dodaje własny posiłek z nowym produktem i trafia on na listę zakupów', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Dodaj posiłek' }))
    await user.type(screen.getByPlaceholderText('np. Zupa pomidorowa'), 'Sałatka grecka')
    await user.type(screen.getByPlaceholderText('Szukaj produktu lub wpisz nowy'), 'oliwki')
    await user.click(screen.getByRole('button', { name: 'Dodaj „oliwki”' }))
    await user.type(screen.getByPlaceholderText('Szukaj produktu lub wpisz nowy'), 'ogórki')
    await user.click(screen.getByRole('checkbox', { name: /Ogórki/ }))
    await user.click(screen.getByRole('button', { name: 'Zapisz posiłek' }))

    await user.click(screen.getByRole('checkbox', { name: 'Sałatka grecka' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
    expect(screen.getByRole('checkbox', { name: 'oliwki' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Ogórki' })).toBeInTheDocument()
  })
})

describe('App: usuwanie produktów z listy', () => {
  it('usuwa produkt z listy i pozwala go przywrócić', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: 'Makaron z łososiem' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))

    await user.click(screen.getByRole('button', { name: 'Usuń Makaron' }))
    expect(screen.queryByRole('checkbox', { name: 'Makaron' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Przywróć usunięte (1)' }))
    expect(screen.getByRole('checkbox', { name: 'Makaron' })).toBeInTheDocument()
  })
})

describe('App: zakończenie misji', () => {
  const finish = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole('checkbox', { name: 'Tygodniowy mix owoców' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
    for (const name of ['Banany', 'Jabłka']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
  }

  it('odpala sekwencję raz po odhaczeniu ostatniego produktu, lista zostaje bez przycisków sekwencji', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: 'Tygodniowy mix owoców' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
    for (const name of ['Banany']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: 'Jabłka' }))
    expect(screen.getByRole('dialog', { name: 'Misja wykonana' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Pomiń/ }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getAllByRole('checkbox', { checked: true }).length).toBeGreaterThanOrEqual(2)
    expect(screen.getByRole('checkbox', { name: 'Jabłka' })).toBeChecked()
    expect(screen.queryByRole('button', { name: 'Odtwórz sekwencję' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Wyślij żonie screena' })).not.toBeInTheDocument()
  })

  it('nie odpala sekwencji przy starcie, gdy lista jest już kompletna', () => {
    localStorage.setItem('zakupy.selectedMeals', '["tygodniowy-mix-owocow"]')
    localStorage.setItem('zakupy.inCart', '["banany","jablka"]')
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
    await user.click(screen.getByRole('checkbox', { name: 'Tygodniowy mix owoców' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
    for (const name of ['Banany', 'Jabłka']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/Johnny/)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Wyślij żonie screena' }))
    // jsdom nie ma navigator.share: działa awaryjna ścieżka
    expect(await within(dialog).findByRole('status')).toHaveTextContent(/Udostępnianie nie działa/)
  })
})

describe('App: alternatywny ekran sukcesu (kantyna)', () => {
  it('pokazuje kantynę po hiperprzestrzeni, z postacią, pochwałą i wysyłką', async () => {
    localStorage.setItem('zakupy.lastSuccess', 'hyperspace')
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('checkbox', { name: 'Tygodniowy mix owoców' }))
    await user.click(screen.getByRole('button', { name: 'Lista zakupów' }))
    for (const name of ['Banany', 'Jabłka']) {
      await user.click(screen.getByRole('checkbox', { name }))
    }
    const dialog = screen.getByRole('dialog', { name: 'Na zdrowie, Johnny' })
    expect(dialog.querySelectorAll('.cn-figure img')).toHaveLength(6)
    expect(dialog.querySelectorAll('.cn-figure img.active')).toHaveLength(1)
    expect(within(dialog).getByText(/Johnny/, { selector: '.cn-praise' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Wyślij żonie screena' })).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /Powrót do bazy/ }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Posiłki' })).toBeInTheDocument()
  })
})
