import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl, StyleSheet } from 'react-native'
import { useAuth } from '@/context/authContext'
import { Product } from '@/interfaces/Product'
import { API_ENDPOINTS, buildApiUrl } from '@/constants/api'
import ProductCard from '@/components/admin/ProductCard'
import GenericFormModal, {
  FormField,
} from '@/components/common/GenericFormModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'

interface FilterState {
  nome: string
  categoria: string
  preco: string
  estoque: string
  ativo: string
}

export default function ProductsScreen() {
  const { getToken } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState<Partial<Product>>({
    nome: '',
    descricao: '',
    preco: 0,
    categoria: '',
    estoque: 0,
    imagem: '',
    ativo: true,
  })

  const [filters, setFilters] = useState<FilterState>({
    nome: '',
    categoria: '',
    preco: '',
    estoque: '',
    ativo: '',
  })

  const fetchProducts = useCallback(async () => {
    try {
      const token = await getToken()

      const response = await fetch(buildApiUrl(API_ENDPOINTS.PRODUCT), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const json = await response.json()
        const productsData = json.data || json
        setProducts(productsData)
        setFilteredProducts(productsData)
      } else {
        Alert.alert('Erro', 'Falha ao carregar produtos')
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão')
    } finally {
      setRefreshing(false)
    }
  }, [getToken])

  const applyFilters = useCallback(() => {
    let filtered = [...products]

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((product) => {
          const productValue = product[key as keyof Product]

          if (key === 'ativo') {
            return productValue?.toString() === value
          }

          if (key === 'preco' || key === 'estoque') {
            const numValue = parseFloat(value)
            if (isNaN(numValue)) return true
            return (productValue as number) >= numValue
          }

          return productValue
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        })
      }
    })

    setFilteredProducts(filtered)
    setFilterModalVisible(false)
  }, [products, filters])

  const clearFilters = () => {
    setFilters({
      nome: '',
      categoria: '',
      preco: '',
      estoque: '',
      ativo: '',
    })
    setFilteredProducts(products)
  }

  const handleFormChange = (key: string, value: string | boolean) => {
    if (key === 'preco' || key === 'estoque') {
      const numValue =
        typeof value === 'string' ? parseFloat(value) || 0 : value
      setFormData({ ...formData, [key]: numValue })
    } else {
      setFormData({ ...formData, [key]: value })
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: 0,
      categoria: '',
      estoque: 0,
      imagem: '',
      ativo: true,
    })
    setEditingProduct(null)
  }

  const saveProduct = async () => {
    try {
      const token = await getToken()
      const url = editingProduct
        ? buildApiUrl(`${API_ENDPOINTS.PRODUCT}/${editingProduct._id}`)
        : buildApiUrl(API_ENDPOINTS.PRODUCT)

      const method = editingProduct ? 'PUT' : 'POST'

      const productData = { ...formData }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        Alert.alert('Erro', errorData.message || 'Falha ao salvar produto')
        return
      }

      Alert.alert(
        'Sucesso',
        `Produto ${editingProduct ? 'atualizado' : 'criado'} com sucesso`,
      )
      setModalVisible(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão')
    }
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco,
      categoria: product.categoria,
      estoque: product.estoque,
      imagem: product.imagem,
      ativo: product.ativo,
    })
    setModalVisible(true)
  }

  const deleteProduct = async (productId: string) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await getToken()
            const response = await fetch(
              buildApiUrl(`${API_ENDPOINTS.PRODUCT}/${productId}`),
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )

            if (response.ok) {
              Alert.alert('Sucesso', 'Produto deletado com sucesso')
              fetchProducts()
            } else {
              Alert.alert('Erro', 'Falha ao deletar produto')
            }
          } catch (error) {
            Alert.alert('Erro', 'Erro de conexão')
          }
        },
      },
    ])
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const onRefresh = () => {
    setRefreshing(true)
    fetchProducts()
  }

  const productFilterFields: FilterField[] = [
    {
      key: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Filtrar por nome',
      value: filters.nome,
    },
    {
      key: 'categoria',
      label: 'Categoria',
      type: 'text',
      placeholder: 'Filtrar por categoria',
      value: filters.categoria,
    },
    {
      key: 'preco',
      label: 'Preço mínimo',
      type: 'text',
      placeholder: 'Ex: 10.00',
      value: filters.preco,
    },
    {
      key: 'estoque',
      label: 'Estoque mínimo',
      type: 'text',
      placeholder: 'Ex: 5',
      value: filters.estoque,
    },
    {
      key: 'ativo',
      label: 'Status',
      type: 'select',
      placeholder: 'Todos os status...',
      value: filters.ativo,
      options: [
        { label: 'Ativo', value: 'true' },
        { label: 'Inativo', value: 'false' },
      ],
    },
  ]

  const productFormFields: FormField[] = [
    {
      key: 'nome',
      label: 'Nome do Produto',
      type: 'text',
      placeholder: 'Digite o nome do produto',
      required: true,
      value: formData.nome || '',
    },
    {
      key: 'descricao',
      label: 'Descrição',
      type: 'multiline',
      placeholder: 'Digite a descrição do produto',
      required: true,
      value: formData.descricao || '',
      multiline: true,
    },
    {
      key: 'categoria',
      label: 'Categoria',
      type: 'select',
      placeholder: 'Selecione uma categoria...',
      required: true,
      value: formData.categoria || '',
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
      key: 'preco',
      label: 'Preço (R$)',
      type: 'number',
      placeholder: 'Ex: 29.90',
      required: true,
      value: formData.preco?.toString() || '0',
      keyboardType: 'numeric',
    },
    {
      key: 'estoque',
      label: 'Quantidade em Estoque',
      type: 'number',
      placeholder: 'Ex: 100',
      required: true,
      value: formData.estoque?.toString() || '0',
      keyboardType: 'numeric',
    },
    {
      key: 'imagem',
      label: 'URL da Imagem (opcional)',
      type: 'text',
      placeholder: 'https://...',
      value: formData.imagem || '',
    },
    {
      key: 'ativo',
      label: 'Status',
      type: 'checkbox',
      value: formData.ativo || false,
    },
  ]

  const headerButtons: HeaderButton[] = [
    {
      icon: 'filter',
      onPress: () => setFilterModalVisible(true),
      color: '#007AFF',
    },
    {
      icon: 'plus',
      onPress: () => {
        resetForm()
        setModalVisible(true)
      },
      color: '#007AFF',
    },
  ]

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onEdit={openEditModal}
      onDelete={deleteProduct}
    />
  )

  return (
    <View style={styles.container}>
      <PageHeader title="Gerenciar Produtos" buttons={headerButtons} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        showsVerticalScrollIndicator={false}
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
        onFilterChange={handleFilterChange}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
})
