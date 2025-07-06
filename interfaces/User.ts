export interface User {
  _id?: string
  nome: string
  email: string
  password: string
  dataNascimento?: Date
  telefone?: string
  cpf?: string
  sexo?: 'M' | 'F' | 'O'
  profissao?: string
  endereco?: string
  diet_id?: string
  isAdmin?: boolean
  isPersonal?: boolean
  isActive?: boolean
}
