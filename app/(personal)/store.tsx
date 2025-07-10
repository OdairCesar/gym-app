import { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

import { useProducts } from '@/hooks/useProducts'
import { Product } from '@/interfaces/Product'
import { ProductCard } from '@/components/ProductCard'

export default function StoreScreen() {
  const { products, loading, fetchProducts } = useProducts()
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchProducts()
    setRefreshing(false)
  }

  const handleBuyProduct = (product: Product) => {
    Alert.alert('Produto Selecionado', `Você selecionou: ${product.nome}`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Comprar', onPress: () => console.log('Comprar produto') },
    ])
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
