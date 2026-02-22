import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import { Exercise } from '@/interfaces/Exercise'
import { useAppTheme } from '@/hooks/useAppTheme'

interface ExerciseFormModalProps {
  visible: boolean
  title?: string
  initialData?: Partial<Exercise>
  onClose: () => void
  onSave: (data: Partial<Exercise>) => void
}

export default function ExerciseFormModal({
  visible,
  title = 'Novo Exercicio',
  initialData,
  onClose,
  onSave,
}: ExerciseFormModalProps) {
  const { colors } = useAppTheme()

  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: '',
    reps: '',
    type: 'musculacao',
    weight: 0,
    rest_seconds: 60,
    video_link: '',
    ...initialData,
  })

  useEffect(() => {
    if (visible) {
      setFormData({
        name: '',
        reps: '',
        type: 'musculacao',
        weight: 0,
        rest_seconds: 60,
        video_link: '',
        ...initialData,
      })
    }
  }, [visible, initialData])

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose()
        return true
      }
      return false
    }
    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )
    return () => handler.remove()
  }, [visible, onClose])

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
    cancelBtn: { fontSize: 16, color: colors.error },
    saveBtn: { fontSize: 16, color: colors.primary, fontWeight: '600' },
    form: { flex: 1, paddingHorizontal: 16 },
    inputGroup: { marginVertical: 12 },
    label: {
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
    picker: { height: 50, color: colors.text },
  })

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelBtn}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={() => onSave(formData)}>
            <Text style={styles.saveBtn}>Salvar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.form}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              value={formData.name || ''}
              onChangeText={(t) => handleChange('name', t)}
              placeholder="Ex: Supino Reto"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Series/Reps *</Text>
            <TextInput
              style={styles.input}
              value={formData.reps || ''}
              onChangeText={(t) => handleChange('reps', t)}
              placeholder="Ex: 3x12, 4x8-10"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.type}
                onValueChange={(v) => handleChange('type', v)}
                style={styles.picker}
              >
                <Picker.Item label="Musculacao" value="musculacao" />
                <Picker.Item label="Aerobico" value="aerobico" />
                <Picker.Item label="Flexibilidade" value="flexibilidade" />
                <Picker.Item label="Outro" value="outro" />
              </Picker>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Carga (kg)</Text>
            <TextInput
              style={styles.input}
              value={formData.weight?.toString() || '0'}
              onChangeText={(t) => handleChange('weight', parseFloat(t) || 0)}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descanso (segundos)</Text>
            <TextInput
              style={styles.input}
              value={formData.rest_seconds?.toString() || '60'}
              onChangeText={(t) =>
                handleChange('rest_seconds', parseInt(t) || 0)
              }
              placeholder="60"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL do Video (opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.video_link || ''}
              onChangeText={(t) => handleChange('video_link', t)}
              placeholder="https://..."
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
