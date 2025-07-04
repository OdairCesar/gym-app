import { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
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
        <ActivityIndicator size="large" color="#0a84ff" />
        <Text style={{ marginTop: 8 }}>Carregando treinos...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity onPress={fetchTrainings} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: '/trainingExercise',
                  params: { id: item._id },
                })
              }
            >
              <Text style={styles.buttonText}>Treinar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
    borderWidth: 1,
    borderColor: '#ddd',
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
  button: {
    marginTop: 12,
    backgroundColor: '#0a84ff',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#d9534f', // vermelho suave, evoca erro mas sem ser agressivo
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    color: '#0a84ff', // azul vibrante para chamar atenção
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#eef6ff',
    borderRadius: 6,
  },
})
