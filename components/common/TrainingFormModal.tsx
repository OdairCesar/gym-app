import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Training } from '@/interfaces/Training'
import { useAppTheme } from '@/hooks/useAppTheme'

export interface UserOption {
  id: number
  name: string
}

interface TrainingFormModalProps {
  visible: boolean
  title: string
  formData: Partial<Training>
  onClose: () => void
  onSave: () => void
  onFormChange: (key: string, value: string) => void
  users?: UserOption[]
  selectedUserId?: number | null
  onUserChange?: (userId: number | null) => void
}

export default function TrainingFormModal({
  visible,
  title,
  formData,
  onClose,
  onSave,
  onFormChange,
  users,
  selectedUserId,
  onUserChange,
}: TrainingFormModalProps) {
  const { colors } = useAppTheme()
  const [userSearch, setUserSearch] = useState('')
  const [userPickerOpen, setUserPickerOpen] = useState(false)

  const filteredUsers = (users ?? []).filter((u) =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()),
  )

  const selectedUserName = users?.find((u) => u.id === selectedUserId)?.name

  useEffect(() => {
    if (!visible) {
      setUserSearch('')
      setUserPickerOpen(false)
    }
  }, [visible])

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose()
        return true
      }
      return false
    }
    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )
    return () => handler.remove()
  }, [visible, onClose])

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
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
    headerTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
    cancelBtn: { fontSize: 16, color: colors.error },
    saveBtn: { fontSize: 16, color: colors.primary, fontWeight: '600' },
    form: { flex: 1, paddingHorizontal: 16 },
    inputGroup: { marginVertical: 12 },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    // Seletor de aluno
    userTrigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    userTriggerText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    userTriggerPlaceholder: {
      fontSize: 16,
      color: colors.textSecondary,
      flex: 1,
    },
    pickerContainer: {
      marginTop: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.backgroundSecondary,
      overflow: 'hidden',
      maxHeight: 240,
    },
    searchInput: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      color: colors.text,
      backgroundColor: colors.backgroundSecondary,
    },
    userRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    userRowText: {
      fontSize: 15,
      color: colors.text,
      flex: 1,
    },
    clearRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.dangerLight,
    },
    clearRowText: {
      fontSize: 15,
      color: colors.error,
      flex: 1,
    },
  })

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelBtn}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={onSave}>
            <Text style={styles.saveBtn}>Salvar</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.form}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Treino *</Text>
            <TextInput
              style={styles.input}
              value={formData.name || ''}
              onChangeText={(t) => onFormChange('name', t)}
              placeholder="Digite o nome do treino"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description || ''}
              onChangeText={(t) => onFormChange('description', t)}
              placeholder="Descrição do treino (opcional)"
              placeholderTextColor={colors.textSecondary}
              multiline
            />
          </View>

          {onUserChange && users && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Aluno</Text>
              <TouchableOpacity
                style={styles.userTrigger}
                onPress={() => setUserPickerOpen((o) => !o)}
                activeOpacity={0.7}
              >
                {selectedUserName ? (
                  <Text style={styles.userTriggerText}>{selectedUserName}</Text>
                ) : (
                  <Text style={styles.userTriggerPlaceholder}>
                    Selecionar aluno (opcional)
                  </Text>
                )}
                <MaterialCommunityIcons
                  name={userPickerOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              {userPickerOpen && (
                <View style={styles.pickerContainer}>
                  <TextInput
                    style={styles.searchInput}
                    value={userSearch}
                    onChangeText={setUserSearch}
                    placeholder="Buscar aluno..."
                    placeholderTextColor={colors.textSecondary}
                    autoCorrect={false}
                  />
                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                  >
                    {selectedUserId != null && (
                      <TouchableOpacity
                        style={styles.clearRow}
                        onPress={() => {
                          onUserChange(null)
                          setUserPickerOpen(false)
                          setUserSearch('')
                        }}
                      >
                        <MaterialCommunityIcons
                          name="close-circle-outline"
                          size={18}
                          color={colors.error}
                        />
                        <Text style={styles.clearRowText}>Remover seleção</Text>
                      </TouchableOpacity>
                    )}
                    {filteredUsers.length === 0 ? (
                      <Text
                        style={[
                          styles.userRowText,
                          { padding: 14, color: colors.textSecondary },
                        ]}
                      >
                        Nenhum aluno encontrado
                      </Text>
                    ) : (
                      filteredUsers.map((item) => {
                        const isSelected = item.id === selectedUserId
                        return (
                          <TouchableOpacity
                            key={item.id}
                            style={[
                              styles.userRow,
                              isSelected && {
                                backgroundColor: colors.primaryLight,
                              },
                            ]}
                            onPress={() => {
                              onUserChange(item.id)
                              setUserPickerOpen(false)
                              setUserSearch('')
                            }}
                          >
                            <MaterialCommunityIcons
                              name={
                                isSelected ? 'radiobox-marked' : 'radiobox-blank'
                              }
                              size={18}
                              color={
                                isSelected ? colors.primary : colors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                styles.userRowText,
                                isSelected && {
                                  fontWeight: '600',
                                  color: colors.primary,
                                },
                              ]}
                            >
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )
                      })
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}
