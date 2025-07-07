import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl, StyleSheet } from 'react-native'
import { useAuth } from '@/context/authContext'
import { User } from '@/interfaces/User'
import { API_ENDPOINTS, buildApiUrl } from '@/constants/api'
import UserCard from '@/components/admin/UserCard'
import GenericFormModal, {
  FormField,
} from '@/components/common/GenericFormModal'
import GenericFilterModal, {
  FilterField,
} from '@/components/common/GenericFilterModal'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'

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
  const { getToken } = useAuth()
  const [users, setUsers] = useState<User[]>([])
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

  const fetchUsers = useCallback(async () => {
    try {
      const token = await getToken()

      const response = await fetch(buildApiUrl(API_ENDPOINTS.USER), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const json = await response.json()
        setUsers(json.data)
        setFilteredUsers(json.data)
      } else {
        Alert.alert('Erro', 'Falha ao carregar usuários')
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão')
    } finally {
      setRefreshing(false)
    }
  }, [getToken])

  const applyFilters = useCallback(() => {
    let filtered = [...users]

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((user) => {
          const userValue = user[key as keyof User]

          if (key === 'isAdmin' || key === 'isPersonal' || key === 'isActive') {
            return userValue?.toString() === value
          }

          if (key === 'sexo') {
            return userValue === value
          }

          return userValue
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        })
      }
    })

    setFilteredUsers(filtered)
    setFilterModalVisible(false)
  }, [users, filters])

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
      const token = await getToken()
      const url = editingUser
        ? buildApiUrl(`${API_ENDPOINTS.USER}/${editingUser._id}`)
        : buildApiUrl(API_ENDPOINTS.USER)

      const method = editingUser ? 'PUT' : 'POST'

      const userData = { ...formData }

      if (userData.password === '') delete userData.password

      if (!editingUser && !userData.password) {
        Alert.alert('Erro', 'Senha é obrigatória para novos usuários')
        return
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        Alert.alert('Erro', errorData.message || 'Falha ao salvar usuário')
        return
      }

      Alert.alert(
        'Sucesso',
        `Usuário ${editingUser ? 'atualizado' : 'criado'} com sucesso`,
      )
      setModalVisible(false)
      resetForm()
      fetchUsers()
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão')
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

  const deleteUser = async (userId: string) => {
    Alert.alert('Confirmar', 'Tem certeza que deseja deletar este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await getToken()
            const response = await fetch(
              buildApiUrl(`${API_ENDPOINTS.USER}/${userId}`),
              {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )

            if (response.ok) {
              Alert.alert('Sucesso', 'Usuário deletado com sucesso')
              fetchUsers()
            } else {
              Alert.alert('Erro', 'Falha ao deletar usuário')
            }
          } catch (error) {
            Alert.alert('Erro', 'Erro de conexão')
          }
        },
      },
    ])
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const onRefresh = () => {
    setRefreshing(true)
    fetchUsers()
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
      color: '#007AFF',
    },
    {
      icon: 'plus',
      onPress: () => {
        resetForm()
        setModalVisible(true)
      },
      color: '#007AFF',
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
      label: `Senha ${editingUser ? '(deixe vazio para manter atual)' : ''}`,
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
    <UserCard user={item} onEdit={openEditModal} onDelete={deleteUser} />
  )

  return (
    <View style={styles.container}>
      <PageHeader title="Gerenciar Usuários" buttons={headerButtons} />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id || ''}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
})
