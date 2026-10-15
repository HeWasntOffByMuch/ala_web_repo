# Zakupy

Statyczna PWA: zaznaczasz posiłki → dostajesz listę produktów pogrupowaną w kategorie sklepowe → odhaczasz w trakcie zakupów.

## Komendy

```sh
npm install
npm run dev      # serwer deweloperski
npm test         # testy (Vitest)
npm run build    # typecheck + build do dist/
npm run preview  # podgląd buildu (z service workerem)
```

## Edycja przepisów

Wszystkie dane są w `src/data.json` — zmiana = commit do repo.

- `categories` — kolejność = kolejność sekcji na liście zakupów.
- `products` — `{ id, name, category }`; `category` musi być z `categories`.
- `meals` — `{ id, name, products }`; `products` to lista `id` produktów.

`npm test` (`src/data.test.ts`) sprawdza spójność danych.

## Struktura

```
src/
  data.json                 przepisy, produkty, kategorie
  types.ts                  typy danych
  App.tsx                   stan (wybrane posiłki, koszyk) + przełączanie ekranów
  lib/
    buildShoppingList.ts    czysta funkcja: posiłki → sekcje listy zakupów
    storage.ts              odczyt/zapis localStorage (zakupy.selectedMeals, zakupy.inCart)
  components/
    MealsScreen.tsx         ekran „Posiłki”
    ShoppingListScreen.tsx  ekran „Lista zakupów”
    Screen.tsx              layout: sticky nagłówek + sticky pasek akcji
    CheckRow.tsx            wiersz z checkboxem (tap na całym wierszu)
    Button.tsx
public/                     ikony PWA (icon.svg → PNG 192/512/180)
.github/workflows/deploy.yml
```

## Deploy

GitHub Actions buduje i publikuje na GitHub Pages przy każdym pushu do `main`
(PR-y tylko testy + build). Jednorazowo: **Settings → Pages → Source: GitHub Actions**.

`base` w `vite.config.ts` = `/ala_web_repo/` — zmień przy zmianie nazwy repo.
