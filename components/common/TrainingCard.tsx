import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Training } from '@/interfaces/Training'
import { useAppTheme } from '@/hooks/useAppTheme'

interface TrainingCardProps {
  training: Training
  onEdit: (training: Training) => void
  onDelete: (trainingId: number) => void
  onViewExercises?: (training: Training) => void
}

function TrainingCard({
  training,
  onEdit,
  onDelete,
  onViewExercises,
}: TrainingCardProps) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginVertical: 4,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    trainingInfo: {
      flex: 1,
    },
    trainingName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    trainingDetail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    actionButtonGroup: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.trainingInfo}>
        <Text style={styles.trainingName}>{training.name}</Text>
        {training.description ? (
          <Text style={styles.trainingDetail}>{training.description}</Text>
        ) : null}
        <Text style={styles.trainingDetail}>
          Criado em: {new Date(training.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={styles.actionButtonGroup}>
        {onViewExercises && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onViewExercises(training)}
          >
            <MaterialCommunityIcons name="dumbbell" size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(training)}
        >
          <MaterialCommunityIcons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(training.id)}
        >
          <MaterialCommunityIcons name="delete" size={20} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default React.memo(TrainingCard)
