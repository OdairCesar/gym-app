import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { IDiet } from '@/interfaces/Diet'
import { User } from '@/interfaces/User'
import { Colors } from '@/styles/globalStyles'

interface DietCardProps {
  diet: IDiet
  personals: User[]
  onEdit: (diet: IDiet) => void
  onDelete: (dietId: string) => void
  onAssignToClient: (diet: IDiet) => void
}

export default function DietCard({
  diet,
  personals,
  onEdit,
  onDelete,
  onAssignToClient,
}: DietCardProps) {
  const getPersonalName = (personalId: string) => {
    const personal = personals.find((p) => p._id === personalId)
    return personal?.nome || 'Personal não encontrado'
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{diet.nome}</Text>
        <View style={styles.mealsCount}>
          <MaterialIcons
            name="restaurant-menu"
            size={16}
            color={Colors.primary}
          />
          <Text style={styles.mealsCountText}>
            {diet.refeicoes?.length || 0} refeições
          </Text>
        </View>
      </View>

      {diet.descricao && (
        <Text style={styles.description} numberOfLines={2}>
          {diet.descricao}
        </Text>
      )}

      <View style={styles.nutritionInfo}>
        {diet.calorias && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Calorias:</Text>
            <Text style={styles.nutritionValue}>{diet.calorias} kcal</Text>
          </View>
        )}
        {diet.proteinas && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Proteínas:</Text>
            <Text style={styles.nutritionValue}>{diet.proteinas}g</Text>
          </View>
        )}
        {diet.carboidratos && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Carboidratos:</Text>
            <Text style={styles.nutritionValue}>{diet.carboidratos}g</Text>
          </View>
        )}
        {diet.gorduras && (
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionLabel}>Gorduras:</Text>
            <Text style={styles.nutritionValue}>{diet.gorduras}g</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Criador:</Text>
          <Text style={styles.detailValue}>
            {diet.criador ? getPersonalName(diet.criador) : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.assignButton]}
          onPress={() => onAssignToClient(diet)}
        >
          <MaterialIcons name="person-add" size={16} color={Colors.success} />
          <Text style={styles.assignButtonText}>Atribuir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(diet)}
        >
          <MaterialIcons name="edit" size={16} color={Colors.primary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(diet._id || '')}
        >
          <MaterialIcons name="delete" size={16} color={Colors.danger} />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    marginVertical: 4,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  mealsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealsCountText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  nutritionItem: {
    flexDirection: 'row',
    marginRight: 16,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginRight: 4,
  },
  nutritionValue: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    marginBottom: 4,
  },
  assignButton: {
    backgroundColor: Colors.successLight,
  },
  editButton: {
    backgroundColor: Colors.primaryButtonLight,
  },
  deleteButton: {
    backgroundColor: Colors.dangerLight,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 4,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.danger,
    marginLeft: 4,
  },
  assignButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.success,
    marginLeft: 4,
  },
})
