import React, { useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppTheme } from '@/hooks/useAppTheme'

interface FoodFormModalProps {
  visible: boolean
  title: string
  name: string
  onClose: () => void
  onSave: () => void
  onNameChange: (name: string) => void
}

export default function FoodFormModal({
  visible,
  title,
  name,
  onClose,
  onSave,
  onNameChange,
}: FoodFormModalProps) {
  const { colors } = useAppTheme()

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose()
        return true
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
    modalContainer: { flex: 1, backgroundColor: colors.background },
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
    modalTitle: { fontSize: 17, fontWeight: '600', color: colors.text },
    cancelButton: { fontSize: 17, color: colors.danger },
    saveButton: { fontSize: 17, fontWeight: '600', color: colors.primary },
    formContainer: { padding: 16 },
    inputGroup: { marginBottom: 16 },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.text,
    },
  })

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
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onSave}>
            <Text style={styles.saveButton}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome do Alimento *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={onNameChange}
              placeholder="Ex: Arroz integral, Frango grelhado"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}
