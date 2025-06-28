import React, { useState } from 'react'
import {
  TextInput,
  Button,
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

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
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
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          onChangeText={(value) => setForm({ ...form, password: value })}
          value={form.password}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
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

        <View>
          <Text style={styles.radioText}>Sexo:</Text>
          <View style={styles.radioGroup}>
            {['M', 'F', 'O'].map((sexo) => (
              <TouchableOpacity
                key={sexo}
                style={styles.radioOption}
                onPress={() => selectSexo(sexo)}
              >
                <View style={styles.radioCircle}>
                  {form.sexo === sexo && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioLabel}>
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

        <View>
          <Text style={styles.radioText}>É Administrador:</Text>
          <View style={styles.radioGroup}>
            {['S', 'N'].map((isAdmin) => (
              <TouchableOpacity
                key={isAdmin}
                style={styles.radioOption}
                onPress={() => selectIsAdmin(isAdmin)}
              >
                <View style={styles.radioCircle}>
                  {equalsIsAdmin(isAdmin) && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioLabel}>
                  {isAdmin === 'S' ? 'Sim' : 'Não'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button title="Registrar" onPress={register} />
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
    paddingVertical: 50,
    gap: 14,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  input: {
    fontSize: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 12,
    color: 'blue',
    textAlign: 'center',
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
  radioGroup: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 12,
  },
  radioText: {
    fontSize: 12,
  },
})
