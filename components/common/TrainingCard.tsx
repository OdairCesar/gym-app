import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Training } from '@/interfaces/Training'
import { User } from '@/interfaces/User'
import { Colors } from '@/styles/globalStyles'

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
  const personalName =
    personals.find((p) => p._id === training.treinador)?.nome ||
    'Personal não encontrado'
  const clientName =
    clients.find((c) => c._id === training.user)?.nome ||
    'Cliente não encontrado'

  return (
    <View style={styles.trainingCard}>
      <View style={styles.trainingInfo}>
        <Text style={styles.trainingName}>{training.nome}</Text>
        <Text style={styles.trainingDetails}>Cliente: {clientName}</Text>
        <Text style={styles.trainingDetails}>Personal: {personalName}</Text>
        <Text style={styles.trainingDetails}>
          Exercícios: {training.exercicios?.length || 0}
        </Text>
        <Text style={styles.trainingDate}>
          Criado em: {new Date(training.createdAt).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={styles.trainingActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(training)}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(training._id)}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={Colors.danger}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  trainingCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trainingInfo: {
    flex: 1,
  },
  trainingName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  trainingDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  trainingDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  trainingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
})
