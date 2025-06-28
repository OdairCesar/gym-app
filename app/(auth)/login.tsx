import React, { useState } from 'react'
import { TextInput, StyleSheet, Button, View, Alert } from 'react-native'
import { useRouter, Link } from 'expo-router'

import { useAuth } from '@/context/authContext'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://192.168.1.86:8844/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!data.status) {
        Alert.alert('Erro', 'Erro ao logar')
        return
      }

      if (data.status === 'error') {
        Alert.alert('Erro', data.message || 'Erro ao logar')
        return
      }

      if (data.status === 'success') {
        await login(data.data.token, data.data.user)
        router.push('/(client)/training') // Após o registro, navega para a tela de login
      }
    } catch (err) {
      Alert.alert('Erro', 'Erro de rede')
    }
  }

  return (
    <View style={styles.container} onStartShouldSetResponder={() => true}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        autoCapitalize="none"
        onChangeText={setPassword}
      />
      <Button title="Entrar" onPress={handleLogin} />
      <Link style={styles.link} href="/(auth)/register">
        Não tem uma conta? Registre-se
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    gap: 16,
    paddingBlock: 0,
    paddingHorizontal: 28,
  },
  input: {
    padding: 8,
    margin: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 12,
    color: 'blue',
  },
})
