import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native'
import { useState } from 'react'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'expo-router'

export default function ChangePasswordScreen() {
  const { getToken } = useAuth()
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

    try {
      const token = await getToken()
      const res = await fetch(
        'https://gym-api-24p5.onrender.com/api/auth/change-password',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: form.current,
            newPassword: form.new,
          }),
        },
      )

      const data = await res.json()

      if (data.status === 'success') {
        Alert.alert('Sucesso', 'Senha atualizada com sucesso!')
        router.back()
      } else {
        Alert.alert('Erro', data.message || 'Falha ao trocar senha.')
      }
    } catch (err) {
      Alert.alert('Erro', 'Erro ao processar a solicitação.')
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
