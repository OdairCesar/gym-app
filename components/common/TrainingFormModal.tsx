import React, { useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import { Training } from '@/interfaces/Training'
import { Exercise } from '@/interfaces/Exercise'
import { User } from '@/interfaces/User'
import ExerciseList from './ExerciseList'
import { useAppTheme } from '@/hooks/useAppTheme'

interface TrainingFormModalProps {
  visible: boolean
  title: string
  formData: Partial<Training>
  currentExercise: Exercise
  exerciseModalVisible: boolean
  clients: User[]
  personals: User[]
  onClose: () => void
  onSave: () => void
  onFormChange: (key: string, value: string) => void
  onExerciseChange: (key: string, value: string | number) => void
  onAddExercise: () => void
  onRemoveExercise: (index: number) => void
  onOpenExerciseModal: () => void
  onCloseExerciseModal: () => void
}

export default function TrainingFormModal({
  visible,
  title,
  formData,
  currentExercise,
  exerciseModalVisible,
  clients,
  personals,
  onClose,
  onSave,
  onFormChange,
  onExerciseChange,
  onAddExercise,
  onRemoveExercise,
  onOpenExerciseModal,
  onCloseExerciseModal,
}: TrainingFormModalProps) {
  const { colors } = useAppTheme()

  // Handler para o botão voltar do Android
  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose()
        return true // Previne o comportamento padrão
      }
      return false
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [visible, onClose])

  // Handler para o modal de exercício
  useEffect(() => {
    const backAction = () => {
      if (exerciseModalVisible) {
        onCloseExerciseModal()
        return true // Previne o comportamento padrão
      }
      return false
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [exerciseModalVisible, onCloseExerciseModal])

  const modalStyles = {
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: colors.text,
    },
    cancelButton: {
      fontSize: 16,
      color: colors.error,
    },
    saveButton: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600' as const,
    },
    formContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    inputGroup: {
      marginVertical: 12,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500' as const,
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
    pickerContainer: {
      backgroundColor: colors.backgroundSecondary,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    picker: {
      height: 50,
      color: colors.text,
    },
    scrollContent: {
      paddingBottom: 50,
    },
  }

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={modalStyles.modalContainer}>
          <View style={modalStyles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={modalStyles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={modalStyles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onSave}>
              <Text style={modalStyles.saveButton}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={modalStyles.formContainer}
            contentContainerStyle={modalStyles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Nome do Treino */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Nome do Treino *</Text>
              <TextInput
                style={modalStyles.input}
                value={formData.nome || ''}
                onChangeText={(text) => onFormChange('nome', text)}
                placeholder="Digite o nome do treino"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Cliente */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Cliente *</Text>
              <View style={modalStyles.pickerContainer}>
                <Picker
                  selectedValue={formData.user || ''}
                  onValueChange={(value) => onFormChange('user', value)}
                  style={modalStyles.picker}
                >
                  <Picker.Item label="Selecione um cliente..." value="" />
                  {clients.map((client, index) => (
                    <Picker.Item
                      key={client._id || `client-${index}`}
                      label={client.nome}
                      value={client._id || ''}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Personal Trainer */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Personal Trainer *</Text>
              <View style={modalStyles.pickerContainer}>
                <Picker
                  selectedValue={formData.treinador || ''}
                  onValueChange={(value) => onFormChange('treinador', value)}
                  style={modalStyles.picker}
                >
                  <Picker.Item label="Selecione um personal..." value="" />
                  {personals.map((personal, index) => (
                    <Picker.Item
                      key={personal._id || `personal-${index}`}
                      label={personal.nome}
                      value={personal._id || ''}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Lista de Exercícios */}
            <ExerciseList
              exercises={formData.exercicios || []}
              onAdd={onOpenExerciseModal}
              onRemove={onRemoveExercise}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal de Exercício */}
      <Modal
        visible={exerciseModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={modalStyles.modalContainer}>
          <View style={modalStyles.modalHeader}>
            <TouchableOpacity onPress={onCloseExerciseModal}>
              <Text style={modalStyles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={modalStyles.modalTitle}>Novo Exercício</Text>
            <TouchableOpacity onPress={onAddExercise}>
              <Text style={modalStyles.saveButton}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={modalStyles.formContainer}
            contentContainerStyle={modalStyles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Nome do Exercício */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Nome do Exercício *</Text>
              <TextInput
                style={modalStyles.input}
                value={currentExercise.nome}
                onChangeText={(text) => onExerciseChange('nome', text)}
                placeholder="Digite o nome do exercício"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Séries */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Séries *</Text>
              <TextInput
                style={modalStyles.input}
                value={currentExercise.series}
                onChangeText={(text) => onExerciseChange('series', text)}
                placeholder="Ex: 3x12, 4x8-10"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            {/* Tipo */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Tipo *</Text>
              <View style={modalStyles.pickerContainer}>
                <Picker
                  selectedValue={currentExercise.tipo}
                  onValueChange={(value) => onExerciseChange('tipo', value)}
                  style={modalStyles.picker}
                >
                  <Picker.Item label="Musculação" value="musculacao" />
                  <Picker.Item label="Aeróbico" value="aerobico" />
                  <Picker.Item label="Flexibilidade" value="flexibilidade" />
                  <Picker.Item label="Outro" value="outro" />
                </Picker>
              </View>
            </View>

            {/* Carga */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Carga (kg)</Text>
              <TextInput
                style={modalStyles.input}
                value={currentExercise.carga.toString()}
                onChangeText={(text) => onExerciseChange('carga', text)}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            {/* Descanso */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>Descanso (segundos)</Text>
              <TextInput
                style={modalStyles.input}
                value={currentExercise.descanso.toString()}
                onChangeText={(text) => onExerciseChange('descanso', text)}
                placeholder="60"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            {/* URL do Vídeo */}
            <View style={modalStyles.inputGroup}>
              <Text style={modalStyles.inputLabel}>
                URL do Vídeo (opcional)
              </Text>
              <TextInput
                style={modalStyles.input}
                value={currentExercise.videoUrl || ''}
                onChangeText={(text) => onExerciseChange('videoUrl', text)}
                placeholder="https://..."
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  )
}
