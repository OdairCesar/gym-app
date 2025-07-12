import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { User } from '@/interfaces/User'
import { Colors } from '@/styles/globalStyles'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
}

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  return (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.nome}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <View style={styles.userTags}>
          {user.isAdmin && (
            <Text style={[styles.tag, styles.adminTag]}>Admin</Text>
          )}
          {user.isPersonal && (
            <Text style={[styles.tag, styles.personalTag]}>Personal</Text>
          )}
          {!user.isActive && (
            <Text style={[styles.tag, styles.inactiveTag]}>Inativo</Text>
          )}
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(user)}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={20}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(user._id!)}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={Colors.danger}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  userTags: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  adminTag: {
    backgroundColor: Colors.danger,
    color: Colors.textLight,
  },
  personalTag: {
    backgroundColor: Colors.primary,
    color: Colors.textLight,
  },
  inactiveTag: {
    backgroundColor: Colors.textSecondary,
    color: Colors.textLight,
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
})
