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
  const [userId, setUserId] = useState<number>(0)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    birthDate: '',
    cpf: '',
    gender: '',
    address: '',
    profession: '',
  })

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser()
      if (user) {
        setUserId(user.id)
        setForm({
          name: user.name || '',
          phone: user.phone || '',
          birthDate: user.birthDate
            ? user.birthDate.split('T')[0]
            : '',
          cpf: user.cpf || '',
          gender: user.gender || 'O',
          address: user.address || '',
          profession: user.profession || '',
        })
      }
    }

    loadUser()
  }, [getUser])

  const handleUpdate = async () => {
    const userData = {
      name: form.name,
      phone: form.phone,
      birthDate: form.birthDate || undefined,
      cpf: form.cpf,
      gender: form.gender as 'M' | 'F' | 'O',
      address: form.address,
      profession: form.profession,
    }

    const success = await updateProfile(userId, userData)

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
        value={form.name}
        onChangeText={(v) => setForm({ ...form, name: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        placeholderTextColor={colors.textSecondary}
        value={form.phone}
        onChangeText={(v) => setForm({ ...form, phone: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (AAAA-MM-DD)"
        placeholderTextColor={colors.textSecondary}
        value={form.birthDate}
        onChangeText={(v) => setForm({ ...form, birthDate: v })}
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
        placeholder="Gênero (M/F/O)"
        placeholderTextColor={colors.textSecondary}
        value={form.gender}
        onChangeText={(v) => setForm({ ...form, gender: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Profissão"
        placeholderTextColor={colors.textSecondary}
        value={form.profession}
        onChangeText={(v) => setForm({ ...form, profession: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Endereço"
        placeholderTextColor={colors.textSecondary}
        value={form.address}
        onChangeText={(v) => setForm({ ...form, address: v })}
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
