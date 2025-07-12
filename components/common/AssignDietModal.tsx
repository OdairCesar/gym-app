import React, { useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  BackHandler,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import { User } from '@/interfaces/User'
import { IDiet } from '@/interfaces/Diet'
import { useAppTheme } from '@/hooks/useAppTheme'

interface AssignDietModalProps {
  visible: boolean
  diet: IDiet | null
  clients: User[]
  onClose: () => void
  onAssign: (clientId: string) => void
}

export default function AssignDietModal({
  visible,
  diet,
  clients,
  onClose,
  onAssign,
}: AssignDietModalProps) {
  const { colors } = useAppTheme()

  // Handler para o botão voltar do Android
  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose()
        return true // Previne o comportamento padrão
      }
      return false
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [visible, onClose])

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    cancelButton: {
      fontSize: 16,
      color: colors.danger,
    },
    placeholder: {
      width: 60,
    },
    dietInfo: {
      backgroundColor: colors.backgroundSecondary,
      padding: 16,
      marginBottom: 16,
    },
    dietName: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    dietDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    clientsList: {
      flex: 1,
      paddingHorizontal: 16,
    },
    clientItem: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      padding: 16,
      marginVertical: 4,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    clientInfo: {
      flex: 1,
    },
    clientHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    clientName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    hasDietBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    hasDietText: {
      fontSize: 10,
      color: colors.primary,
      fontWeight: '500',
    },
    clientEmail: {
      fontSize: 14,
      color: colors.primary,
      marginBottom: 2,
    },
    clientPhone: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '500',
      color: colors.textSecondary,
      marginTop: 16,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
  })

  const renderClientItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.clientItem}
      onPress={() => onAssign(item._id || '')}
    >
      <View style={styles.clientInfo}>
        <View style={styles.clientHeader}>
          <Text style={styles.clientName}>{item.nome}</Text>
          {item.diet_id && (
            <View style={styles.hasDietBadge}>
              <Text style={styles.hasDietText}>Com dieta</Text>
            </View>
          )}
        </View>
        <Text style={styles.clientEmail}>{item.email}</Text>
        {item.telefone && (
          <Text style={styles.clientPhone}>{item.telefone}</Text>
        )}
      </View>
      <MaterialIcons
        name="chevron-right"
        size={24}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Atribuir Dieta</Text>
          <View style={styles.placeholder} />
        </View>

        {diet && (
          <View style={styles.dietInfo}>
            <Text style={styles.dietName}>{diet.nome}</Text>
            <Text style={styles.dietDescription}>
              Selecione um cliente para receber esta dieta
            </Text>
          </View>
        )}

        {clients.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="people-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
            <Text style={styles.emptySubtext}>
              Cadastre clientes para poder atribuir dietas
            </Text>
          </View>
        ) : (
          <FlatList
            data={clients}
            keyExtractor={(item) => item._id || ''}
            renderItem={renderClientItem}
            style={styles.clientsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </Modal>
  )
}
