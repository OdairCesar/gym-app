import { StyleSheet } from 'react-native'

// Cores principais do sistema
export const Colors = {
  // Cores primárias
  primary: '#007AFF',
  primaryLight: '#F0F8FF', // Cor azul clara original para backgrounds
  primaryDark: '#0051D5',

  // Cores de status
  success: '#28a745',
  warning: '#FF9500',
  error: '#FF3B30',
  danger: '#FF3B30',
  info: '#5AC8FA',

  // Cores de fundo
  background: '#F2F2F7',
  backgroundSecondary: '#FFFFFF',

  // Cores de texto
  text: '#000000',
  textSecondary: '#8E8E93',
  textLight: '#FFFFFF',

  // Cores de borda
  border: '#E5E5EA',
  borderLight: '#C7C7CC',

  // Cores especiais
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Cores de background para botões
  successLight: '#E8F5E8',
  dangerLight: '#FFEBEE',
  primaryButtonLight: '#E3F2FD', // Cor original para botões de edição
}

// Tamanhos de fonte padronizados
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
}

// Espaçamentos padronizados
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
}

// Bordas padronizadas
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
}

// Sombras padronizadas
export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
}

// Estilos globais reutilizáveis
export const GlobalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  containerWithPadding: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },

  // Listas
  list: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },

  // Cards
  card: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    ...Shadows.md,
  },

  // Headers
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  // Títulos
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: Colors.text,
  },

  titleLarge: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.text,
  },

  titleMedium: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },

  titleSmall: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },

  // Texto
  text: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },

  textSecondary: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },

  textCenter: {
    textAlign: 'center',
  },

  // Inputs
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },

  inputGroup: {
    marginVertical: Spacing.md,
  },

  inputLabel: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  // Botões
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  buttonText: {
    color: Colors.textLight,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },

  buttonSecondary: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  buttonSecondaryText: {
    color: Colors.primary,
  },

  buttonSuccess: {
    backgroundColor: Colors.success,
  },

  buttonError: {
    backgroundColor: Colors.error,
  },

  buttonWarning: {
    backgroundColor: Colors.warning,
  },

  buttonSmall: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  // Modais
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
  },

  modalCancelButton: {
    fontSize: FontSizes.md,
    color: Colors.error,
  },

  modalSaveButton: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Formulários
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // Picker
  pickerContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  picker: {
    height: 50,
  },

  // Tags
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },

  tagPrimary: {
    backgroundColor: Colors.primary,
    color: Colors.textLight,
  },

  tagError: {
    backgroundColor: Colors.error,
    color: Colors.textLight,
  },

  tagSuccess: {
    backgroundColor: Colors.success,
    color: Colors.textLight,
  },

  tagSecondary: {
    backgroundColor: Colors.textSecondary,
    color: Colors.textLight,
  },

  // Ações
  actionButton: {
    padding: Spacing.sm,
  },

  actionButtonGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },

  // Utilitários de layout
  row: {
    flexDirection: 'row',
  },

  column: {
    flexDirection: 'column',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  alignCenter: {
    alignItems: 'center',
  },

  flex1: {
    flex: 1,
  },

  // Margens e paddings
  marginTop: {
    marginTop: Spacing.lg,
  },

  marginBottom: {
    marginBottom: Spacing.lg,
  },

  marginVertical: {
    marginVertical: Spacing.md,
  },

  marginHorizontal: {
    marginHorizontal: Spacing.lg,
  },

  paddingHorizontal: {
    paddingHorizontal: Spacing.lg,
  },

  paddingVertical: {
    paddingVertical: Spacing.md,
  },

  // Estilos específicos para badges
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },

  badgeText: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '500',
  },

  // Estilos de layout
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Labels
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },

  labelSmall: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    color: Colors.textSecondary,
  },

  // Textos coloridos
  textSuccess: {
    fontSize: FontSizes.xs,
    color: Colors.success,
    fontWeight: '600',
  },

  // Texto de botão pequeno
  buttonSmallText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
  },

  // Estilos para radio buttons
  radioGroup: {
    gap: Spacing.sm,
  },

  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },

  radioLabel: {
    fontSize: FontSizes.md,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },

  // Estilos para checkbox
  checkboxGroup: {
    marginVertical: Spacing.sm,
  },

  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },

  checkboxLabel: {
    fontSize: FontSizes.md,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
})
