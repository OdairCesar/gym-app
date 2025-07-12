import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/styles/globalStyles'

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
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {buttons.length > 0 && (
        <View style={styles.headerActions}>
          {buttons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.headerButton}
              onPress={button.onPress}
            >
              <MaterialCommunityIcons
                name={
                  button.icon as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={24}
                color={button.color || Colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
})
