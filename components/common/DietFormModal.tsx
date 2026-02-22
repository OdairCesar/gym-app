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
import { Diet } from '@/interfaces/Diet'
import { useAppTheme } from '@/hooks/useAppTheme'

interface DietFormModalProps {
  visible: boolean
  title: string
  formData: Partial<Diet>
  onClose: () => void
  onSave: () => void
  onFormChange: (key: string, value: string | number) => void
}

export default function DietFormModal({
  visible,
  title,
  formData,
  onClose,
  onSave,
  onFormChange,
}: DietFormModalProps) {
  const { colors } = useAppTheme()

  useEffect(() => {
    const backAction = () => {
      if (visible) { onClose(); return true }
      return false
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)
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
    inputLabel: { fontSize: 16, fontWeight: '500', color: colors.text, marginBottom: 8 },
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
    sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 12, marginTop: 8 },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    halfWidth: { width: '48%' },
    scrollContent: { paddingBottom: 50 },
  })

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
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

        <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nome da Dieta *</Text>
            <TextInput
              style={styles.input}
              value={formData.name || ''}
              onChangeText={(text) => onFormChange('name', text)}
              placeholder="Digite o nome da dieta"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descricao</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description || ''}
              onChangeText={(text) => onFormChange('description', text)}
              placeholder="Digite a descricao da dieta"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <Text style={styles.sectionTitle}>Informacoes Nutricionais</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Calorias (kcal)</Text>
              <TextInput
                style={styles.input}
                value={formData.calories?.toString() || ''}
                onChangeText={(text) => onFormChange('calories', text)}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Proteinas (g)</Text>
              <TextInput
                style={styles.input}
                value={formData.proteins?.toString() || ''}
                onChangeText={(text) => onFormChange('proteins', text)}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Carboidratos (g)</Text>
              <TextInput
                style={styles.input}
                value={formData.carbohydrates?.toString() || ''}
                onChangeText={(text) => onFormChange('carbohydrates', text)}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Gorduras (g)</Text>
              <TextInput
                style={styles.input}
                value={formData.fats?.toString() || ''}
                onChangeText={(text) => onFormChange('fats', text)}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
