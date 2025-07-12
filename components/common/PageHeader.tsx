import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAppTheme } from '@/hooks/useAppTheme'

export interface HeaderButton {
  icon: string
  onPress: () => void
  color?: string
}

interface PageHeaderProps {
  title: string
  buttons?: HeaderButton[]
}

export default function PageHeader({ title, buttons = [] }: PageHeaderProps) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    actionButtonGroup: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
  })

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {buttons.length > 0 && (
        <View style={styles.actionButtonGroup}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={button.onPress}
            >
              <MaterialCommunityIcons
                name={
                  button.icon as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={24}
                color={button.color || colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}
