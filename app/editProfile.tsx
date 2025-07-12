import { Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useAuth as useAuthContext } from '@/context/authContext'
import { useAuth } from '@/hooks/useAuth'
import { useAppTheme } from '@/hooks/useAppTheme'
import { useRouter } from 'expo-router'

export default function EditProfileScreen() {
  const { getUser } = useAuthContext()
  const { updateProfile } = useAuth()
  const router = useRouter()
  const { styles, colors } = useAppTheme()
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
    <ScrollView contentContainerStyle={styles.containerWithPadding}>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor={colors.textSecondary}
        value={form.nome}
        onChangeText={(v) => setForm({ ...form, nome: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        placeholderTextColor={colors.textSecondary}
        value={form.telefone}
        onChangeText={(v) => setForm({ ...form, telefone: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento"
        placeholderTextColor={colors.textSecondary}
        value={form.dataNascimento}
        onChangeText={(v) => setForm({ ...form, dataNascimento: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        placeholderTextColor={colors.textSecondary}
        value={form.cpf}
        onChangeText={(v) => setForm({ ...form, cpf: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Sexo"
        placeholderTextColor={colors.textSecondary}
        value={form.sexo}
        onChangeText={(v) => setForm({ ...form, sexo: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Profissão"
        placeholderTextColor={colors.textSecondary}
        value={form.profissao}
        onChangeText={(v) => setForm({ ...form, profissao: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        placeholderTextColor={colors.textSecondary}
        value={form.endereco}
        onChangeText={(v) => setForm({ ...form, endereco: v })}
      />

      <TouchableOpacity
        style={[styles.button, styles.buttonSuccess]}
        onPress={handleUpdate}
      >
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
