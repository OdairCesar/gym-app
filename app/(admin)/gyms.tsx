import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl, Text } from 'react-native'
import { useGyms } from '@/hooks/useGyms'
import { Gym, GymStats } from '@/interfaces/Gym'
import GymCard from '@/components/common/GymCard'
import GymFormModal from '@/components/common/GymFormModal'
import GymStatsCard from '@/components/common/GymStatsCard'
import PageHeader, { HeaderButton } from '@/components/common/PageHeader'
import { useAppTheme } from '@/hooks/useAppTheme'

export default function GymsScreen() {
  const {
    gyms,
    loading,
    fetchGyms,
    createGym,
    updateGym,
    deleteGym,
    fetchGymStats,
  } = useGyms()

  const { colors } = useAppTheme()

  const [refreshing, setRefreshing] = useState(false)
  const [isFormModalVisible, setIsFormModalVisible] = useState(false)
  const [editingGym, setEditingGym] = useState<Gym | null>(null)
  const [selectedGymStats, setSelectedGymStats] = useState<GymStats | null>(
    null,
  )
  const [loadingStats, setLoadingStats] = useState(false)

  const loadGyms = useCallback(async () => {
    await fetchGyms()
  }, [fetchGyms])

  useEffect(() => {
    loadGyms()
  }, [loadGyms])

  const onRefresh = async () => {
    setRefreshing(true)
    await loadGyms()
    setRefreshing(false)
  }

  const openCreateModal = () => {
    setEditingGym(null)
    setIsFormModalVisible(true)
  }

  const openEditModal = (gym: Gym) => {
    setEditingGym(gym)
    setIsFormModalVisible(true)
  }

  const handleSaveGym = async (data: Partial<Gym>) => {
    try {
      if (editingGym) {
        await updateGym(editingGym.id, data)
      } else {
        await createGym(data)
      }
      setIsFormModalVisible(false)
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a academia.')
    }
  }

  const handleDeleteGym = (gymId: number) => {
    Alert.alert('Confirmar exclusão', 'Deseja excluir esta academia?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteGym(gymId)
            setSelectedGymStats(null)
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir a academia.')
          }
        },
      },
    ])
  }

  const handleViewStats = async (gym: Gym) => {
    setLoadingStats(true)
    const stats = await fetchGymStats(gym.id)
    setSelectedGymStats(stats)
    setLoadingStats(false)
  }

  const headerButtons: HeaderButton[] = [
    {
      icon: 'plus',
      onPress: openCreateModal,
    },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PageHeader title="Academias" buttons={headerButtons} />

      {selectedGymStats && (
        <GymStatsCard stats={selectedGymStats} loading={loadingStats} />
      )}

      <FlatList
        data={gyms}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <GymCard
            gym={item}
            onEdit={openEditModal}
            onDelete={handleDeleteGym}
            onViewStats={handleViewStats}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <Text
              style={{
                textAlign: 'center',
                marginTop: 40,
                color: colors.textSecondary,
              }}
            >
              Nenhuma academia cadastrada.
            </Text>
          ) : null
        }
      />

      <GymFormModal
        visible={isFormModalVisible}
        title={editingGym ? 'Editar Academia' : 'Nova Academia'}
        initialData={editingGym || undefined}
        onClose={() => setIsFormModalVisible(false)}
        onSave={handleSaveGym}
      />
    </View>
  )
}
