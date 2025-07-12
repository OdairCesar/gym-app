import React from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import { Training } from '@/interfaces/Training'
import { Exercise } from '@/interfaces/Exercise'
import { User } from '@/interfaces/User'
import { Colors } from '@/styles/globalStyles'
import ExerciseList from './ExerciseList'

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
  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onSave}>
              <Text style={styles.saveButton}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Nome do Treino */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Treino *</Text>
              <TextInput
                style={styles.input}
                value={formData.nome || ''}
                onChangeText={(text) => onFormChange('nome', text)}
                placeholder="Digite o nome do treino"
              />
            </View>

            {/* Cliente */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Cliente *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.user || ''}
                  onValueChange={(value) => onFormChange('user', value)}
                  style={styles.picker}
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
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Personal Trainer *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.treinador || ''}
                  onValueChange={(value) => onFormChange('treinador', value)}
                  style={styles.picker}
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
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onCloseExerciseModal}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Novo Exercício</Text>
            <TouchableOpacity onPress={onAddExercise}>
              <Text style={styles.saveButton}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Nome do Exercício */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Exercício *</Text>
              <TextInput
                style={styles.input}
                value={currentExercise.nome}
                onChangeText={(text) => onExerciseChange('nome', text)}
                placeholder="Digite o nome do exercício"
              />
            </View>

            {/* Séries */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Séries *</Text>
              <TextInput
                style={styles.input}
                value={currentExercise.series}
                onChangeText={(text) => onExerciseChange('series', text)}
                placeholder="Ex: 3x12, 4x8-10"
              />
            </View>

            {/* Tipo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={currentExercise.tipo}
                  onValueChange={(value) => onExerciseChange('tipo', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Musculação" value="musculacao" />
                  <Picker.Item label="Aeróbico" value="aerobico" />
                  <Picker.Item label="Flexibilidade" value="flexibilidade" />
                  <Picker.Item label="Outro" value="outro" />
                </Picker>
              </View>
            </View>

            {/* Carga */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Carga (kg)</Text>
              <TextInput
                style={styles.input}
                value={currentExercise.carga.toString()}
                onChangeText={(text) => onExerciseChange('carga', text)}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            {/* Descanso */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descanso (segundos)</Text>
              <TextInput
                style={styles.input}
                value={currentExercise.descanso.toString()}
                onChangeText={(text) => onExerciseChange('descanso', text)}
                placeholder="60"
                keyboardType="numeric"
              />
            </View>

            {/* URL do Vídeo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>URL do Vídeo (opcional)</Text>
              <TextInput
                style={styles.input}
                value={currentExercise.videoUrl || ''}
                onChangeText={(text) => onExerciseChange('videoUrl', text)}
                placeholder="https://..."
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  cancelButton: {
    fontSize: 16,
    color: Colors.error,
  },
  saveButton: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
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
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  picker: {
    height: 50,
  },
  scrollContent: {
    paddingBottom: 50,
  },
})
