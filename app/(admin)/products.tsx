import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl } from 'react-native'
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
import { GlobalStyles, Colors } from '@/styles/globalStyles'

interface FilterState {
  nome: string
  categoria: string
  preco: string
  estoque: string
  ativo: string
}

export default function ProductsScreen() {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct: deleteProductHook,
    filterProducts,
  } = useProducts()

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

  const applyFilters = useCallback(() => {
    const filtered = filterProducts({
      nome: filters.nome,
      categoria: filters.categoria,
      preco: filters.preco ? { min: parseFloat(filters.preco) } : undefined,
    })

    // Aplicar filtros adicionais manualmente para estoque e ativo
    let finalFiltered = [...filtered]

    if (filters.estoque) {
      const minStock = parseFloat(filters.estoque)
      if (!isNaN(minStock)) {
        finalFiltered = finalFiltered.filter(
          (product) => product.estoque >= minStock,
        )
      }
    }

    if (filters.ativo) {
      finalFiltered = finalFiltered.filter(
        (product) => product.ativo?.toString() === filters.ativo,
      )
    }

    setFilteredProducts(finalFiltered)
    setFilterModalVisible(false)
  }, [filters, filterProducts])

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
      const success = editingProduct
        ? await updateProduct(editingProduct._id, formData)
        : await createProduct(formData)

      if (success) {
        setModalVisible(false)
        resetForm()
        // Atualizar produtos na tela
        await fetchProducts()
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
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

  const handleDeleteProduct = async (productId: string) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este produto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            const success = await deleteProductHook(productId)
            if (success) {
              // Atualizar produtos na tela
              await fetchProducts()
            }
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

  // Atualizar produtos filtrados quando a lista de produtos mudar
  useEffect(() => {
    setFilteredProducts(products)
  }, [products])

  const onRefresh = () => {
    setRefreshing(true)
    fetchProducts().finally(() => setRefreshing(false))
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
      color: Colors.primary,
    },
    {
      icon: 'plus',
      onPress: () => {
        resetForm()
        setModalVisible(true)
      },
      color: Colors.primary,
    },
  ]

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onEdit={openEditModal}
      onDelete={handleDeleteProduct}
    />
  )

  return (
    <View style={GlobalStyles.container}>
      <PageHeader title="Gerenciar Produtos" buttons={headerButtons} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProductItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={GlobalStyles.list}
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
