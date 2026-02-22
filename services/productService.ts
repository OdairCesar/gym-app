import { apiService, ApiResponse } from './apiService'
import { API_ENDPOINTS } from '@/constants/api'
import { Product } from '@/interfaces/Product'

export class ProductService {
  async fetchProducts(token: string): Promise<ApiResponse<Product[]>> {
    return apiService.get<Product[]>(API_ENDPOINTS.PRODUCTS, token)
  }

  async createProduct(
    productData: Partial<Product>,
    token: string,
  ): Promise<ApiResponse<Product>> {
    return apiService.post<Product>(API_ENDPOINTS.PRODUCTS, productData, token)
  }

  async updateProduct(
    productId: number,
    productData: Partial<Product>,
    token: string,
  ): Promise<ApiResponse<Product>> {
    return apiService.put<Product>(
      API_ENDPOINTS.PRODUCT_BY_ID(productId),
      productData,
      token,
    )
  }

  async deleteProduct(
    productId: number,
    token: string,
  ): Promise<ApiResponse<void>> {
    return apiService.delete<void>(
      API_ENDPOINTS.PRODUCT_BY_ID(productId),
      token,
    )
  }

  async getProductById(
    productId: number,
    token: string,
  ): Promise<ApiResponse<Product>> {
    return apiService.get<Product>(
      API_ENDPOINTS.PRODUCT_BY_ID(productId),
      token,
    )
  }

  async updateStock(
    productId: number,
    stock: number,
    token: string,
  ): Promise<ApiResponse<Product>> {
    return apiService.patch<Product>(
      API_ENDPOINTS.PRODUCT_STOCK(productId),
      { stock },
      token,
    )
  }

  filterProducts(
    products: Product[],
    filters: {
      name?: string
      category?: string
      price?: { min?: number; max?: number }
    },
  ): Product[] {
    return products.filter((product) => {
      if (
        filters.name &&
        !product.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false
      }
      if (filters.category && product.category !== filters.category) {
        return false
      }
      if (filters.price) {
        const price =
          typeof product.price === 'number'
            ? product.price
            : parseFloat(String(product.price))
        if (filters.price.min !== undefined && price < filters.price.min)
          return false
        if (filters.price.max !== undefined && price > filters.price.max)
          return false
      }
      return true
    })
  }
}

export const productService = new ProductService()
