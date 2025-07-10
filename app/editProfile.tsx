import {
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useState, useEffect } from 'react'
import { useAuth as useAuthContext } from '@/context/authContext'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'expo-router'

export default function EditProfileScreen() {
  const { getUser } = useAuthContext()
  const { updateProfile } = useAuth()
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
  }, [getUser])

  const handleUpdate = async () => {
    // Converter dataNascimento para Date se necessário
    const userData = {
      ...form,
      dataNascimento: form.dataNascimento
        ? new Date(form.dataNascimento)
        : undefined,
      sexo: form.sexo as 'M' | 'F' | 'O',
    }

    const success = await updateProfile(userData)

    if (success) {
      router.back()
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
