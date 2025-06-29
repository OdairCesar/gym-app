import React, { useState } from 'react'
import {
  TextInput,
  Alert,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native'
import { useRouter, Link } from 'expo-router'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { MaskedTextInput } from 'react-native-mask-text'

import { useAuth } from '@/context/authContext'
import { formatDate } from '@/utils/formatDate'

export default function Register() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    password: '',
    dataNascimento: '',
    telefone: '',
    cpf: '',
    sexo: '',
    profissao: '',
    endereco: '',
    isAdmin: false,
    isActive: true,
  })
  const router = useRouter()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { login } = useAuth()

  const register = async () => {
    try {
      const response = await fetch(
        'https://gym-api-24p5.onrender.com/api/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      )

      const data = await response.json()

      if (!data.status || data.status === 'error') {
        Alert.alert('Erro', data.error || data.message || 'Erro ao registrar')
        return
      }

      if (data.status === 'success') {
        await login(data.data.token, data.data.user)
        router.push('/(client)/training')
      }
    } catch (err) {
      Alert.alert('Erro', 'Erro de rede')
    }
  }

  const selectSexo = (value: string) => setForm({ ...form, sexo: value })
  const selectIsAdmin = (value: string) =>
    setForm({ ...form, isAdmin: value === 'S' })
  const equalsIsAdmin = (value: string) => form.isAdmin === (value === 'S')

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
      setForm({ ...form, dataNascimento: formatDate(selectedDate) })
    }
    setShowDatePicker(false)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registre-se</Text>
        <Text style={styles.description}>
          Para usar o aplicativo é necessário que você se registre. Após o
          registro, você poderá acessar todas as funcionalidades do aplicativo.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          onChangeText={(value) => setForm({ ...form, nome: value })}
          value={form.nome}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(value) => setForm({ ...form, email: value })}
          value={form.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.hint}>Use pelo menos 6 caracteres</Text>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          onChangeText={(value) => setForm({ ...form, password: value })}
          value={form.password}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          accessibilityRole="button"
          style={styles.input}
        >
          <Text style={{ color: form.dataNascimento ? '#000' : '#aaa' }}>
            {form.dataNascimento || 'Data de Nascimento'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={
              form.dataNascimento ? parseDate(form.dataNascimento) : new Date()
            }
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
          style={styles.input}
          onChangeText={(text, raw) => setForm({ ...form, telefone: raw })}
          value={form.telefone}
        />

        <MaskedTextInput
          mask="999.999.999-99"
          placeholder="CPF"
          keyboardType="numeric"
          style={styles.input}
          onChangeText={(text, raw) => setForm({ ...form, cpf: raw })}
          value={form.cpf}
          maxLength={14}
        />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Sexo:</Text>
          <View style={styles.radioContainer}>
            {['M', 'F', 'O'].map((sexo) => (
              <TouchableOpacity
                key={sexo}
                style={[
                  styles.radioButton,
                  form.sexo === sexo && styles.radioButtonSelected,
                ]}
                onPress={() => selectSexo(sexo)}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    form.sexo === sexo && styles.radioButtonTextSelected,
                  ]}
                >
                  {sexo === 'M'
                    ? 'Masculino'
                    : sexo === 'F'
                      ? 'Feminino'
                      : 'Outro'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Profissão"
          onChangeText={(value) => setForm({ ...form, profissao: value })}
          value={form.profissao}
        />
        <TextInput
          style={styles.input}
          placeholder="Endereço"
          onChangeText={(value) => setForm({ ...form, endereco: value })}
          value={form.endereco}
        />

        <View style={styles.labelContainer}>
          <Text style={styles.label}>É Administrador:</Text>
          <View style={styles.radioContainer}>
            {['S', 'N'].map((isAdmin) => (
              <TouchableOpacity
                key={isAdmin}
                style={[
                  styles.radioButton,
                  equalsIsAdmin(isAdmin) && styles.radioButtonSelected,
                ]}
                onPress={() => selectIsAdmin(isAdmin)}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    equalsIsAdmin(isAdmin) && styles.radioButtonTextSelected,
                  ]}
                >
                  {isAdmin === 'S' ? 'Sim' : 'Não'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={register}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>

        <Link href="/(auth)/login" style={styles.link}>
          Já estou cadastrado
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    gap: 14,
    alignItems: 'stretch',
  },
  input: {
    fontSize: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginBottom: -8,
    marginTop: -8,
  },
  button: {
    backgroundColor: '#007bff',
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
    color: '#007bff',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  radioButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  radioButtonText: {
    fontSize: 14,
    color: '#555',
  },
  radioButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
