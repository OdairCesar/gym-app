import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Product } from '@/interfaces/Product'

export class ProductService {
  async fetchProducts(token: string): Promise<ApiResponse<Product[]>> {
    return apiService.get<Product[]>(API_ENDPOINTS.PRODUCT, token)
  }

  async createProduct(
    productData: Partial<Product>,
    token: string,
  ): Promise<ApiResponse<Product>> {
    return apiService.post<Product>(API_ENDPOINTS.PRODUCT, productData, token)
  }

  async updateProduct(
    productId: string,
    productData: Partial<Product>,
    token: string,
  ): Promise<ApiResponse<Product>> {
    return apiService.put<Product>(
      `${API_ENDPOINTS.PRODUCT}/${productId}`,
      productData,
      token,
    )
  }

  async deleteProduct(
    productId: string,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      `${API_ENDPOINTS.PRODUCT}/${productId}`,
      token,
    )
  }

  async getProductById(
    productId: string,
    token: string,
  ): Promise<ApiResponse<Product>> {
    return apiService.get<Product>(
      `${API_ENDPOINTS.PRODUCT}/${productId}`,
      token,
    )
  }

  // Utilitários locais
  getProductByIdLocal(
    products: Product[],
    productId: string,
  ): Product | undefined {
    return products.find((product) => product._id === productId)
  }

  filterProducts(
    products: Product[],
    filters: {
      nome?: string
      categoria?: string
      preco?: { min?: number; max?: number }
    },
  ): Product[] {
    return products.filter((product) => {
      if (
        filters.nome &&
        !product.nome.toLowerCase().includes(filters.nome.toLowerCase())
      ) {
        return false
      }
      if (filters.categoria && product.categoria !== filters.categoria) {
        return false
      }
      if (filters.preco) {
        const price =
          typeof product.preco === 'number'
            ? product.preco
            : parseFloat(product.preco)
        if (filters.preco.min && price < filters.preco.min) {
          return false
        }
        if (filters.preco.max && price > filters.preco.max) {
          return false
        }
      }
      return true
    })
  }
}

export const productService = new ProductService()
