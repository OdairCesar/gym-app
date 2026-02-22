import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  FlatList,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native'
import { useProducts } from '@/hooks/useProducts'
import { Product } from '@/interfaces/Product'
import ProductCard from '@/components/admin/ProductCard'
import GenericFormModal, {
  FormField,
} from '@/components/common/GenericFormModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import { useAppTheme } from '@/hooks/useAppTheme'

interface FilterState {
  name: string
  category: string
  price: string
  stock: string
  published: string
}

export default function ProductsScreen() {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct: deleteProductHook,
    updateStock,
    filterProducts,
  } = useProducts()

  const { colors } = useAppTheme()

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image_link: '',
    code: '',
    published: true,
  })

  const [filters, setFilters] = useState<FilterState>({
    name: '',
    category: '',
    price: '',
    stock: '',
    published: '',
  })

  const applyFilters = useCallback(() => {
    let filtered = filterProducts({
      name: filters.name,
      category: filters.category,
      price: filters.price ? { min: parseFloat(filters.price) } : undefined,
    })

    if (filters.stock) {
      const minStock = parseFloat(filters.stock)
      if (!isNaN(minStock)) {
        filtered = filtered.filter((p) => p.stock >= minStock)
      }
    }

    if (filters.published !== '') {
      filtered = filtered.filter(
        (p) => p.published.toString() === filters.published,
      )
    }

    setFilteredProducts(filtered)
    setFilterModalVisible(false)
  }, [filters, filterProducts])

  const clearFilters = () => {
    setFilters({ name: '', category: '', price: '', stock: '', published: '' })
    setFilteredProducts(products)
  }

  const handleFormChange = (key: string, value: string | boolean) => {
    if (key === 'price' || key === 'stock') {
      const numValue =
        typeof value === 'string' ? parseFloat(value) || 0 : value
      setFormData((prev) => ({ ...prev, [key]: numValue }))
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      image_link: '',
      code: '',
      published: true,
    })
    setEditingProduct(null)
  }

  const saveProduct = async () => {
    try {
      const success = editingProduct
        ? await updateProduct(editingProduct.id, formData)
        : await createProduct(formData)

      if (success) {
        setModalVisible(false)
        resetForm()
        await fetchProducts()
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
    }
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_link: product.image_link ?? '',
      code: product.code,
      published: product.published,
    })
    setModalVisible(true)
  }

  const handleDeleteProduct = async (productId: number) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProductHook(productId)
            await fetchProducts()
          } catch (error) {
            console.error('Erro ao deletar produto:', error)
          }
        },
      },
    ])
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  const onRefresh = () => {
    setRefreshing(true)
    fetchProducts().finally(() => setRefreshing(false))
  }

  const productFilterFields: FilterField[] = [
    {
      key: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Filtrar por nome',
      value: filters.name,
    },
    {
      key: 'category',
      label: 'Categoria',
      type: 'text',
      placeholder: 'Filtrar por categoria',
      value: filters.category,
    },
    {
      key: 'price',
      label: 'Preço mínimo',
      type: 'text',
      placeholder: 'Ex: 10.00',
      value: filters.price,
    },
    {
      key: 'stock',
      label: 'Estoque mínimo',
      type: 'text',
      placeholder: 'Ex: 5',
      value: filters.stock,
    },
    {
      key: 'published',
      label: 'Status',
      type: 'select',
      placeholder: 'Todos os status...',
      value: filters.published,
      options: [
        { label: 'Ativo', value: 'true' },
        { label: 'Inativo', value: 'false' },
      ],
    },
  ]

  const productFormFields: FormField[] = [
    {
      key: 'name',
      label: 'Nome do Produto',
      type: 'text',
      placeholder: 'Nome do produto',
      required: true,
      value: formData.name || '',
    },
    {
      key: 'description',
      label: 'Descrição',
      type: 'multiline',
      placeholder: 'Descrição do produto',
      required: true,
      value: formData.description || '',
      multiline: true,
    },
    {
      key: 'category',
      label: 'Categoria',
      type: 'select',
      placeholder: 'Selecione uma categoria...',
      required: true,
      value: formData.category || '',
      options: [
        { label: 'Suplementos', value: 'suplementos' },
        { label: 'Equipamentos', value: 'equipamentos' },
        { label: 'Roupas', value: 'roupas' },
        { label: 'Acessórios', value: 'acessorios' },
        { label: 'Bebidas', value: 'bebidas' },
        { label: 'Outros', value: 'outros' },
      ],
    },
    {
      key: 'price',
      label: 'Preço (R$)',
      type: 'number',
      placeholder: 'Ex: 29.90',
      required: true,
      value: formData.price?.toString() || '0',
      keyboardType: 'numeric',
    },
    {
      key: 'stock',
      label: 'Estoque',
      type: 'number',
      placeholder: 'Ex: 100',
      required: true,
      value: formData.stock?.toString() || '0',
      keyboardType: 'numeric',
    },
    {
      key: 'code',
      label: 'Código',
      type: 'text',
      placeholder: 'Código do produto',
      value: formData.code || '',
    },
    {
      key: 'image_link',
      label: 'URL da Imagem (opcional)',
      type: 'text',
      placeholder: 'https://...',
      value: formData.image_link || '',
    },
    {
      key: 'published',
      label: 'Publicado',
      type: 'checkbox',
      value: formData.published ?? true,
    },
  ]

  const headerButtons: HeaderButton[] = [
    {
      icon: 'filter-outline',
      onPress: () => setFilterModalVisible(true),
    },
    {
      icon: 'plus',
      onPress: () => {
        resetForm()
        setModalVisible(true)
      },
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PageHeader title="Gerenciar Produtos" buttons={headerButtons} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onEdit={openEditModal}
            onDelete={handleDeleteProduct}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: 'center',
              marginTop: 40,
              color: colors.textSecondary,
            }}
          >
            Nenhum produto encontrado.
          </Text>
        }
      />

      <GenericFormModal
        visible={modalVisible}
        title={editingProduct ? 'Editar Produto' : 'Novo Produto'}
        fields={productFormFields}
        onClose={() => {
          setModalVisible(false)
          resetForm()
        }}
        onSave={saveProduct}
        onFieldChange={handleFormChange}
      />

      <GenericFilterModal
        visible={filterModalVisible}
        title="Filtrar Produtos"
        fields={productFilterFields}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 32,
  },
})
