import { Exercise } from './Exercise'

export interface Training {
  _id: string
  nome: string
  user: string
  treinador: string
  exercicios: Exercise[]
  createdAt: string
  updatedAt: string
}
