import React from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import { GlobalStyles, Colors } from '@/styles/globalStyles'

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
          <View key={field.key} style={GlobalStyles.inputGroup}>
            <Text style={GlobalStyles.inputLabel}>{field.label}</Text>
            <TextInput
              style={GlobalStyles.input}
              value={field.value}
              onChangeText={(text) => onFilterChange(field.key, text)}
              placeholder={field.placeholder}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>
        )

      case 'select':
        return (
          <View key={field.key} style={GlobalStyles.inputGroup}>
            <Text style={GlobalStyles.inputLabel}>{field.label}</Text>
            <View style={GlobalStyles.pickerContainer}>
              <Picker
                selectedValue={field.value}
                onValueChange={(itemValue: string) =>
                  onFilterChange(field.key, itemValue)
                }
                style={GlobalStyles.picker}
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
      <SafeAreaView style={GlobalStyles.modalContainer}>
        <View style={GlobalStyles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={GlobalStyles.modalCancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={GlobalStyles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onApplyFilters}>
            <Text style={GlobalStyles.modalSaveButton}>Aplicar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={GlobalStyles.formContainer}>
          <TouchableOpacity
            style={[
              GlobalStyles.button,
              GlobalStyles.buttonError,
              { marginVertical: 16 },
            ]}
            onPress={onClearFilters}
          >
            <Text style={GlobalStyles.buttonText}>Limpar Filtros</Text>
          </TouchableOpacity>

          {fields.map(renderField)}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
