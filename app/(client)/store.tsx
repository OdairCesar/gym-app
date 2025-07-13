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
import { useAppTheme } from '@/hooks/useAppTheme'
import { Product } from '@/interfaces/Product'
import { ProductCard } from '@/components/common/ProductCard'

export default function StoreScreen() {
  const { products, loading, fetchProducts } = useProducts()
  const { colors } = useAppTheme()
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
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Carregando produtos...
        </Text>
      </View>
    )
  }

  if (products.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <MaterialIcons name="store" size={48} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.text }]}>
          Nenhum produto encontrado
        </Text>
        <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
          Produtos estarão disponíveis em breve!
        </Text>
      </View>
    )
  }

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} onBuy={handleBuyProduct} />
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
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
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
})
