import React, { useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  BackHandler,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Meal } from '@/interfaces/Meal'
import { useAppTheme } from '@/hooks/useAppTheme'

interface MealFormModalProps {
  visible: boolean
  title: string
  formData: Partial<Meal>
  onClose: () => void
  onSave: () => void
  onFormChange: (key: string, value: string) => void
}

export default function MealFormModal({
  visible,
  title,
  formData,
  onClose,
  onSave,
  onFormChange,
}: MealFormModalProps) {
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
    formContainer: { flex: 1, padding: 16 },
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
    textArea: { height: 80, textAlignVertical: 'top' },
    scrollContent: { paddingBottom: 50 },
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

        <ScrollView
          style={styles.formContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome da Refeicao *</Text>
            <TextInput
              style={styles.input}
              value={formData.name || ''}
              onChangeText={(text) => onFormChange('name', text)}
              placeholder="Ex: Cafe da manha, Almoco, Jantar"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Horario</Text>
            <TextInput
              style={styles.input}
              value={formData.hourly || ''}
              onChangeText={(text) => onFormChange('hourly', text)}
              placeholder="Ex: 08:00, 12:30"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descricao</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description || ''}
              onChangeText={(text) => onFormChange('description', text)}
              placeholder="Descricao da refeicao"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
