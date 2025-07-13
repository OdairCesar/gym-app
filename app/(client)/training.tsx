import { useCallback, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'

import { useTrainings } from '@/hooks/useTrainings'
import { useAppTheme } from '@/hooks/useAppTheme'
import { Training } from '@/interfaces/Training'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function TrainingScreen() {
  const { fetchUserTraining, loading } = useTrainings()
  const { colors } = useAppTheme()
  const [userTrainings, setUserTrainings] = useState<Training[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const loadUserTrainings = useCallback(async () => {
    try {
      setError(null)
      const result = await fetchUserTraining()
      if (result) {
        // Se result for um array, usa diretamente, senão coloca em array
        setUserTrainings(Array.isArray(result) ? result : [result])
      } else {
        setUserTrainings([])
      }
    } catch (err) {
      console.error('Erro ao carregar treinos:', err)
      setError('Erro ao carregar treinos')
    }
  }, [fetchUserTraining])

  useFocusEffect(
    useCallback(() => {
      loadUserTrainings()
    }, [loadUserTrainings]),
  )

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 8, color: colors.text }}>
          Carregando treinos...
        </Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <MaterialCommunityIcons
          name="dumbbell"
          size={48}
          color={colors.error}
        />
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          onPress={loadUserTrainings}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (userTrainings.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Nenhum treino encontrado.</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        style={{ padding: 20 }}
        data={userTrainings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              {item.nome}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Coach: {item.treinador}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Criado em: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              Atualizado em: {new Date(item.updatedAt).toLocaleDateString()}
            </Text>
            <Text style={[styles.info, { color: colors.textSecondary }]}>
              ID: {item._id}
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
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
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
  info: {
    position: 'absolute',
    right: 10,
    top: 5,
    fontSize: 10,
    marginTop: 8,
    textAlign: 'right',
  },
  button: {
    marginTop: 12,
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
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
})
