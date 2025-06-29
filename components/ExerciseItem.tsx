import React, { useState } from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import { Exercise } from '@/interfaces/Exercise'

const SCREEN_WIDTH = Dimensions.get('window').width

interface ExerciseItemProps {
  exercicio: Exercise
  onComplete: () => void
  onSkip: () => void
  disableComplete?: boolean
  disableSkip?: boolean
}

export function ExerciseItem({
  exercicio,
  onComplete,
  onSkip,
  disableComplete,
  disableSkip,
}: ExerciseItemProps) {
  const translateX = useSharedValue(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null,
  )
  const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.15

  const panGesture = Gesture.Pan()
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      if (disableComplete && e.translationX < 0) return
      if (disableSkip && e.translationX > 0) return

      translateX.value = e.translationX

      if (e.translationX < 0) runOnJS(setSwipeDirection)('left')
      else if (e.translationX > 0) runOnJS(setSwipeDirection)('right')
      else runOnJS(setSwipeDirection)(null)
    })
    .onEnd(() => {
      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.2, {}, () => {
          runOnJS(onComplete)()
          runOnJS(setSwipeDirection)(null)
        })
      } else if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.2, {}, () => {
          runOnJS(onSkip)()
          runOnJS(setSwipeDirection)(null)
        })
      } else {
        translateX.value = withTiming(0, {}, () => {
          runOnJS(setSwipeDirection)(null)
        })
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.swipeContainer}>
        {swipeDirection === 'left' && (
          <View style={[styles.swipeBackground, styles.completeRight]}>
            <Text style={styles.backgroundText}>Concluir</Text>
          </View>
        )}

        {swipeDirection === 'right' && (
          <View style={[styles.swipeBackground, styles.skipLeft]}>
            <Text style={styles.backgroundText}>Pular</Text>
          </View>
        )}

        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.exerciseName}>{exercicio.nome}</Text>
            {exercicio.series && <Text>Séries: {exercicio.series}</Text>}
            {exercicio.tipo && <Text>Tipo: {exercicio.tipo}</Text>}
            {exercicio.carga && <Text>Carga: {exercicio.carga}</Text>}
            {exercicio.descanso && <Text>Descanso: {exercicio.descanso}</Text>}
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  swipeContainer: {
    marginBottom: 12,
  },
  swipeBackground: {
    position: 'absolute',
    flexDirection: 'row',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  skipLeft: {
    flex: 1,
    backgroundColor: '#ff5733',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  completeRight: {
    flex: 1,
    backgroundColor: '#28a745',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  backgroundText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
})
