import { useState, useCallback } from 'react'
import { Exercise } from '@/interfaces/Exercise'
import { exerciseService } from '@/services/exerciseService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'
import { extractList } from '@/utils/apiUtils'

interface UseExercisesReturn {
  exercises: Exercise[]
  trainingExercises: Exercise[]
  loading: boolean
  fetchExercises: () => Promise<void>
  fetchTrainingExercises: (trainingId: number) => Promise<void>
  setTrainingExercises: (exercises: Exercise[]) => void
  createExercise: (data: Partial<Exercise>) => Promise<Exercise | null>
  updateExercise: (
    exerciseId: number,
    data: Partial<Exercise>,
  ) => Promise<boolean>
  deleteExercise: (exerciseId: number) => Promise<boolean>
  addExerciseToTraining: (
    trainingId: number,
    exerciseId: number,
  ) => Promise<boolean>
  removeExerciseFromTraining: (
    trainingId: number,
    exerciseId: number,
  ) => Promise<boolean>
}

export const useExercises = (): UseExercisesReturn => {
  const { executeWithAuth } = useApi()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [trainingExercises, setTrainingExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(false)

  const fetchExercises = useCallback(async () => {
    setLoading(true)
    try {
      const result = await executeWithAuth(
        (token) => exerciseService.fetchExercises(token),
        { errorMessage: 'Falha ao carregar exercicios' },
      )
      if (result) setExercises(extractList<Exercise>(result))
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const fetchTrainingExercises = useCallback(
    async (trainingId: number) => {
      setLoading(true)
      try {
        const result = await executeWithAuth(
          (token) => exerciseService.fetchTrainingExercises(trainingId, token),
          // showErrorAlert: false pois GET /trainings/{id}/exercises pode não existir
          { showErrorAlert: false },
        )
        if (result) setTrainingExercises(extractList<Exercise>(result))
      } finally {
        setLoading(false)
      }
    },
    [executeWithAuth],
  )

  const createExercise = useCallback(
    async (data: Partial<Exercise>): Promise<Exercise | null> => {
      const result = await executeWithAuth(
        (token) => exerciseService.createExercise(data, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Exercicio criado',
          errorMessage: 'Falha ao criar exercicio',
        },
      )
      if (result) {
        await fetchExercises()
        return result
      }
      return null
    },
    [executeWithAuth, fetchExercises],
  )

  const updateExercise = useCallback(
    async (exerciseId: number, data: Partial<Exercise>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => exerciseService.updateExercise(exerciseId, data, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Exercicio atualizado',
          errorMessage: 'Falha ao atualizar exercicio',
        },
      )
      if (result) {
        await fetchExercises()
        return true
      }
      return false
    },
    [executeWithAuth, fetchExercises],
  )

  const deleteExercise = useCallback(
    async (exerciseId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => exerciseService.deleteExercise(exerciseId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Exercicio removido',
          errorMessage: 'Falha ao remover exercicio',
        },
      )
      if (result) {
        await fetchExercises()
        return true
      }
      return false
    },
    [executeWithAuth, fetchExercises],
  )

  const addExerciseToTraining = useCallback(
    async (trainingId: number, exerciseId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) =>
          exerciseService.addExerciseToTraining(trainingId, exerciseId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Exercicio adicionado ao treino',
          errorMessage: 'Falha ao adicionar exercicio',
        },
      )
      return result !== null
    },
    [executeWithAuth],
  )

  const removeExerciseFromTraining = useCallback(
    async (trainingId: number, exerciseId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) =>
          exerciseService.removeExerciseFromTraining(
            trainingId,
            exerciseId,
            token,
          ),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Exercicio removido do treino',
          errorMessage: 'Falha ao remover exercicio',
        },
      )
      return result !== null
    },
    [executeWithAuth],
  )

  return {
    exercises,
    trainingExercises,
    loading,
    fetchExercises,
    fetchTrainingExercises,
    setTrainingExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    addExerciseToTraining,
    removeExerciseFromTraining,
  }
}
