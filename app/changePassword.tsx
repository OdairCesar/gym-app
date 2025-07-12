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
import { GlobalStyles, Colors } from '@/styles/globalStyles'

export default function ChangePasswordScreen() {
  const { changePassword } = useAuth()
  const router = useRouter()

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
    <ScrollView contentContainerStyle={GlobalStyles.containerWithPadding}>
      <TextInput
        style={GlobalStyles.input}
        placeholder="Senha atual"
        secureTextEntry
        value={form.current}
        onChangeText={(v) => setForm({ ...form, current: v })}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={form.new}
        onChangeText={(v) => setForm({ ...form, new: v })}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Confirmar nova senha"
        secureTextEntry
        value={form.confirm}
        onChangeText={(v) => setForm({ ...form, confirm: v })}
      />

      <TouchableOpacity
        style={[GlobalStyles.button, { backgroundColor: Colors.primary }]}
        onPress={handlePasswordChange}
      >
        <Text style={GlobalStyles.buttonText}>Atualizar Senha</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
