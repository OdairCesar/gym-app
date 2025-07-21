import { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type TrainingStatus =
  | 'not_started'
  | 'in_progress'
  | 'paused'
  | 'completed'

interface TrainingState {
  status: TrainingStatus
  startTime?: number
  pauseTime?: number
  totalPausedTime: number
}

const TRAINING_STATE_PREFIX = '@training_state_'

export function useTrainingState(trainingId?: string) {
  const [trainingState, setTrainingState] = useState<TrainingState>({
    status: 'not_started',
    totalPausedTime: 0,
  })

  const storageKey = `${TRAINING_STATE_PREFIX}${trainingId}`

  // Carrega o estado do treino do AsyncStorage
  const loadTrainingState = useCallback(async () => {
    if (!trainingId) return

    try {
      const savedState = await AsyncStorage.getItem(storageKey)
      if (savedState) {
        const state: TrainingState = JSON.parse(savedState)
        setTrainingState(state)
      }
    } catch (error) {
      console.error('Erro ao carregar estado do treino:', error)
    }
  }, [trainingId, storageKey])

  // Salva o estado do treino no AsyncStorage
  const saveTrainingState = useCallback(
    async (state: TrainingState) => {
      if (!trainingId) return

      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(state))
        setTrainingState(state)
      } catch (error) {
        console.error('Erro ao salvar estado do treino:', error)
      }
    },
    [trainingId, storageKey],
  )

  // Inicia o treino
  const startTraining = useCallback(async () => {
    const now = Date.now()
    const newState: TrainingState = {
      status: 'in_progress',
      startTime: now,
      totalPausedTime: 0,
    }
    await saveTrainingState(newState)
  }, [saveTrainingState])

  // Pausa o treino
  const pauseTraining = useCallback(async () => {
    if (trainingState.status !== 'in_progress') return

    const now = Date.now()
    const newState: TrainingState = {
      ...trainingState,
      status: 'paused',
      pauseTime: now,
    }
    await saveTrainingState(newState)
  }, [trainingState, saveTrainingState])

  // Retoma o treino
  const resumeTraining = useCallback(async () => {
    if (trainingState.status !== 'paused' || !trainingState.pauseTime) return

    const now = Date.now()
    const pauseDuration = now - trainingState.pauseTime
    const newState: TrainingState = {
      ...trainingState,
      status: 'in_progress',
      pauseTime: undefined,
      totalPausedTime: trainingState.totalPausedTime + pauseDuration,
    }
    await saveTrainingState(newState)
  }, [trainingState, saveTrainingState])

  // Finaliza o treino
  const completeTraining = useCallback(async () => {
    const newState: TrainingState = {
      ...trainingState,
      status: 'completed',
      pauseTime: undefined,
    }
    await saveTrainingState(newState)
  }, [trainingState, saveTrainingState])

  // Reseta o treino
  const resetTraining = useCallback(async () => {
    if (!trainingId) return

    try {
      await AsyncStorage.removeItem(storageKey)
      setTrainingState({
        status: 'not_started',
        totalPausedTime: 0,
      })
    } catch (error) {
      console.error('Erro ao resetar treino:', error)
    }
  }, [trainingId, storageKey])

  // Calcula o tempo decorrido do treino
  const getElapsedTime = useCallback((): number => {
    if (!trainingState.startTime) return 0

    const now = Date.now()
    let totalTime = 0

    if (trainingState.status === 'paused' && trainingState.pauseTime) {
      // Se está pausado, calcula até o momento da pausa
      totalTime = trainingState.pauseTime - trainingState.startTime
    } else if (trainingState.status === 'in_progress') {
      // Se está em andamento, calcula até agora
      totalTime = now - trainingState.startTime
    } else if (trainingState.status === 'completed') {
      // Se completado, usa o tempo até a finalização (sem pausas)
      totalTime = now - trainingState.startTime
    }

    // Subtrai o tempo total de pausa
    return Math.max(
      0,
      Math.floor((totalTime - trainingState.totalPausedTime) / 1000),
    )
  }, [trainingState])

  useEffect(() => {
    loadTrainingState()
  }, [loadTrainingState])

  return {
    trainingState,
    startTraining,
    pauseTraining,
    resumeTraining,
    completeTraining,
    resetTraining,
    getElapsedTime,
    isNotStarted: trainingState.status === 'not_started',
    isInProgress: trainingState.status === 'in_progress',
    isPaused: trainingState.status === 'paused',
    isCompleted: trainingState.status === 'completed',
  }
}
