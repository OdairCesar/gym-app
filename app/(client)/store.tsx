import { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native'
import { useFocusEffect } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

import { useProducts } from '@/hooks/useProducts'
import { useAppTheme } from '@/hooks/useAppTheme'
import { useGyms } from '@/hooks/useGyms'
import { ProductCard } from '@/components/common/ProductCard'

export default function StoreScreen() {
  const { products, loading, fetchProducts } = useProducts()
  const { colors } = useAppTheme()
  const { gyms, fetchGyms } = useGyms()
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const gymPhone = gyms[0]?.phone

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchProducts(), fetchGyms()])
    setRefreshing(false)
  }

  useEffect(() => {
    fetchProducts()
    fetchGyms()
  }, [fetchProducts, fetchGyms])

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
      fetchGyms()
    }, [fetchProducts, fetchGyms]),
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard product={item} gymPhone={gymPhone} />
        )}
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
