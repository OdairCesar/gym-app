import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'
import { useAppTheme } from '@/hooks/useAppTheme'

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth()
  const router = useRouter()
  const { styles, colors } = useAppTheme()

  const [form, setForm] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handlePasswordChange = async () => {
    if (form.new !== form.confirm) {
      Alert.alert('Erro', 'A nova senha e a confirmação não coincidem.')
      return
    }

    const success = await changePassword({
      currentPassword: form.current,
      newPassword: form.new,
    })

    if (success) {
      router.back()
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.containerWithPadding}>
      <TextInput
        style={styles.input}
        placeholder="Senha atual"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={form.current}
        onChangeText={(v) => setForm({ ...form, current: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={form.new}
        onChangeText={(v) => setForm({ ...form, new: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar nova senha"
        placeholderTextColor={colors.textSecondary}
        secureTextEntry
        value={form.confirm}
        onChangeText={(v) => setForm({ ...form, confirm: v })}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handlePasswordChange}
      >
        <Text style={styles.buttonText}>Atualizar Senha</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
