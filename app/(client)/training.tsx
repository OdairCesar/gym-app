import { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'

import { useAuth } from '@/context/authContext'
import { Training } from '@/interfaces/Training'

export default function TrainingScreen() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchTrainings()
  }, [])

  const fetchTrainings = async () => {
    const token = await getToken()

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `https://gym-api-24p5.onrender.com/api/training`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Adicione o token de autenticação se necessário
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json()

      if (!data.status) {
        setError('Erro ao carregar os treinos.')
        return
      }

      if (data.status === 'error') {
        setError(data.message || 'Erro ao carregar os treinos.')
        return
      }

      if (data.status === 'success') setTrainings(data.data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro desconhecido ao carregar os treinos.')
      }
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTrainings()
    }, []),
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Erro: {error}</Text>
      </View>
    )
  }

  if (trainings.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Nenhum treino encontrado.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ padding: 20 }}
        data={trainings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.nome}</Text>
            <Text style={styles.description}>Coach: {item.treinador}</Text>
            <Text style={styles.description}>
              Criado em: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.description}>
              Atualizado em: {new Date(item.updatedAt).toLocaleDateString()}
            </Text>
            <Text style={styles.info}>ID: {item._id}</Text>
            <Button
              title="Treinar"
              onPress={() =>
                router.push({
                  pathname: '/trainingExercise',
                  params: { id: item._id },
                })
              }
            />
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBlock: 32,
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 16,
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    color: '#555',
  },
  info: {
    position: 'absolute',
    right: 10,
    top: 5,
    fontSize: 10,
    marginTop: 8,
    color: '#eee',
    textAlign: 'right',
  },
})
