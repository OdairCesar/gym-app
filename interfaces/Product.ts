export interface Product {
  id: number
  name: string
  description: string
  price: number | string // API retorna string ("39.90"), usar Number(price) ao exibir
  stock: number
  image_link?: string | null
  category: string
  code: string
  published: boolean
  createdAt: string
  updatedAt: string
}
