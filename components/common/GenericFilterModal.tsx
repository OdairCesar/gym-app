import React from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'

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
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onApplyFilters}>
            <Text style={styles.saveButton}>Aplicar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={onClearFilters}
          >
            <Text style={styles.clearFiltersText}>Limpar Filtros</Text>
          </TouchableOpacity>

          {fields.map(renderField)}
        </ScrollView>
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
    color: '#FF3B30',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
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
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  clearFiltersButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  picker: {
    height: 50,
  },
  filterPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPickerOption: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterPickerOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterPickerText: {
    fontSize: 14,
    color: '#000000',
  },
  filterPickerTextSelected: {
    color: '#FFFFFF',
  },
})
