import React from 'react'
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import { User } from '@/interfaces/User'
import { IDiet } from '@/interfaces/Diet'
import { Colors } from '@/styles/globalStyles'

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
      <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
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
            <MaterialIcons name="people-outline" size={48} color="#C7C7CC" />
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.error,
  },
  placeholder: {
    width: 60, // Para centralizar o título
  },
  dietInfo: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  dietName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  dietDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  clientsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  clientItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
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
    color: '#000000',
    flex: 1,
  },
  hasDietBadge: {
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  hasDietText: {
    fontSize: 10,
    color: '#B8860B',
    fontWeight: '500',
  },
  clientEmail: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 2,
  },
  clientPhone: {
    fontSize: 12,
    color: '#8E8E93',
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
    color: '#8E8E93',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    textAlign: 'center',
    marginTop: 8,
  },
})
