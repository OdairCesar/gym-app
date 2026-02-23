import React, { useState, useEffect, useCallback } from 'react'
import { View, FlatList, Alert, RefreshControl, Text } from 'react-native'
import { useGyms } from '@/hooks/useGyms'
import { Gym, GymStats } from '@/interfaces/Gym'
import { toast } from '@/utils/toast'
import GymCard from '@/components/common/GymCard'
import GymFormModal from '@/components/common/GymFormModal'
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
  const [gymStatsMap, setGymStatsMap] = useState<Record<number, GymStats>>({})
  const [loadingStatsIds, setLoadingStatsIds] = useState<number[]>([])

  const loadGyms = useCallback(async () => {
    await fetchGyms()
  }, [fetchGyms])

  const loadAllStats = useCallback(
    async (gymList: Gym[]) => {
      const ids = gymList.map((g) => g.id)
      setLoadingStatsIds(ids)
      const entries = await Promise.all(
        gymList.map(async (g) => {
          const s = await fetchGymStats(g.id)
          return [g.id, s] as [number, GymStats | null]
        }),
      )
      const map: Record<number, GymStats> = {}
      for (const [id, s] of entries) {
        if (s) map[id] = s
      }
      setGymStatsMap(map)
      setLoadingStatsIds([])
    },
    [fetchGymStats],
  )

  useEffect(() => {
    loadGyms()
  }, [loadGyms])

  useEffect(() => {
    if (gyms.length > 0) loadAllStats(gyms)
  }, [gyms, loadAllStats])

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
      toast.error('Erro', 'Não foi possível salvar a academia.')
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
          } catch {
            toast.error('Erro', 'Não foi possível excluir a academia.')
          }
        },
      },
    ])
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
            stats={gymStatsMap[item.id] ?? null}
            loadingStats={loadingStatsIds.includes(item.id)}
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
