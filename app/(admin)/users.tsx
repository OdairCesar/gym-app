import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl, StyleSheet } from 'react-native'
import { useUsers } from '@/hooks/useUsers'
import { User } from '@/interfaces/User'
import UserCard from '@/components/admin/UserCard'
import GenericFormModal, {
  FormField,
} from '@/components/common/GenericFormModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import { useAppTheme } from '@/hooks/useAppTheme'

interface FilterState {
  nome: string
  email: string
  telefone: string
  cpf: string
  sexo: string
  profissao: string
  endereco: string
  isAdmin: string
  isPersonal: string
  isActive: string
}

export default function UsersScreen() {
  const {
    users,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser: deleteUserHook,
    filterUsers,
  } = useUsers()

  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
  })

  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [formData, setFormData] = useState<Partial<User>>({
    nome: '',
    email: '',
    password: '',
    telefone: '',
    cpf: '',
    sexo: 'O',
    profissao: '',
    endereco: '',
    isAdmin: false,
    isPersonal: false,
    isActive: true,
  })

  const [filters, setFilters] = useState<FilterState>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    sexo: '',
    profissao: '',
    endereco: '',
    isAdmin: '',
    isPersonal: '',
    isActive: '',
  })

  const applyFilters = useCallback(() => {
    const filtered = filterUsers({
      nome: filters.nome,
      email: filters.email,
      sexo: filters.sexo,
      isAdmin: filters.isAdmin ? filters.isAdmin === 'true' : undefined,
      isPersonal: filters.isPersonal
        ? filters.isPersonal === 'true'
        : undefined,
      isActive: filters.isActive ? filters.isActive === 'true' : undefined,
    })

    // Aplicar filtros adicionais manualmente
    let finalFiltered = [...filtered]

    if (filters.telefone) {
      finalFiltered = finalFiltered.filter((user) =>
        user.telefone?.toLowerCase().includes(filters.telefone.toLowerCase()),
      )
    }

    if (filters.cpf) {
      finalFiltered = finalFiltered.filter((user) =>
        user.cpf?.toLowerCase().includes(filters.cpf.toLowerCase()),
      )
    }

    if (filters.profissao) {
      finalFiltered = finalFiltered.filter((user) =>
        user.profissao?.toLowerCase().includes(filters.profissao.toLowerCase()),
      )
    }

    if (filters.endereco) {
      finalFiltered = finalFiltered.filter((user) =>
        user.endereco?.toLowerCase().includes(filters.endereco.toLowerCase()),
      )
    }

    setFilteredUsers(finalFiltered)
    setFilterModalVisible(false)
  }, [filters, filterUsers])

  const clearFilters = () => {
    setFilters({
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      sexo: '',
      profissao: '',
      endereco: '',
      isAdmin: '',
      isPersonal: '',
      isActive: '',
    })
    setFilteredUsers(users)
  }

  const saveUser = async () => {
    try {
      if (!editingUser && !formData.password) {
        Alert.alert('Erro', 'Senha é obrigatória para novos usuários')
        return
      }

      const userData = { ...formData }
      if (userData.password === '') delete userData.password

      const success = editingUser
        ? await updateUser(editingUser._id || '', userData)
        : await createUser(userData)

      if (success) {
        setModalVisible(false)
        resetForm()
        // Atualizar usuários na tela
        await fetchUsers()
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar usuário')
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      password: '',
      telefone: '',
      cpf: '',
      sexo: 'O',
      profissao: '',
      endereco: '',
      isAdmin: false,
      isPersonal: false,
      isActive: true,
    })
    setEditingUser(null)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormData({
      nome: user.nome,
      email: user.email,
      password: '',
      telefone: user.telefone || '',
      cpf: user.cpf || '',
      sexo: user.sexo || 'O',
      profissao: user.profissao || '',
      endereco: user.endereco || '',
      isAdmin: user.isAdmin || false,
      isPersonal: user.isPersonal || false,
      isActive: user.isActive !== false,
    })
    setModalVisible(true)
  }

  const handleDeleteUser = async (userId: string) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            const success = await deleteUserHook(userId)
            if (success) {
              // Atualizar usuários na tela
              await fetchUsers()
            }
          } catch (error) {
            Alert.alert('Erro', 'Erro ao deletar usuário')
          }
        },
      },
    ])
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Atualizar usuários filtrados quando a lista de usuários mudar
  useEffect(() => {
    setFilteredUsers(users)
  }, [users])

  const onRefresh = () => {
    setRefreshing(true)
    fetchUsers().finally(() => setRefreshing(false))
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
      key: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Filtrar por nome',
      value: filters.nome,
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Filtrar por email',
      value: filters.email,
    },
    {
      key: 'telefone',
      label: 'Telefone',
      type: 'text',
      placeholder: 'Filtrar por telefone',
      value: filters.telefone,
    },
    {
      key: 'cpf',
      label: 'CPF',
      type: 'text',
      placeholder: 'Filtrar por CPF',
      value: filters.cpf,
    },
    {
      key: 'profissao',
      label: 'Profissão',
      type: 'text',
      placeholder: 'Filtrar por profissão',
      value: filters.profissao,
    },
    {
      key: 'endereco',
      label: 'Endereço',
      type: 'text',
      placeholder: 'Filtrar por endereço',
      value: filters.endereco,
    },
    {
      key: 'sexo',
      label: 'Sexo',
      type: 'select',
      value: filters.sexo,
      options: [
        { label: 'Todos', value: '' },
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
        { label: 'Outro', value: 'O' },
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
      key: 'nome',
      label: 'Nome',
      type: 'text',
      placeholder: 'Digite o nome',
      required: true,
      value: formData.nome || '',
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
      key: 'telefone',
      label: 'Telefone',
      type: 'phone',
      placeholder: 'Digite o telefone',
      value: formData.telefone || '',
    },
    {
      key: 'cpf',
      label: 'CPF',
      type: 'number',
      placeholder: 'Digite o CPF',
      value: formData.cpf || '',
    },
    {
      key: 'sexo',
      label: 'Sexo',
      type: 'radio',
      value: formData.sexo || 'O',
      options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
        { label: 'Outro', value: 'O' },
      ],
    },
    {
      key: 'profissao',
      label: 'Profissão',
      type: 'text',
      placeholder: 'Digite a profissão',
      value: formData.profissao || '',
    },
    {
      key: 'endereco',
      label: 'Endereço',
      type: 'multiline',
      placeholder: 'Digite o endereço',
      value: formData.endereco || '',
    },
    {
      key: 'isAdmin',
      label: 'Administrador',
      type: 'checkbox',
      value: formData.isAdmin || false,
    },
    {
      key: 'isPersonal',
      label: 'Personal Trainer',
      type: 'checkbox',
      value: formData.isPersonal || false,
    },
    {
      key: 'isActive',
      label: 'Usuário Ativo',
      type: 'checkbox',
      value: formData.isActive !== false,
    },
  ]

  const renderUserItem = ({ item }: { item: User }) => (
    <UserCard user={item} onEdit={openEditModal} onDelete={handleDeleteUser} />
  )

  return (
    <View style={styles.container}>
      <PageHeader title="Gerenciar Usuários" buttons={headerButtons} />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id || `user-${Math.random()}`}
        renderItem={renderUserItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

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
