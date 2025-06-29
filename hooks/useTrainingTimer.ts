import { useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'

import { TIMER_KEY, TIMER_KEY_FINAL } from '@/constants/storageKeys'

const getNow = () => new Date().getTime()

export function useTrainingTimer(exercisesLeft: number) {
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState<number>(0)
  const intervalRef = useRef<number | null>(null)
  const appState = useRef<AppStateStatus>(AppState.currentState)

  const scheduleOrUpdateNotification = async (elapsedSeconds: number) => {
    await Notifications.cancelAllScheduledNotificationsAsync()
    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0')

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏱ Treino em andamento',
        body: `Tempo de treino: ${minutes}:${seconds}`,
        sticky: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60,
        repeats: true,
      },
    })
  }

  useEffect(() => {
    const init = async () => {
      const final = await AsyncStorage.getItem(TIMER_KEY_FINAL)
      const saved = await AsyncStorage.getItem(TIMER_KEY)
      const now = getNow()

      const start = saved ? Number(saved) : now
      setStartTime(start)
      if (!saved) await AsyncStorage.setItem(TIMER_KEY, String(start))

      setElapsed(Math.floor(((final ? Number(final) : now) - start) / 1000))

      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync()
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync()
        }
      }

      if (exercisesLeft > 0) {
        await scheduleOrUpdateNotification(Math.floor((now - start) / 1000))
      } else if (!final) {
        await AsyncStorage.setItem(TIMER_KEY_FINAL, String(getNow()))
      }
    }

    init()
  }, [])

  useEffect(() => {
    if (!startTime || exercisesLeft === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      const now = getNow()
      const newElapsed = Math.floor((now - startTime) / 1000)
      setElapsed(newElapsed)
      scheduleOrUpdateNotification(newElapsed)
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startTime, exercisesLeft])

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (startTime && exercisesLeft > 0) {
          const now = getNow()
          const newElapsed = Math.floor((now - startTime) / 1000)
          setElapsed(newElapsed)
          scheduleOrUpdateNotification(newElapsed)
        }
      }
      appState.current = nextAppState
    })

    return () => sub.remove()
  }, [startTime, exercisesLeft])

  return elapsed
}
