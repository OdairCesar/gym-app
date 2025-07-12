import React, { useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'
import { useAppTheme } from '@/hooks/useAppTheme'

export interface FormField {
  key: string
  label: string
  type:
    | 'text'
    | 'email'
    | 'password'
    | 'phone'
    | 'number'
    | 'multiline'
    | 'radio'
    | 'checkbox'
    | 'select'
  placeholder?: string
  required?: boolean
  value?: string | boolean
  options?: { label: string; value: string | boolean }[]
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  multiline?: boolean
  secureTextEntry?: boolean
}

interface GenericFormModalProps {
  visible: boolean
  title: string
  fields: FormField[]
  onClose: () => void
  onSave: () => void
  onFieldChange: (key: string, value: string | boolean) => void
}

export default function GenericFormModal({
  visible,
  title,
  fields,
  onClose,
  onSave,
  onFieldChange,
}: GenericFormModalProps) {
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

  const modalStyles = {
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
    },
    cancelButton: {
      fontSize: 16,
      color: colors.error,
    },
    saveButton: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600' as const,
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
      fontWeight: '500' as const,
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
    radioGroup: {
      flexDirection: 'column' as const,
      gap: 8,
    },
    radioOption: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: 8,
    },
    radioLabel: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },
    checkboxGroup: {
      marginVertical: 12,
    },
    checkboxOption: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: 8,
    },
    checkboxLabel: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 8,
    },
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'phone':
      case 'number':
      case 'multiline':
        return (
          <View key={field.key} style={modalStyles.inputGroup}>
            <Text style={modalStyles.inputLabel}>
              {field.label}
              {field.required && ' *'}
            </Text>
            <TextInput
              style={modalStyles.input}
              value={field.value as string}
              onChangeText={(text) => onFieldChange(field.key, text)}
              placeholder={field.placeholder}
              placeholderTextColor={colors.textSecondary}
              keyboardType={field.keyboardType || 'default'}
              multiline={field.multiline || false}
              secureTextEntry={field.secureTextEntry || false}
              autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
            />
          </View>
        )

      case 'select':
        return (
          <View key={field.key} style={modalStyles.inputGroup}>
            <Text style={modalStyles.inputLabel}>
              {field.label}
              {field.required && ' *'}
            </Text>
            <View style={modalStyles.pickerContainer}>
              <Picker
                selectedValue={field.value as string}
                onValueChange={(itemValue: string) =>
                  onFieldChange(field.key, itemValue)
                }
                style={modalStyles.picker}
              >
                <Picker.Item
                  label={field.placeholder || 'Selecione...'}
                  value=""
                />
                {field.options?.map((option) => (
                  <Picker.Item
                    key={option.value.toString()}
                    label={option.label}
                    value={option.value.toString()}
                  />
                ))}
              </Picker>
            </View>
          </View>
        )

      case 'radio':
        return (
          <View key={field.key} style={modalStyles.inputGroup}>
            <Text style={modalStyles.inputLabel}>
              {field.label}
              {field.required && ' *'}
            </Text>
            <View style={modalStyles.radioGroup}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option.value.toString()}
                  style={modalStyles.radioOption}
                  onPress={() => onFieldChange(field.key, option.value)}
                >
                  <MaterialCommunityIcons
                    name={
                      field.value === option.value
                        ? 'radiobox-marked'
                        : 'radiobox-blank'
                    }
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={modalStyles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case 'checkbox':
        return (
          <View key={field.key} style={modalStyles.checkboxGroup}>
            <TouchableOpacity
              style={modalStyles.checkboxOption}
              onPress={() => onFieldChange(field.key, !field.value)}
            >
              <MaterialCommunityIcons
                name={
                  field.value ? 'checkbox-marked' : 'checkbox-blank-outline'
                }
                size={20}
                color={colors.primary}
              />
              <Text style={modalStyles.checkboxLabel}>{field.label}</Text>
            </TouchableOpacity>
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
      <SafeAreaView style={modalStyles.modalContainer}>
        <View style={modalStyles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={modalStyles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onSave}>
            <Text style={modalStyles.saveButton}>Salvar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={modalStyles.formContainer}>
          {fields.map(renderField)}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
