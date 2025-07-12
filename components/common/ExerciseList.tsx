import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Exercise } from '@/interfaces/Exercise'
import { useAppTheme } from '@/hooks/useAppTheme'

interface ExerciseListProps {
  exercises: Exercise[]
  onAdd: () => void
  onRemove: (index: number) => void
  onEdit?: (exercise: Exercise, index: number) => void
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
      marginVertical: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      gap: 4,
    },
    addButtonText: {
      color: colors.textLight,
      fontSize: 14,
      fontWeight: '600',
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
      textAlign: 'center',
      paddingVertical: 16,
    },
    exerciseItem: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    exerciseInfo: {
      flex: 1,
    },
    exerciseName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
    },
    exerciseDetails: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    exerciseActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 4,
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercícios ({exercises.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <MaterialCommunityIcons
            name="plus"
            size={20}
            color={colors.textLight}
          />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {exercises.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum exercício adicionado</Text>
      ) : (
        exercises.map((exercise, index) => (
          <View
            key={`exercise-${index}-${exercise.nome}`}
            style={styles.exerciseItem}
          >
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.nome}</Text>
              <Text style={styles.exerciseDetails}>
                {exercise.series} • {exercise.tipo} • {exercise.carga}kg •{' '}
                {exercise.descanso}s
              </Text>
            </View>
            <View style={styles.exerciseActions}>
              {onEdit && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onEdit(exercise, index)}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={16}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onRemove(index)}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={16}
                  color={colors.danger}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  )
}
