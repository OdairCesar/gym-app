import React, { useState } from 'react'
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
import { Link } from 'expo-router'
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { MaskedTextInput } from 'react-native-mask-text'

import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/utils/formatDate'
import { useAppTheme } from '@/hooks/useAppTheme'

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
    isPersonal: false,
    isActive: true,
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { register } = useAuth()
  const { colors } = useAppTheme()

  const handleRegister = async () => {
    if (!form.nome || !form.email || !form.password) {
      return
    }

    // Converter dataNascimento para Date se existir
    const userData = {
      ...form,
      dataNascimento: form.dataNascimento
        ? parseDate(form.dataNascimento)
        : undefined,
      sexo: form.sexo as 'M' | 'F' | 'O' | undefined,
    }

    await register(userData)
  }

  const selectSexo = (value: string) => setForm({ ...form, sexo: value })
  const selectIsAdmin = (value: string) =>
    setForm({ ...form, isAdmin: value === 'S' })
  const selectIsPersonal = (value: string) =>
    setForm({ ...form, isPersonal: value === 'S' })
  const equalsIsAdmin = (value: string) => form.isAdmin === (value === 'S')
  const equalsIsPersonal = (value: string) =>
    form.isPersonal === (value === 'S')

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
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.text }]}>Registre-se</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Para usar o aplicativo é necessário que você se registre. Após o
          registro, você poderá acessar todas as funcionalidades do aplicativo.
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
          onChangeText={(value) => setForm({ ...form, nome: value })}
          value={form.nome}
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
              color: form.dataNascimento ? colors.text : colors.textSecondary,
            }}
          >
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
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          onChangeText={(text, raw) => setForm({ ...form, telefone: raw })}
          value={form.telefone}
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
            {['M', 'F', 'O'].map((sexo) => (
              <TouchableOpacity
                key={sexo}
                style={[
                  styles.radioButton,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.backgroundSecondary,
                  },
                  form.sexo === sexo && {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => selectSexo(sexo)}
                activeOpacity={0.8}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.radioButtonText,
                    { color: colors.textSecondary },
                    form.sexo === sexo && { color: '#fff', fontWeight: 'bold' },
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
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Profissão"
          onChangeText={(value) => setForm({ ...form, profissao: value })}
          value={form.profissao}
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
          placeholder="Endereço"
          onChangeText={(value) => setForm({ ...form, endereco: value })}
          value={form.endereco}
          placeholderTextColor={colors.textSecondary}
        />

        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            É Administrador:
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
                  {isAdmin === 'S' ? 'Sim' : 'Não'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            É Personal Trainer:
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
                  {isPersonal === 'S' ? 'Sim' : 'Não'}
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
          Já estou cadastrado
        </Link>
      </ScrollView>
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
