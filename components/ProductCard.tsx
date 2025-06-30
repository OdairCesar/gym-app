import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { Product } from '@/interfaces/Product'

interface ProductCardProps {
  product: Product
  onBuy: (product: Product) => void
}

export function ProductCard({ product, onBuy }: ProductCardProps) {
  const handleBuyProduct = () => {
    Alert.alert(
      'Comprar Produto',
      `Deseja comprar ${product.nome} por R$ ${product.preco.toFixed(2)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: () => onBuy(product),
        },
      ],
    )
  }

  return (
    <View style={styles.productCard}>
      {product.imagem ? (
        <Image
          source={{ uri: product.imagem }}
          style={styles.productImage}
          alt={product.nome}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <MaterialIcons name="image" size={40} color="#ccc" />
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.nome}</Text>
        <Text style={styles.productCategory}>{product.categoria}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.descricao}
        </Text>

        <View style={styles.productFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>
              R$ {product.preco.toFixed(2)}
            </Text>
            <Text style={styles.stockText}>
              {product.estoque > 0
                ? `${product.estoque} em estoque`
                : 'Indisponível'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.buyButton,
              product.estoque === 0 && styles.buyButtonDisabled,
            ]}
            onPress={handleBuyProduct}
            disabled={product.estoque === 0}
          >
            <MaterialIcons
              name={
                product.estoque > 0 ? 'shopping-cart' : 'remove-shopping-cart'
              }
              size={20}
              color={product.estoque > 0 ? '#fff' : '#999'}
            />
            <Text
              style={[
                styles.buyButtonText,
                product.estoque === 0 && styles.buyButtonTextDisabled,
              ]}
            >
              {product.estoque > 0 ? 'Comprar' : 'Indisponível'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '48%',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#0a84ff',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  productFooter: {
    marginTop: 'auto',
  },
  priceContainer: {
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 2,
  },
  stockText: {
    fontSize: 12,
    color: '#666',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a84ff',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  buyButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buyButtonTextDisabled: {
    color: '#999',
  },
})
