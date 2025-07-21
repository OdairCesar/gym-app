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
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Exercise } from '@/interfaces/Exercise'
import { useAppTheme } from '@/hooks/useAppTheme'

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
  const { colors } = useAppTheme()
  const translateX = useSharedValue(0)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null,
  )
  const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.15

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Só ativa com movimento horizontal de pelo menos 10px
    .failOffsetY([-10, 10]) // Falha se movimento vertical for maior que 10px
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

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const opacity = Math.abs(translateX.value) / (SWIPE_THRESHOLD * 2)
    return {
      opacity: Math.min(opacity, 1),
    }
  })

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.swipeContainer}>
        {/* Background de conclusão (swipe para esquerda) */}
        {swipeDirection === 'left' && (
          <Animated.View
            style={[
              styles.swipeBackground,
              styles.completeBackground,
              backgroundAnimatedStyle,
            ]}
          >
            <View style={styles.swipeAction}>
              <View style={styles.swipeIcon}>
                <MaterialCommunityIcons name="check" size={18} color="#fff" />
              </View>
              <Text style={styles.swipeActionText}>Concluir</Text>
            </View>
          </Animated.View>
        )}

        {/* Background de pular (swipe para direita) */}
        {swipeDirection === 'right' && (
          <Animated.View
            style={[
              styles.swipeBackground,
              styles.skipBackground,
              backgroundAnimatedStyle,
            ]}
          >
            <View style={styles.swipeAction}>
              <View style={styles.swipeIcon}>
                <MaterialCommunityIcons
                  name="skip-next"
                  size={18}
                  color="#fff"
                />
              </View>
              <Text style={styles.swipeActionText}>Pular</Text>
            </View>
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.card,
            animatedStyle,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header do exercício */}
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseOrderBadge}>
              <Text
                style={[styles.exerciseOrderText, { color: colors.background }]}
              >
                {exercicio.ordem}
              </Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={[styles.exerciseName, { color: colors.text }]}>
                {exercicio.nome}
              </Text>
              {exercicio.tipo && (
                <Text style={[styles.exerciseType, { color: colors.primary }]}>
                  {exercicio.tipo}
                </Text>
              )}
            </View>
          </View>

          {/* Detalhes do exercício em linha */}
          {(exercicio.series || exercicio.carga || exercicio.descanso) && (
            <View style={styles.exerciseDetailsRow}>
              {exercicio.series && (
                <Text style={[styles.detailText, { color: colors.primary }]}>
                  {exercicio.series} série{exercicio.series !== '1' ? 's' : ''}
                </Text>
              )}

              {exercicio.series && (exercicio.carga || exercicio.descanso) && (
                <View
                  style={[
                    styles.detailSeparator,
                    { backgroundColor: colors.border },
                  ]}
                />
              )}

              {exercicio.carga && (
                <Text style={[styles.detailText, { color: '#FF9800' }]}>
                  {exercicio.carga}
                </Text>
              )}

              {exercicio.carga && exercicio.descanso && (
                <View
                  style={[
                    styles.detailSeparator,
                    { backgroundColor: colors.border },
                  ]}
                />
              )}

              {exercicio.descanso && (
                <Text style={[styles.detailText, { color: '#4CAF50' }]}>
                  {exercicio.descanso} descanso
                </Text>
              )}
            </View>
          )}

          {/* Indicador de swipe */}
          <View style={styles.swipeIndicator}>
            <View
              style={[styles.swipeHint, { backgroundColor: colors.border }]}
            />
            <Text
              style={[styles.swipeHintText, { color: colors.textSecondary }]}
            >
              Deslize para concluir ou pular
            </Text>
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  swipeContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  swipeBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  completeBackground: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  skipBackground: {
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  swipeAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  swipeActionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseOrderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  exerciseOrderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
    lineHeight: 20,
  },
  exerciseType: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  exerciseDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 3,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailSeparator: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginHorizontal: 10,
  },
  detailChip: {
    backgroundColor: 'rgba(33,150,243,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(33,150,243,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailItem: {
    backgroundColor: 'rgba(33,150,243,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  swipeIndicator: {
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  swipeHint: {
    width: 32,
    height: 3,
    borderRadius: 2,
    marginBottom: 5,
  },
  swipeHintText: {
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.6,
  },
})
