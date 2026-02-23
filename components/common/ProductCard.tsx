import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import { useAppTheme } from '@/hooks/useAppTheme'
import { Product } from '@/interfaces/Product'
import { toast } from '@/utils/toast'

interface ProductCardProps {
  product: Product
  gymPhone?: string
  onBuy?: (product: Product) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  suplemento: 'Suplemento',
  vestuario: 'Vestuário',
  acessorio: 'Acessório',
  equipamento: 'Equipamento',
}

/**
 * Normaliza um telefone brasileiro para o formato internacional sem "+".
 * Regras:
 *  1. Remove tudo que não for dígito
 *  2. Se já começar com "55" e tiver 12+ dígitos, assume que o DDI está presente
 *  3. Caso contrário, prefixa com "55" (Brasil)
 *
 * Exemplos:
 *  "(11) 98765-4321" → "5511987654321"
 *  "11 9876-5432"   → "55119876543" (8 dígitos + DDD)
 *  "11987654321"    → "5511987654321"
 *  "5511987654321"  → "5511987654321" (já tinha DDI)
 */
function normalizeWhatsAppPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('55') && digits.length >= 12) return digits
  return `55${digits}`
}

export const ProductCard = React.memo(function ProductCard({
  product,
  gymPhone,
  onBuy,
}: ProductCardProps) {
  const { colors } = useAppTheme()
  const available = product.stock > 0
  const price = Number(product.price).toFixed(2)

  const handleBuyProduct = () => {
    if (!available) return

    if (gymPhone) {
      const phone = normalizeWhatsAppPhone(gymPhone)
      const message = `Olá! Tenho interesse em comprar o produto *${product.name}* por R$ ${price}. Poderia me ajudar?`
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      Linking.openURL(url).catch(() =>
        toast.error('Erro', 'Não foi possível abrir o WhatsApp.'),
      )
    } else if (onBuy) {
      onBuy(product)
    } else {
      toast.info('Atenção', 'Contato da academia não disponível.')
    }
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundSecondary,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Imagem */}
      {product.image_link ? (
        <Image source={{ uri: product.image_link }} style={styles.image} />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: colors.background },
          ]}
        >
          <MaterialIcons
            name="shopping-bag"
            size={32}
            color={colors.textSecondary}
          />
        </View>
      )}

      {/* ConteÃºdo */}
      <View style={styles.content}>
        {/* Badge de categoria */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: colors.primary + '18' },
          ]}
        >
          <Text style={[styles.categoryText, { color: colors.primary }]}>
            {CATEGORY_LABELS[product.category] ?? product.category}
          </Text>
        </View>

        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {product.name}
        </Text>

        {product.description ? (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {product.description}
          </Text>
        ) : null}

        {/* RodapÃ©: preÃ§o + botÃ£o */}
        <View style={styles.footer}>
          <View>
            <Text style={[styles.price, { color: colors.success }]}>
              R$ {price}
            </Text>
            <Text
              style={[
                styles.stock,
                { color: available ? colors.textSecondary : colors.danger },
              ]}
            >
              {available ? `${product.stock} em estoque` : 'Indisponível'}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.buyButton,
              {
                backgroundColor: available ? colors.primary : colors.background,
                borderColor: available ? colors.primary : colors.border,
              },
            ]}
            onPress={handleBuyProduct}
            disabled={!available}
            activeOpacity={0.8}
          >
            <MaterialIcons
              name={available ? 'add-shopping-cart' : 'remove-shopping-cart'}
              size={18}
              color={available ? '#fff' : colors.textSecondary}
            />
            <Text
              style={[
                styles.buyButtonText,
                { color: available ? '#fff' : colors.textSecondary },
              ]}
            >
              {available ? 'Pedir' : 'Esgotado'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
})

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  content: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
  },
  stock: {
    fontSize: 12,
    marginTop: 1,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  buyButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
})
