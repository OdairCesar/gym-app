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
import { Picker } from '@react-native-picker/picker'
import { useAppTheme } from '@/hooks/useAppTheme'

export interface FilterField {
  key: string
  label: string
  type: 'text' | 'select'
  placeholder?: string
  value: string
  options?: { label: string; value: string }[]
}

interface GenericFilterModalProps {
  visible: boolean
  title: string
  fields: FilterField[]
  onClose: () => void
  onApplyFilters: () => void
  onClearFilters: () => void
  onFilterChange: (key: string, value: string) => void
}

export default function GenericFilterModal({
  visible,
  title,
  fields,
  onClose,
  onApplyFilters,
  onClearFilters,
  onFilterChange,
}: GenericFilterModalProps) {
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
    modalCancelButton: {
      fontSize: 16,
      color: colors.danger,
    },
    modalSaveButton: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600',
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    inputGroup: {
      marginVertical: 12,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
    },
    pickerContainer: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    picker: {
      height: 50,
      color: colors.text,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginVertical: 16,
    },
    buttonError: {
      backgroundColor: colors.danger,
    },
    buttonText: {
      color: colors.textLight,
      fontSize: 16,
      fontWeight: '600',
    },
  })

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <View key={field.key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={(text) => onFilterChange(field.key, text)}
              placeholder={field.placeholder}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        )

      case 'select':
        return (
          <View key={field.key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={field.value}
                onValueChange={(itemValue: string) =>
                  onFilterChange(field.key, itemValue)
                }
                style={styles.picker}
              >
                <Picker.Item
                  label={field.placeholder || 'Selecione...'}
                  value=""
                />
                {field.options?.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onApplyFilters}>
            <Text style={styles.modalSaveButton}>Aplicar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonError]}
            onPress={onClearFilters}
          >
            <Text style={styles.buttonText}>Limpar Filtros</Text>
          </TouchableOpacity>

          {fields.map(renderField)}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
