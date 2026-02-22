import React, { useState, useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppTheme } from '@/hooks/useAppTheme'
import { Gym } from '@/interfaces/Gym'

interface GymFormModalProps {
  visible: boolean
  title?: string
  initialData?: Partial<Gym>
  onClose: () => void
  onSave: (data: Partial<Gym>) => void
}

export default function GymFormModal({
  visible,
  title = 'Academia',
  initialData,
  onClose,
  onSave,
}: GymFormModalProps) {
  const { colors } = useAppTheme()

  const [formData, setFormData] = useState<Partial<Gym>>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    cnpj: '',
    published: true,
  })

  useEffect(() => {
    if (visible) {
      setFormData({
        name: initialData?.name ?? '',
        description: initialData?.description ?? '',
        address: initialData?.address ?? '',
        phone: initialData?.phone ?? '',
        email: initialData?.email ?? '',
        cnpj: initialData?.cnpj ?? '',
        published: initialData?.published ?? true,
      })
    }
  }, [visible, initialData])

  const handleSave = () => {
    if (!formData.name?.trim()) return
    onSave(formData)
  }

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.background,
      borderColor: colors.border,
      color: colors.text,
    },
  ]
  const labelStyle = [styles.label, { color: colors.textSecondary }]

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.cancelBtn, { color: colors.danger }]}>
              Cancelar
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveBtn, { color: colors.primary }]}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={labelStyle}>Nome *</Text>
          <TextInput
            style={inputStyle}
            value={formData.name}
            onChangeText={(v) => setFormData((p) => ({ ...p, name: v }))}
            placeholder="Nome da academia"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={labelStyle}>Descrição</Text>
          <TextInput
            style={[inputStyle, styles.multiline]}
            value={formData.description}
            onChangeText={(v) => setFormData((p) => ({ ...p, description: v }))}
            placeholder="Descrição"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={3}
          />

          <Text style={labelStyle}>Endereço</Text>
          <TextInput
            style={inputStyle}
            value={formData.address}
            onChangeText={(v) => setFormData((p) => ({ ...p, address: v }))}
            placeholder="Endereço completo"
            placeholderTextColor={colors.textSecondary}
          />

          <Text style={labelStyle}>Telefone</Text>
          <TextInput
            style={inputStyle}
            value={formData.phone}
            onChangeText={(v) => setFormData((p) => ({ ...p, phone: v }))}
            placeholder="(00) 00000-0000"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />

          <Text style={labelStyle}>E-mail</Text>
          <TextInput
            style={inputStyle}
            value={formData.email}
            onChangeText={(v) => setFormData((p) => ({ ...p, email: v }))}
            placeholder="email@academia.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={labelStyle}>CNPJ</Text>
          <TextInput
            style={inputStyle}
            value={formData.cnpj}
            onChangeText={(v) => setFormData((p) => ({ ...p, cnpj: v }))}
            placeholder="00.000.000/0000-00"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />

          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: colors.text }]}>
              Publicado
            </Text>
            <Switch
              value={formData.published}
              onValueChange={(v) =>
                setFormData((p) => ({ ...p, published: v }))
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontWeight: '700' },
  cancelBtn: { fontSize: 16 },
  saveBtn: { fontSize: 16, fontWeight: '700' },
  content: { padding: 16, gap: 4, paddingBottom: 48 },
  label: { fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 8,
  },
  switchLabel: { fontSize: 15, fontWeight: '600' },
})
