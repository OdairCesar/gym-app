import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  FlatList,
  Alert,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { useUsers } from '@/hooks/useUsers'
import { User } from '@/interfaces/User'
import { toast } from '@/utils/toast'
import UserCard from '@/components/admin/UserCard'
import PendingUserCard from '@/components/admin/PendingUserCard'
import GenericFormModal, {
  FormField,
} from '@/components/common/GenericFormModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import { useAppTheme } from '@/hooks/useAppTheme'

type TabType = 'all' | 'pending'

interface FilterState {
  name: string
  email: string
  phone: string
  cpf: string
  gender: string
  profession: string
  address: string
  role: string
  isActive: string
}

export default function UsersScreen() {
  const {
    users,
    pendingUsers,
    fetchUsers,
    fetchPendingUsers,
    createUser,
    updateUser,
    deleteUser: deleteUserHook,
    approveUser,
    rejectUser,
    filterUsers,
  } = useUsers()

  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
    tabText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    tabTextActive: { color: colors.primary, fontWeight: '700' },
    pendingBadge: {
      backgroundColor: '#f59e0b',
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
      marginLeft: 4,
    },
    pendingBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
    tabWithBadge: { flexDirection: 'row', alignItems: 'center' },
    list: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    emptyText: {
      textAlign: 'center',
      color: colors.textSecondary,
      marginTop: 40,
      fontSize: 15,
    },
  })

  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    password: '',
    phone: '',
    cpf: '',
    gender: 'O',
    profession: '',
    address: '',
    isAdmin: false,
    isPersonal: false,
  })

  const [filters, setFilters] = useState<FilterState>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    gender: '',
    profession: '',
    address: '',
    role: '',
    isActive: '',
  })

  const applyFilters = useCallback(() => {
    const filtered = filterUsers({
      name: filters.name,
      email: filters.email,
      gender: filters.gender || undefined,
      role: filters.role || undefined,
      isActive: filters.isActive ? filters.isActive === 'true' : undefined,
    })

    let finalFiltered = [...filtered]

    if (filters.phone) {
      finalFiltered = finalFiltered.filter((user) =>
        user.phone?.toLowerCase().includes(filters.phone.toLowerCase()),
      )
    }
    if (filters.cpf) {
      finalFiltered = finalFiltered.filter((user) =>
        user.cpf?.toLowerCase().includes(filters.cpf.toLowerCase()),
      )
    }
    if (filters.profession) {
      finalFiltered = finalFiltered.filter((user) =>
        user.profession
          ?.toLowerCase()
          .includes(filters.profession.toLowerCase()),
      )
    }
    if (filters.address) {
      finalFiltered = finalFiltered.filter((user) =>
        user.address?.toLowerCase().includes(filters.address.toLowerCase()),
      )
    }

    setFilteredUsers(finalFiltered)
    setFilterModalVisible(false)
  }, [filters, filterUsers])

  const clearFilters = () => {
    setFilters({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      gender: '',
      profession: '',
      address: '',
      role: '',
      isActive: '',
    })
    setFilteredUsers(users)
  }

  const saveUser = async () => {
    try {
      if (!editingUser && !formData.password) {
        toast.error('Erro', 'Senha é obrigatória para novos usuários')
        return
      }

      const userData = { ...formData }
      if (userData.password === '') delete userData.password
      if (userData.cpf) userData.cpf = userData.cpf.replace(/\D/g, '')

      const success = editingUser
        ? await updateUser(editingUser.id, userData)
        : await createUser(userData)

      if (success) {
        setModalVisible(false)
        resetForm()
        await fetchUsers()
      }
    } catch (error) {
      toast.error('Erro', 'Erro ao salvar usuário')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      cpf: '',
      gender: 'O',
      profession: '',
      address: '',
      isAdmin: false,
      isPersonal: false,
    })
    setEditingUser(null)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone || '',
      cpf: user.cpf || '',
      gender: user.gender || 'O',
      profession: user.profession || '',
      address: user.address || '',
    })
    setModalVisible(true)
  }

  const handleDeleteUser = async (userId: number) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUserHook(userId)
            await fetchUsers()
          } catch (error) {
            toast.error('Erro', 'Erro ao deletar usuário')
          }
        },
      },
    ])
  }

  useEffect(() => {
    fetchUsers()
    fetchPendingUsers()
  }, [fetchUsers, fetchPendingUsers])

  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchUsers(), fetchPendingUsers()])
    setRefreshing(false)
  }

  const handleFormChange = (key: string, value: string | boolean) => {
    setFormData({ ...formData, [key]: value })
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const headerButtons: HeaderButton[] = [
    {
      icon: 'filter',
      onPress: () => setFilterModalVisible(true),
      color: colors.primary,
    },
    {
      icon: 'plus',
      onPress: () => {
        resetForm()
        setModalVisible(true)
      },
      color: colors.primary,
    },
  ]

  const userFilterFields: FilterField[] = [
    {
      key: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Filtrar por nome',
      value: filters.name,
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Filtrar por email',
      value: filters.email,
    },
    {
      key: 'phone',
      label: 'Telefone',
      type: 'text',
      placeholder: 'Filtrar por telefone',
      value: filters.phone,
    },
    {
      key: 'cpf',
      label: 'CPF',
      type: 'text',
      placeholder: 'Filtrar por CPF',
      value: filters.cpf,
    },
    {
      key: 'profession',
      label: 'Profissão',
      type: 'text',
      placeholder: 'Filtrar por profissão',
      value: filters.profession,
    },
    {
      key: 'address',
      label: 'Endereço',
      type: 'text',
      placeholder: 'Filtrar por endereço',
      value: filters.address,
    },
    {
      key: 'gender',
      label: 'Gênero',
      type: 'select',
      value: filters.gender,
      options: [
        { label: 'Todos', value: '' },
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
        { label: 'Outro', value: 'O' },
      ],
    },
    {
      key: 'role',
      label: 'Papel',
      type: 'select',
      value: filters.role,
      options: [
        { label: 'Todos', value: '' },
        { label: 'Admin', value: 'admin' },
        { label: 'Personal', value: 'personal' },
        { label: 'Aluno', value: 'user' },
      ],
    },
    {
      key: 'isActive',
      label: 'Status',
      type: 'select',
      value: filters.isActive,
      options: [
        { label: 'Todos', value: '' },
        { label: 'Ativo', value: 'true' },
        { label: 'Inativo', value: 'false' },
      ],
    },
  ]

  const userFormFields: FormField[] = [
    {
      key: 'name',
      label: 'Nome',
      type: 'text',
      placeholder: 'Digite o nome',
      required: true,
      value: formData.name || '',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'Digite o email',
      required: true,
      value: formData.email || '',
    },
    {
      key: 'password',
      label: editingUser ? 'Senha (deixe vazio para manter atual)' : 'Senha',
      type: 'password',
      placeholder: 'Digite a senha',
      required: !editingUser,
      value: formData.password || '',
    },
    {
      key: 'phone',
      label: 'Telefone',
      type: 'phone',
      placeholder: 'Digite o telefone',
      value: formData.phone || '',
    },
    {
      key: 'cpf',
      label: 'CPF',
      type: 'number',
      placeholder: 'Digite o CPF',
      value: formData.cpf || '',
    },
    {
      key: 'gender',
      label: 'Gênero',
      type: 'radio',
      value: formData.gender || 'O',
      options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
        { label: 'Outro', value: 'O' },
      ],
    },
    {
      key: 'profession',
      label: 'Profissão',
      type: 'text',
      placeholder: 'Digite a profissão',
      value: formData.profession || '',
    },
    {
      key: 'address',
      label: 'Endereço',
      type: 'multiline',
      placeholder: 'Digite o endereço',
      value: formData.address || '',
    },
    ...(editingUser
      ? []
      : [
          {
            key: 'isAdmin',
            label: 'Administrador',
            type: 'checkbox' as const,
            value: formData.isAdmin || false,
          },
          {
            key: 'isPersonal',
            label: 'Personal Trainer',
            type: 'checkbox' as const,
            value: formData.isPersonal || false,
          },
        ]),
  ]

  const renderUserItem = ({ item }: { item: User }) => (
    <UserCard user={item} onEdit={openEditModal} onDelete={handleDeleteUser} />
  )

  const renderPendingItem = ({ item }: { item: User }) => (
    <PendingUserCard
      user={item}
      onApprove={approveUser}
      onReject={rejectUser}
    />
  )

  return (
    <View style={styles.container}>
      <PageHeader title="Gerenciar Usuários" buttons={headerButtons} />

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'all' && styles.tabTextActive,
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
        >
          <View style={styles.tabWithBadge}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'pending' && styles.tabTextActive,
              ]}
            >
              Pendentes
            </Text>
            {pendingUsers.length > 0 && (
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>
                  {pendingUsers.length}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {activeTab === 'all' ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum usuário encontrado</Text>
          }
        />
      ) : (
        <FlatList
          data={pendingUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPendingItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum usuário aguardando aprovação
            </Text>
          }
        />
      )}

      <GenericFormModal
        visible={modalVisible}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        fields={userFormFields}
        onClose={() => {
          setModalVisible(false)
          resetForm()
        }}
        onSave={saveUser}
        onFieldChange={handleFormChange}
      />

      <GenericFilterModal
        visible={filterModalVisible}
        title="Filtrar Usuários"
        fields={userFilterFields}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        onFilterChange={handleFilterChange}
      />
    </View>
  )
}
