import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'

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
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Senha atual"
        secureTextEntry
        value={form.current}
        onChangeText={(v) => setForm({ ...form, current: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        secureTextEntry
        value={form.new}
        onChangeText={(v) => setForm({ ...form, new: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar nova senha"
        secureTextEntry
        value={form.confirm}
        onChangeText={(v) => setForm({ ...form, confirm: v })}
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>Atualizar Senha</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6f42c1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
