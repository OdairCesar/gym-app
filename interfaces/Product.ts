export interface Product {
  _id: string
  nome: string
  descricao: string
  preco: number
  categoria: string
  estoque: number
  imagem?: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}
