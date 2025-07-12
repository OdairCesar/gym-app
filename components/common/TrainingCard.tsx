import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Training } from '@/interfaces/Training'
import { User } from '@/interfaces/User'
import { useAppTheme } from '@/hooks/useAppTheme'

interface TrainingCardProps {
  training: Training
  personals: User[]
  clients: User[]
  onEdit: (training: Training) => void
  onDelete: (trainingId: string) => void
}

export default function TrainingCard({
  training,
  personals,
  clients,
  onEdit,
  onDelete,
}: TrainingCardProps) {
  const { colors } = useAppTheme()

  const personalName =
    personals.find((p) => p._id === training.treinador)?.nome ||
    'Personal não encontrado'
  const clientName =
    clients.find((c) => c._id === training.user)?.nome ||
    'Cliente não encontrado'

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
        <Text style={styles.trainingName}>{training.nome}</Text>
        <Text style={styles.trainingDetail}>Cliente: {clientName}</Text>
        <Text style={styles.trainingDetail}>Personal: {personalName}</Text>
        <Text style={styles.trainingDetail}>
          Exercícios: {training.exercicios?.length || 0}
        </Text>
        <Text style={styles.trainingDetail}>
          Criado em: {new Date(training.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={styles.actionButtonGroup}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(training)}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(training._id)}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={colors.danger}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}
