import { useState, useCallback } from 'react'
import { Product } from '@/interfaces/Product'
import { productService } from '@/services/productService'
import { useApi } from './useApi'

interface UseProductsReturn {
  // Estados
  products: Product[]
  loading: boolean

  // Funções
  fetchProducts: () => Promise<void>
  createProduct: (productData: Partial<Product>) => Promise<boolean>
  updateProduct: (
    productId: string,
    productData: Partial<Product>,
  ) => Promise<boolean>
  deleteProduct: (productId: string) => Promise<boolean>
  refreshProducts: () => Promise<void>

  // Utilitários
  getProductById: (productId: string) => Product | undefined
  filterProducts: (filters: {
    nome?: string
    categoria?: string
    preco?: { min?: number; max?: number }
  }) => Product[]
}

export const useProducts = (): UseProductsReturn => {
  const { executeWithAuth } = useApi()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const result = await executeWithAuth(
        (token) => productService.fetchProducts(token),
        {
          showErrorAlert: true,
          errorMessage: 'Falha ao carregar produtos',
        },
      )

      if (result) {
        setProducts(result)
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }, [executeWithAuth])

  const createProduct = useCallback(
    async (productData: Partial<Product>): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => productService.createProduct(productData, token),
        {
          showSuccessAlert: true,
          successMessage: 'Produto criado com sucesso',
          errorMessage: 'Falha ao criar produto',
        },
      )

      if (result) {
        await fetchProducts()
        return true
      }

      return false
    },
    [executeWithAuth, fetchProducts],
  )

  const updateProduct = useCallback(
    async (
      productId: string,
      productData: Partial<Product>,
    ): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => productService.updateProduct(productId, productData, token),
        {
          showSuccessAlert: true,
          successMessage: 'Produto atualizado com sucesso',
          errorMessage: 'Falha ao atualizar produto',
        },
      )

      if (result) {
        await fetchProducts()
        return true
      }

      return false
    },
    [executeWithAuth, fetchProducts],
  )

  const deleteProduct = useCallback(
    async (productId: string): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => productService.deleteProduct(productId, token),
        {
          showSuccessAlert: true,
          successMessage: 'Produto deletado com sucesso',
          errorMessage: 'Falha ao deletar produto',
        },
      )

      if (result) {
        await fetchProducts()
        return true
      }

      return false
    },
    [executeWithAuth, fetchProducts],
  )

  const refreshProducts = useCallback(async () => {
    await fetchProducts()
  }, [fetchProducts])

  // Funções utilitárias
  const getProductById = useCallback(
    (productId: string): Product | undefined => {
      return productService.getProductByIdLocal(products, productId)
    },
    [products],
  )

  const filterProducts = useCallback(
    (filters: {
      nome?: string
      categoria?: string
      preco?: { min?: number; max?: number }
    }): Product[] => {
      return productService.filterProducts(products, filters)
    },
    [products],
  )

  return {
    // Estados
    products,
    loading,

    // Funções
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,

    // Utilitários
    getProductById,
    filterProducts,
  }
}
