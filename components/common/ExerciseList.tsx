import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Exercise } from '@/interfaces/Exercise'
import { useAppTheme } from '@/hooks/useAppTheme'

interface ExerciseListProps {
  exercises: Exercise[]
  onAdd: () => void
  onRemove: (exerciseId: number) => void
  onEdit?: (exercise: Exercise) => void
}

export default function ExerciseList({
  exercises,
  onAdd,
  onRemove,
  onEdit,
}: ExerciseListProps) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
      textAlign: 'center',
      paddingVertical: 32,
    },
    exerciseItem: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 10,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
    exerciseInfo: {
      flex: 1,
    },
    exerciseName: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 3,
    },
    exerciseDetails: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    exerciseActions: {
      flexDirection: 'row',
      gap: 6,
      marginLeft: 8,
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      {exercises.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum exercício adicionado</Text>
      ) : (
        exercises.map((exercise) => (
          <View key={`exercise-${exercise.id}`} style={styles.exerciseItem}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetails}>
                {exercise.reps}
                {exercise.type ? ` • ${exercise.type}` : ''}
                {exercise.weight ? ` • ${exercise.weight}kg` : ''}
                {exercise.rest_seconds ? ` • ${exercise.rest_seconds}s descanso` : ''}
              </Text>
            </View>
            <View style={styles.exerciseActions}>
              {onEdit && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.primaryLight }]}
                  onPress={() => onEdit(exercise)}
                >
                  <MaterialCommunityIcons name="pencil" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.dangerLight }]}
                onPress={() => onRemove(exercise.id)}
              >
                <MaterialCommunityIcons name="delete" size={16} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  )
}
