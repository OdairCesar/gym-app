import { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

import { useAuth } from '@/context/authContext'
import { Product } from '@/interfaces/Product'
import { ProductCard } from '@/components/ProductCard'
import { buildApiUrl, API_ENDPOINTS } from '@/constants/api'

export default function StoreScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const { getToken } = useAuth()

  const fetchProducts = useCallback(async () => {
    const token = await getToken()

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(buildApiUrl(API_ENDPOINTS.PRODUCT), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!data.status) {
        setError('Erro ao carregar os produtos.')
        return
      }

      if (data.status === 'error') {
        setError(data.message || 'Erro ao carregar os produtos.')
        return
      }

      if (data.status === 'success') {
        setProducts(data.data || [])
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Erro desconhecido ao carregar os produtos.')
      }
    } finally {
      setLoading(false)
    }
  }, [getToken])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchProducts()
    setRefreshing(false)
  }

  const handleBuyProduct = (product: Product) => {
    // Aqui você pode implementar a lógica de compra
    Alert.alert('Sucesso', `${product.nome} adicionado ao carrinho!`)
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, [fetchProducts]),
  )

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0a84ff" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={48} color="#d9534f" />
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity onPress={fetchProducts} style={styles.retryButton}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (products.length === 0) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="store" size={48} color="#999" />
        <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
        <Text style={styles.emptySubText}>
          Produtos estarão disponíveis em breve!
        </Text>
      </View>
    )
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} onBuy={handleBuyProduct} />
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#d9534f',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 12,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#0a84ff',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
})
