import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  Alert,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { useGymPermissions, useUserPermissions } from '@/hooks/usePermissions'
import { GymPermission, UserPermission } from '@/interfaces/Permission'
import {
  GymPermissionCard,
  UserPermissionCard,
} from '@/components/common/PermissionCard'
import GymPermissionFormModal from '@/components/common/GymPermissionFormModal'
import UserPermissionFormModal from '@/components/common/UserPermissionFormModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import { useAppTheme } from '@/hooks/useAppTheme'
import { toast } from '@/utils/toast'

type TabType = 'gym' | 'user'

export default function PermissionsScreen() {
  const {
    gymPermissions,
    loading: gymLoading,
    fetchGymPermissions,
    createGymPermission,
    updateGymPermission,
    deleteGymPermission,
  } = useGymPermissions()

  const {
    userPermissions,
    loading: userLoading,
    fetchUserPermissions,
    createUserPermission,
    updateUserPermission,
    deleteUserPermission,
  } = useUserPermissions()

  const { colors } = useAppTheme()

  const [activeTab, setActiveTab] = useState<TabType>('gym')
  const [refreshing, setRefreshing] = useState(false)

  // Gym Permission modal state
  const [gymModalVisible, setGymModalVisible] = useState(false)
  const [editingGymPermission, setEditingGymPermission] =
    useState<GymPermission | null>(null)
  const [gymFormData, setGymFormData] = useState<Partial<GymPermission>>({
    gymId: undefined,
    action: '',
    resource: '',
  })

  // User Permission modal state
  const [userModalVisible, setUserModalVisible] = useState(false)
  const [editingUserPermission, setEditingUserPermission] =
    useState<UserPermission | null>(null)
  const [userFormData, setUserFormData] = useState<Partial<UserPermission>>({
    userId: undefined,
    grantedById: undefined,
    action: '',
    resource: '',
    resourceId: null,
  })

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    tabs: {
      flexDirection: 'row',
      backgroundColor: colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
    },
    tabActive: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
    tabTextActive: { color: colors.primary, fontWeight: '700' },
    list: { flex: 1, paddingHorizontal: 16, paddingVertical: 8 },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: 40,
      fontSize: 15,
    },
  })

  useEffect(() => {
    fetchGymPermissions()
    fetchUserPermissions()
  }, [fetchGymPermissions, fetchUserPermissions])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([fetchGymPermissions(), fetchUserPermissions()])
    setRefreshing(false)
  }, [fetchGymPermissions, fetchUserPermissions])

  // ── Gym Permission handlers ──────────────────────────────────────────────

  const openCreateGymModal = () => {
    setEditingGymPermission(null)
    setGymFormData({ gymId: undefined, action: '', resource: '' })
    setGymModalVisible(true)
  }

  const openEditGymModal = (permission: GymPermission) => {
    setEditingGymPermission(permission)
    setGymFormData({
      gymId: permission.gymId,
      action: permission.action,
      resource: permission.resource,
    })
    setGymModalVisible(true)
  }

  const handleGymFormChange = (key: keyof GymPermission, value: string) => {
    setGymFormData((prev) => ({
      ...prev,
      [key]: key === 'gymId' ? (value ? Number(value) : undefined) : value,
    }))
  }

  const saveGymPermission = async () => {
    if (!gymFormData.gymId || !gymFormData.action || !gymFormData.resource) {
      toast.error('Erro', 'Preencha todos os campos obrigatórios')
      return
    }
    let success: boolean
    if (editingGymPermission) {
      success = await updateGymPermission(editingGymPermission.id, gymFormData)
    } else {
      success = await createGymPermission(gymFormData)
    }
    if (success) setGymModalVisible(false)
  }

  const handleDeleteGymPermission = (id: number) => {
    Alert.alert(
      'Remover Permissão',
      'Deseja remover esta permissão de academia?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => await deleteGymPermission(id),
        },
      ],
    )
  }

  // ── User Permission handlers ─────────────────────────────────────────────

  const openCreateUserModal = () => {
    setEditingUserPermission(null)
    setUserFormData({
      userId: undefined,
      grantedById: undefined,
      action: '',
      resource: '',
      resourceId: null,
    })
    setUserModalVisible(true)
  }

  const openEditUserModal = (permission: UserPermission) => {
    setEditingUserPermission(permission)
    setUserFormData({
      userId: permission.userId,
      grantedById: permission.grantedById,
      action: permission.action,
      resource: permission.resource,
      resourceId: permission.resourceId,
    })
    setUserModalVisible(true)
  }

  const handleUserFormChange = (key: keyof UserPermission, value: string) => {
    const numericKeys: (keyof UserPermission)[] = [
      'userId',
      'grantedById',
      'resourceId',
    ]
    setUserFormData((prev) => ({
      ...prev,
      [key]: numericKeys.includes(key) ? (value ? Number(value) : null) : value,
    }))
  }

  const saveUserPermission = async () => {
    if (
      !userFormData.userId ||
      !userFormData.grantedById ||
      !userFormData.action ||
      !userFormData.resource
    ) {
      toast.error('Erro', 'Preencha todos os campos obrigatórios')
      return
    }
    let success: boolean
    if (editingUserPermission) {
      success = await updateUserPermission(
        editingUserPermission.id,
        userFormData,
      )
    } else {
      success = await createUserPermission(userFormData)
    }
    if (success) setUserModalVisible(false)
  }

  const handleDeleteUserPermission = (id: number) => {
    Alert.alert(
      'Remover Permissão',
      'Deseja remover esta permissão de usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => await deleteUserPermission(id),
        },
      ],
    )
  }

  const headerButtons: HeaderButton[] = [
    {
      icon: 'plus',
      onPress: activeTab === 'gym' ? openCreateGymModal : openCreateUserModal,
    },
  ]

  return (
    <View style={styles.container}>
      <PageHeader title="Permissões" buttons={headerButtons} />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'gym' && styles.tabActive]}
          onPress={() => setActiveTab('gym')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'gym' && styles.tabTextActive,
            ]}
          >
            Academia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'user' && styles.tabActive]}
          onPress={() => setActiveTab('user')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'user' && styles.tabTextActive,
            ]}
          >
            Usuário
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'gym' ? (
        <FlatList
          style={styles.list}
          data={gymPermissions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <GymPermissionCard
              permission={item}
              onEdit={openEditGymModal}
              onDelete={handleDeleteGymPermission}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || gymLoading}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma permissão de academia encontrada
            </Text>
          }
        />
      ) : (
        <FlatList
          style={styles.list}
          data={userPermissions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <UserPermissionCard
              permission={item}
              onEdit={openEditUserModal}
              onDelete={handleDeleteUserPermission}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || userLoading}
              onRefresh={handleRefresh}
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhuma permissão de usuário encontrada
            </Text>
          }
        />
      )}

      <GymPermissionFormModal
        visible={gymModalVisible}
        title={
          editingGymPermission
            ? 'Editar Permissão'
            : 'Nova Permissão de Academia'
        }
        formData={gymFormData}
        onClose={() => setGymModalVisible(false)}
        onSave={saveGymPermission}
        onFormChange={handleGymFormChange}
      />

      <UserPermissionFormModal
        visible={userModalVisible}
        title={
          editingUserPermission
            ? 'Editar Permissão'
            : 'Nova Permissão de Usuário'
        }
        formData={userFormData}
        onClose={() => setUserModalVisible(false)}
        onSave={saveUserPermission}
        onFormChange={handleUserFormChange}
      />
    </View>
  )
}
