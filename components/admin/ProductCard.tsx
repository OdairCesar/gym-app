import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Product } from '@/interfaces/Product'
import { useAppTheme } from '@/hooks/useAppTheme'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (productId: number) => void
}

function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 12,
      marginVertical: 4,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    imageContainer: {
      marginRight: 16,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    placeholderImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    statusContainer: {
      flexDirection: 'row',
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textLight,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    details: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    detailValue: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    price: {
      fontSize: 14,
      color: colors.success,
      fontWeight: '600',
    },
    stock: {
      fontSize: 14,
      fontWeight: '500',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginLeft: 8,
    },
    editButton: {
      backgroundColor: colors.primaryButtonLight,
    },
    deleteButton: {
      backgroundColor: colors.dangerLight,
    },
    editButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.primary,
      marginLeft: 4,
    },
    deleteButtonText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.danger,
      marginLeft: 4,
    },
  })

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {product.image_link ? (
          <Image
            source={{ uri: product.image_link }}
            style={styles.image}
            alt={product.name}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons
              name="shopping-bag"
              size={40}
              color={colors.borderLight}
            />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: product.published
                    ? colors.success
                    : colors.danger,
                },
              ]}
            >
              <Text style={styles.statusText}>
                {product.published ? 'Ativo' : 'Inativo'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Categoria:</Text>
            <Text style={styles.detailValue}>{product.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Preço:</Text>
            <Text style={styles.price}>R$ {Number(product.price).toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estoque:</Text>
            <Text
              style={[
                styles.stock,
                {
                  color:
                    product.stock > 10
                      ? colors.success
                      : product.stock > 0
                        ? colors.warning
                        : colors.danger,
                },
              ]}
            >
              {product.stock} unidades
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(product)}
          >
            <MaterialIcons name="edit" size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(product.id)}
          >
            <MaterialIcons name="delete" size={16} color={colors.danger} />
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default React.memo(ProductCard)
