import { useState, useCallback } from 'react'
import { Product } from '@/interfaces/Product'
import { productService } from '@/services/productService'
import { useApi } from './useApi'
import { ENV } from '@/constants/environment'
import { extractList } from '@/utils/apiUtils'

interface UseProductsReturn {
  products: Product[]
  loading: boolean

  fetchProducts: () => Promise<void>
  createProduct: (productData: Partial<Product>) => Promise<boolean>
  updateProduct: (
    productId: number,
    productData: Partial<Product>,
  ) => Promise<boolean>
  deleteProduct: (productId: number) => Promise<boolean>
  updateStock: (productId: number, stock: number) => Promise<boolean>
  refreshProducts: () => Promise<void>

  getProductById: (productId: number) => Product | undefined
  filterProducts: (filters: {
    name?: string
    category?: string
    price?: { min?: number; max?: number }
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
        { showErrorAlert: true, errorMessage: 'Falha ao carregar produtos' },
      )
      if (result) setProducts(extractList<Product>(result))
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
          showSuccessAlert: ENV.showSuccessAlerts,
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
      productId: number,
      productData: Partial<Product>,
    ): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => productService.updateProduct(productId, productData, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
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
    async (productId: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => productService.deleteProduct(productId, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Produto deletado com sucesso',
          errorMessage: 'Falha ao deletar produto',
        },
      )
      if (result !== null) {
        await fetchProducts()
        return true
      }
      return false
    },
    [executeWithAuth, fetchProducts],
  )

  const updateStock = useCallback(
    async (productId: number, stock: number): Promise<boolean> => {
      const result = await executeWithAuth(
        (token) => productService.updateStock(productId, stock, token),
        {
          showSuccessAlert: ENV.showSuccessAlerts,
          successMessage: 'Estoque atualizado com sucesso',
          errorMessage: 'Falha ao atualizar estoque',
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

  const getProductById = useCallback(
    (productId: number): Product | undefined => {
      return products.find((p) => p.id === productId)
    },
    [products],
  )

  const filterProducts = useCallback(
    (filters: {
      name?: string
      category?: string
      price?: { min?: number; max?: number }
    }): Product[] => {
      return productService.filterProducts(products, filters)
    },
    [products],
  )

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    refreshProducts,
    getProductById,
    filterProducts,
  }
}
