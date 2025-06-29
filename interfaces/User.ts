export interface User {
  nome: string
  email: string
  password: string
  dataNascimento?: Date
  telefone?: string
  cpf?: string
  sexo?: 'M' | 'F' | 'O'
  profissao?: string
  endereco?: string
  isAdmin?: boolean
  isActive?: boolean
}
