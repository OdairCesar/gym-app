import React, { useEffect } from 'react'
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  BackHandler,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker'
import { IDiet, IMeal } from '@/interfaces/Diet'
import { User } from '@/interfaces/User'
import { useAppTheme } from '@/hooks/useAppTheme'
import MealList from './MealList'

interface DietFormModalProps {
  visible: boolean
  title: string
  formData: Partial<IDiet>
  currentMeal: IMeal
  mealModalVisible: boolean
  currentFood: string
  personals: User[]
  onClose: () => void
  onSave: () => void
  onFormChange: (key: string, value: string | number) => void
  onMealChange: (key: string, value: string) => void
  onAddMeal: () => void
  onRemoveMeal: (index: number) => void
  onOpenMealModal: () => void
  onCloseMealModal: () => void
  onFoodChange: (value: string) => void
  onAddFood: () => void
  onRemoveFood: (index: number) => void
}

export default function DietFormModal({
  visible,
  title,
  formData,
  currentMeal,
  mealModalVisible,
  currentFood,
  personals,
  onClose,
  onSave,
  onFormChange,
  onMealChange,
  onAddMeal,
  onRemoveMeal,
  onOpenMealModal,
  onCloseMealModal,
  onFoodChange,
  onAddFood,
  onRemoveFood,
}: DietFormModalProps) {
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

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.backgroundSecondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
    },
    cancelButton: {
      fontSize: 17,
      color: colors.danger,
    },
    saveButton: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.primary,
    },
    formContainer: {
      flex: 1,
      padding: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.text,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    pickerContainer: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
    },
    picker: {
      height: 50,
      color: colors.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfWidth: {
      width: '48%',
    },
    foodInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    foodInput: {
      flex: 1,
      marginRight: 8,
    },
    addFoodButton: {
      backgroundColor: colors.primaryLight,
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addFoodButtonText: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: '600',
    },
    foodsList: {
      marginTop: 8,
    },
    foodItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 6,
      marginBottom: 4,
    },
    foodText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    removeFoodButton: {
      fontSize: 18,
      color: colors.danger,
      fontWeight: '600',
      paddingHorizontal: 8,
    },
    scrollContent: {
      paddingBottom: 50,
    },
  })
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
            {/* Nome da Dieta */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Dieta *</Text>
              <TextInput
                style={styles.input}
                value={formData.nome || ''}
                onChangeText={(text) => onFormChange('nome', text)}
                placeholder="Digite o nome da dieta"
              />
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.descricao || ''}
                onChangeText={(text) => onFormChange('descricao', text)}
                placeholder="Digite a descrição da dieta"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Criador */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Criador (Personal)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.criador || ''}
                  onValueChange={(value) => onFormChange('criador', value)}
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

            {/* Informações Nutricionais */}
            <Text style={styles.sectionTitle}>Informações Nutricionais</Text>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Calorias (kcal)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.calorias?.toString() || ''}
                  onChangeText={(text) => onFormChange('calorias', text)}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Proteínas (g)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.proteinas?.toString() || ''}
                  onChangeText={(text) => onFormChange('proteinas', text)}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Carboidratos (g)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.carboidratos?.toString() || ''}
                  onChangeText={(text) => onFormChange('carboidratos', text)}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.inputLabel}>Gorduras (g)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.gorduras?.toString() || ''}
                  onChangeText={(text) => onFormChange('gorduras', text)}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Lista de Refeições */}
            <MealList
              meals={formData.refeicoes || []}
              onAdd={onOpenMealModal}
              onRemove={onRemoveMeal}
            />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modal de Refeição */}
      <Modal
        visible={mealModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onCloseMealModal}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Refeição</Text>
            <TouchableOpacity onPress={onAddMeal}>
              <Text style={styles.saveButton}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Nome da Refeição */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Refeição *</Text>
              <TextInput
                style={styles.input}
                value={currentMeal.nome}
                onChangeText={(text) => onMealChange('nome', text)}
                placeholder="Ex: Café da manhã, Almoço, Jantar"
              />
            </View>

            {/* Horário */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Horário</Text>
              <TextInput
                style={styles.input}
                value={currentMeal.horario || ''}
                onChangeText={(text) => onMealChange('horario', text)}
                placeholder="Ex: 08:00, 12:30"
              />
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={currentMeal.descricao || ''}
                onChangeText={(text) => onMealChange('descricao', text)}
                placeholder="Descrição da refeição"
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Alimentos */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Alimentos ({currentMeal.alimentos.length})
              </Text>
              <View style={styles.foodInputContainer}>
                <TextInput
                  style={[styles.input, styles.foodInput]}
                  value={currentFood}
                  onChangeText={onFoodChange}
                  placeholder="Digite um alimento"
                />
                <TouchableOpacity
                  style={styles.addFoodButton}
                  onPress={onAddFood}
                >
                  <Text style={styles.addFoodButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              {currentMeal.alimentos.length > 0 && (
                <View style={styles.foodsList}>
                  {currentMeal.alimentos.map((food, index) => (
                    <View key={`food-${index}-${food}`} style={styles.foodItem}>
                      <Text style={styles.foodText}>{food}</Text>
                      <TouchableOpacity onPress={() => onRemoveFood(index)}>
                        <Text style={styles.removeFoodButton}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  )
}
