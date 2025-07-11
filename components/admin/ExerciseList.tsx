import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Exercise } from '@/interfaces/Exercise'

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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercícios ({exercises.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
          <MaterialCommunityIcons name="plus" size={20} color="#FFFFFF" />
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
                    color="#007AFF"
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
                  color="#FF3B30"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  )
}

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
    color: '#000000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 16,
  },
  exerciseItem: {
    backgroundColor: '#F8F9FA',
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
    color: '#000000',
    marginBottom: 2,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#6C7B7F',
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
})
