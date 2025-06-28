export interface Exercise {
  nome: string
  series: string
  tipo: 'aerobico' | 'musculacao' | 'flexibilidade' | 'outro'
  carga: number
  descanso: number
  ordem: number
  videoUrl?: string
}
