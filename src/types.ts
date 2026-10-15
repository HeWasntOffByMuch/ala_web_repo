export interface Product {
  id: string
  name: string
  category: string
}

export interface Meal {
  id: string
  name: string
  products: string[]
}

export interface Data {
  categories: string[]
  products: Product[]
  meals: Meal[]
}
