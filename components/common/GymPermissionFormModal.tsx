import React, { useEffect } from 'react'
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
import { GymPermission } from '@/interfaces/Permission'
import { useAppTheme } from '@/hooks/useAppTheme'

interface GymPermissionFormModalProps {
  visible: boolean
  title: string
  formData: Partial<GymPermission>
  onClose: () => void
  onSave: () => void
  onFormChange: (key: keyof GymPermission, value: string) => void
}

export default function GymPermissionFormModal({
  visible,
  title,
  formData,
  onClose,
  onSave,
  onFormChange,
}: GymPermissionFormModalProps) {
  const { colors } = useAppTheme()

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
    hint: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
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
          <TouchableOpacity onPress={onSave}>
            <Text style={styles.saveBtn}>Salvar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.form}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ID da Academia *</Text>
            <TextInput
              style={styles.input}
              value={formData.gymId?.toString() || ''}
              onChangeText={(t) => onFormChange('gymId', t)}
              placeholder="ID da academia"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ação *</Text>
            <TextInput
              style={styles.input}
              value={formData.action || ''}
              onChangeText={(t) => onFormChange('action', t)}
              placeholder="Ex: manage_products, manage_all"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
            />
            <Text style={styles.hint}>
              Ações disponíveis: manage_products, manage_all, view_reports
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recurso *</Text>
            <TextInput
              style={styles.input}
              value={formData.resource || ''}
              onChangeText={(t) => onFormChange('resource', t)}
              placeholder="Ex: products, *, trainings"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="none"
            />
            <Text style={styles.hint}>
              Use * para acesso total ou especifique um recurso
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
