export interface Exercise {
  id: number
  name: string
  reps: string // ex: "3x12"
  type: 'aerobico' | 'musculacao' | 'flexibilidade' | 'outro'
  weight?: number
  rest_seconds?: number
  video_link?: string
  priority?: number
  createdAt: string
  updatedAt: string
}
