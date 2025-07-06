export interface IMeal {
  nome: string
  descricao?: string
  horario?: string
  alimentos: string[]
}

export interface IDiet {
  _id?: string
  nome: string
  descricao?: string
  calorias?: number
  proteinas?: number
  carboidratos?: number
  gorduras?: number
  refeicoes: IMeal[]
  criador?: string
  createdAt: Date
  updatedAt: Date
}
