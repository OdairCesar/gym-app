import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'expo-router'
import { buildApiUrl, API_ENDPOINTS } from '@/constants/api'

export default function EditProfileScreen() {
  const { getUser, getToken } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
    dataNascimento: '',
    cpf: '',
    sexo: '',
    endereco: '',
    profissao: '',
  })

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser()
      if (user) {
        setForm({
          nome: user.nome || '',
          telefone: user.telefone || '',
          dataNascimento: user.dataNascimento
            ? user.dataNascimento.toISOString().split('T')[0]
            : '',
          cpf: user.cpf || '',
          sexo: user.sexo || 'O',
          endereco: user.endereco || '',
          profissao: user.profissao || '',
        })
      }
    }

    loadUser()
  }, [])

  const handleUpdate = async () => {
    try {
      const token = await getToken()
      const res = await fetch(buildApiUrl(API_ENDPOINTS.USER_ME), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (data.status === 'success') {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!')
        router.back()
      } else {
        Alert.alert('Erro', data.message || 'Não foi possível atualizar.')
      }
    } catch (err) {
      Alert.alert('Erro', 'Houve um erro ao atualizar o perfil.')
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={form.nome}
        onChangeText={(v) => setForm({ ...form, nome: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={form.telefone}
        onChangeText={(v) => setForm({ ...form, telefone: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento"
        value={form.dataNascimento}
        onChangeText={(v) => setForm({ ...form, dataNascimento: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={form.cpf}
        onChangeText={(v) => setForm({ ...form, cpf: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Sexo"
        value={form.sexo}
        onChangeText={(v) => setForm({ ...form, sexo: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Profissão"
        value={form.profissao}
        onChangeText={(v) => setForm({ ...form, profissao: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        value={form.endereco}
        onChangeText={(v) => setForm({ ...form, endereco: v })}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
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
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
