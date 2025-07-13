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

import { useAppTheme } from '@/hooks/useAppTheme'
import { Product } from '@/interfaces/Product'

interface ProductCardProps {
  product: Product
  onBuy: (product: Product) => void
}

export function ProductCard({ product, onBuy }: ProductCardProps) {
  const { colors } = useAppTheme()

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
    <View
      style={[
        styles.productCard,
        {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
        },
      ]}
    >
      {product.imagem ? (
        <Image
          source={{ uri: product.imagem }}
          style={styles.productImage}
          alt={product.nome}
        />
      ) : (
        <View
          style={[
            styles.placeholderImage,
            { backgroundColor: colors.background },
          ]}
        >
          <MaterialIcons name="image" size={40} color={colors.textSecondary} />
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]}>
          {product.nome}
        </Text>
        <Text style={[styles.productCategory, { color: colors.primary }]}>
          {product.categoria}
        </Text>
        <Text
          style={[styles.productDescription, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {product.descricao}
        </Text>

        <View style={styles.productFooter}>
          <View style={styles.priceContainer}>
            <Text style={[styles.productPrice, { color: colors.success }]}>
              R$ {product.preco.toFixed(2)}
            </Text>
            <Text style={[styles.stockText, { color: colors.textSecondary }]}>
              {product.estoque > 0
                ? `${product.estoque} em estoque`
                : 'Indisponível'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.buyButton,
              {
                backgroundColor:
                  product.estoque > 0 ? colors.primary : colors.background,
              },
              product.estoque === 0 && {
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
            onPress={handleBuyProduct}
            disabled={product.estoque === 0}
          >
            <MaterialIcons
              name={
                product.estoque > 0 ? 'shopping-cart' : 'remove-shopping-cart'
              }
              size={20}
              color={product.estoque > 0 ? '#fff' : colors.textSecondary}
            />
            <Text
              style={[
                styles.buyButtonText,
                {
                  color: product.estoque > 0 ? '#fff' : colors.textSecondary,
                },
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
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '48%',
    overflow: 'hidden',
    borderWidth: 1,
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
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
    marginBottom: 2,
  },
  stockText: {
    fontSize: 12,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  buyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
})
