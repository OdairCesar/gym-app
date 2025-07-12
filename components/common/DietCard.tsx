import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { IDiet } from '@/interfaces/Diet'
import { User } from '@/interfaces/User'
import { useAppTheme } from '@/hooks/useAppTheme'

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
  const { colors } = useAppTheme()

  const getPersonalName = (personalId: string) => {
    const personal = personals.find((p) => p._id === personalId)
    return personal?.nome || 'Personal não encontrado'
  }

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      marginVertical: 4,
      padding: 16,
      shadowColor: colors.shadow,
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
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    mealsCount: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    mealsCountText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.primary,
      marginLeft: 4,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
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
      alignItems: 'center',
      marginRight: 16,
      marginBottom: 4,
    },
    nutritionLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginRight: 4,
    },
    nutritionValue: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.success,
    },
    details: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginLeft: 8,
    },
    assignButton: {
      backgroundColor: colors.successLight,
    },
    editButton: {
      backgroundColor: colors.primaryButtonLight,
    },
    deleteButton: {
      backgroundColor: colors.dangerLight,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.primary,
      marginLeft: 4,
    },
    deleteButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.danger,
      marginLeft: 4,
    },
    assignButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.success,
      marginLeft: 4,
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{diet.nome}</Text>
        <View style={styles.mealsCount}>
          <MaterialIcons
            name="restaurant-menu"
            size={16}
            color={colors.primary}
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
          <MaterialIcons name="person-add" size={16} color={colors.success} />
          <Text style={styles.assignButtonText}>Atribuir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(diet)}
        >
          <MaterialIcons name="edit" size={16} color={colors.primary} />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(diet._id || '')}
        >
          <MaterialIcons name="delete" size={16} color={colors.danger} />
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
