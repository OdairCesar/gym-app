import React, { useState, useEffect } from 'react'
import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { MaskedTextInput } from 'react-native-mask-text'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/formatDate'
import { useAppTheme } from '@/hooks/useAppTheme'
import { apiService } from '@/services/apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Gym } from '@/interfaces/Gym'

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    birthDate: '',
    phone: '',
    cpf: '',
    gender: '',
    profession: '',
    address: '',
    gymId: null as number | null,
    isAdmin: false,
    isPersonal: false,
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [gyms, setGyms] = useState<Gym[]>([])
  const { register } = useAuth()
  const { colors } = useAppTheme()
  const router = useRouter()

  useEffect(() => {
    apiService.get<Gym[]>(API_ENDPOINTS.GYMS).then((res) => {
      if (res.status === 'success' && Array.isArray(res.data)) {
        setGyms(res.data)
      }
    })
  }, [])

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      return
    }

    const userData = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      ...(form.birthDate ? { birthDate: parseDateToISO(form.birthDate) } : {}),
      ...(form.phone ? { phone: form.phone } : {}),
      ...(form.cpf ? { cpf: form.cpf } : {}),
      ...(form.gender ? { gender: form.gender as 'M' | 'F' | 'O' } : {}),
      ...(form.profession ? { profession: form.profession } : {}),
      ...(form.address ? { address: form.address } : {}),
      ...(form.gymId != null ? { gymId: form.gymId } : {}),
      isAdmin: form.isAdmin,
      isPersonal: form.isPersonal,
    }

    const success = await register(userData)
    if (success) {
      setRegistered(true)
    }
  }

  const selectGender = (value: string) => setForm({ ...form, gender: value })
  const selectIsAdmin = (value: string) =>
    setForm({ ...form, isAdmin: value === 'S' })
  const selectIsPersonal = (value: string) =>
    setForm({ ...form, isPersonal: value === 'S' })
  const equalsIsAdmin = (value: string) => form.isAdmin === (value === 'S')
  const equalsIsPersonal = (value: string) =>
    form.isPersonal === (value === 'S')

  const parseDateToISO = (dateString: string): string => {
    const [day, month, year] = dateString.split('/').map(Number)
    const mm = String(month).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
  }

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false)
      return
    }
    if (selectedDate) {
      setForm({ ...form, birthDate: formatDate(selectedDate) })
    }
    setShowDatePicker(false)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      {registered ? (
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { justifyContent: 'center', minHeight: '100%' },
          ]}
        >
          <View
            style={{
              alignItems: 'center',
              gap: 16,
              paddingVertical: 40,
            }}
          >
            <MaterialCommunityIcons
              name="account-clock"
              size={64}
              color={colors.primary}
            />
            <Text
              style={[
                styles.title,
                { color: colors.text },
              ]}
            >
              Cadastro Realizado!
            </Text>
            <Text
              style={[
                styles.description,
                { color: colors.textSecondary, fontSize: 15 },
              ]}
            >
              Seu cadastro foi enviado com sucesso. Aguarde a aprovação de um
              administrador para acessar o aplicativo.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => router.replace('/(auth)/login')}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Ir para o Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>Registre-se</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Para usar o aplicativo e necessario que voce se registre. Apos o
          registro, voce podera acessar todas as funcionalidades do aplicativo.
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Nome"
          onChangeText={(value) => setForm({ ...form, name: value })}
          value={form.name}
          autoCapitalize="words"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Email"
          onChangeText={(value) => setForm({ ...form, email: value })}
          value={form.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          Use pelo menos 6 caracteres
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Senha"
          secureTextEntry
          onChangeText={(value) => setForm({ ...form, password: value })}
          value={form.password}
          placeholderTextColor={colors.textSecondary}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Confirmar Senha"
          secureTextEntry
          onChangeText={(value) =>
            setForm({ ...form, password_confirmation: value })
          }
          value={form.password_confirmation}
          placeholderTextColor={colors.textSecondary}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          accessibilityRole="button"
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={{
              color: form.birthDate ? colors.text : colors.textSecondary,
            }}
          >
            {form.birthDate || 'Data de Nascimento'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={form.birthDate ? parseDate(form.birthDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <MaskedTextInput
          mask="(99) 99999-9999"
          placeholder="Telefone"
          keyboardType="phone-pad"
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          onChangeText={(text, raw) => setForm({ ...form, phone: raw })}
          value={form.phone}
          placeholderTextColor={colors.textSecondary}
        />

        <MaskedTextInput
          mask="999.999.999-99"
          placeholder="CPF"
          keyboardType="numeric"
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          onChangeText={(text, raw) => setForm({ ...form, cpf: raw })}
          value={form.cpf}
          maxLength={14}
          placeholderTextColor={colors.textSecondary}
        />

        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Sexo:</Text>
          <View style={styles.radioContainer}>
            {['M', 'F', 'O'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.radioButton,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.backgroundSecondary,
                  },
                  form.gender === gender && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => selectGender(gender)}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    { color: colors.textSecondary },
                    form.gender === gender && {
                      color: '#fff',
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  {gender === 'M'
                    ? 'Masculino'
                    : gender === 'F'
                      ? 'Feminino'
                      : 'Outro'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Profissao"
          onChangeText={(value) => setForm({ ...form, profession: value })}
          value={form.profession}
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Endereco"
          onChangeText={(value) => setForm({ ...form, address: value })}
          value={form.address}
          placeholderTextColor={colors.textSecondary}
        />

        <View
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              padding: 0,
            },
          ]}
        >
          <Picker
            selectedValue={form.gymId}
            onValueChange={(value) => setForm({ ...form, gymId: value })}
            style={{ color: colors.text }}
            dropdownIconColor={colors.textSecondary}
          >
            <Picker.Item
              label="Selecione a Academia *"
              value={null}
            />
            {gyms.map((gym) => (
              <Picker.Item key={gym.id} label={gym.name} value={gym.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            E Administrador:
          </Text>
          <View style={styles.radioContainer}>
            {['S', 'N'].map((isAdmin) => (
              <TouchableOpacity
                key={isAdmin}
                style={[
                  styles.radioButton,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.backgroundSecondary,
                  },
                  equalsIsAdmin(isAdmin) && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => selectIsAdmin(isAdmin)}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    { color: colors.textSecondary },
                    equalsIsAdmin(isAdmin) && {
                      color: '#fff',
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  {isAdmin === 'S' ? 'Sim' : 'Nao'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            E Personal Trainer:
          </Text>
          <View style={styles.radioContainer}>
            {['S', 'N'].map((isPersonal) => (
              <TouchableOpacity
                key={isPersonal}
                style={[
                  styles.radioButton,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.backgroundSecondary,
                  },
                  equalsIsPersonal(isPersonal) && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => selectIsPersonal(isPersonal)}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    { color: colors.textSecondary },
                    equalsIsPersonal(isPersonal) && {
                      color: '#fff',
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  {isPersonal === 'S' ? 'Sim' : 'Nao'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleRegister}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>

        <Link
          href="/(auth)/login"
          style={[styles.link, { color: colors.primary }]}
        >
          Ja estou cadastrado
        </Link>
      </ScrollView>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingVertical: 20,
    gap: 14,
    alignItems: 'stretch',
  },
  input: {
    fontSize: 14,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    marginBottom: -8,
    marginTop: -8,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    elevation: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    padding: 15,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  radioButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  radioButtonText: {
    fontSize: 14,
  },
})
