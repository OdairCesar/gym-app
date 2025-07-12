import { StyleSheet } from 'react-native'

// Cores principais do sistema - Tema Escuro
export const DarkColors = {
  // Cores primárias
  primary: '#0A84FF',
  primaryLight: '#2C2C2E', // Cor mais suave para backgrounds
  primaryDark: '#0040DD',

  // Cores de status
  success: '#32D74B',
  warning: '#FF9F0A',
  error: '#FF453A',
  danger: '#FF453A',
  info: '#64D2FF',

  // Cores de fundo
  background: '#121212', // Fundo mais suave que preto puro
  backgroundSecondary: '#2C2C2E', // Card background mais visível

  // Cores de texto
  text: '#FFFFFF',
  textSecondary: '#ABABAB', // Texto secundário mais legível
  textLight: '#FFFFFF',

  // Cores de borda
  border: '#48484A', // Bordas mais visíveis
  borderLight: '#5A5A5A',

  // Cores especiais
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',

  // Cores de background para botões
  successLight: '#1B2D1B',
  dangerLight: '#2D1B1B',
  primaryButtonLight: '#1B2B3A', // Cor escura para botões de edição
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
    shadowColor: DarkColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: DarkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: DarkColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
}

// Estilos globais reutilizáveis - Tema Escuro
export const DarkGlobalStyles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: DarkColors.background,
  },

  containerWithPadding: {
    flex: 1,
    backgroundColor: DarkColors.background,
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
    backgroundColor: DarkColors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: DarkColors.border,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },

  // Headers
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: DarkColors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: DarkColors.border,
  },

  // Títulos
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: DarkColors.text,
  },

  titleLarge: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: DarkColors.text,
  },

  titleMedium: {
    fontSize: FontSizes.xl,
    fontWeight: 'bold',
    color: DarkColors.text,
  },

  titleSmall: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: DarkColors.text,
  },

  // Texto
  text: {
    fontSize: FontSizes.md,
    color: DarkColors.text,
  },

  textSecondary: {
    fontSize: FontSizes.sm,
    color: DarkColors.textSecondary,
  },

  textCenter: {
    textAlign: 'center',
  },

  // Inputs
  input: {
    backgroundColor: DarkColors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    borderWidth: 1,
    borderColor: DarkColors.border,
    marginBottom: Spacing.lg,
    color: DarkColors.text,
  },

  inputGroup: {
    marginVertical: Spacing.md,
  },

  inputLabel: {
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: DarkColors.text,
    marginBottom: Spacing.sm,
  },

  // Botões
  button: {
    backgroundColor: DarkColors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  buttonText: {
    color: DarkColors.textLight,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },

  buttonSecondary: {
    backgroundColor: DarkColors.backgroundSecondary,
    borderWidth: 1,
    borderColor: DarkColors.border,
  },

  buttonSecondaryText: {
    color: DarkColors.primary,
  },

  buttonSuccess: {
    backgroundColor: DarkColors.success,
  },

  buttonError: {
    backgroundColor: DarkColors.error,
  },

  buttonWarning: {
    backgroundColor: DarkColors.warning,
  },

  buttonSmall: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },

  // Botão de tema
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: DarkColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },

  themeButtonText: {
    color: DarkColors.textLight,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },

  // Modais
  modalContainer: {
    flex: 1,
    backgroundColor: DarkColors.background,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: DarkColors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: DarkColors.border,
  },

  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: DarkColors.text,
  },

  modalCancelButton: {
    fontSize: FontSizes.md,
    color: DarkColors.error,
  },

  modalSaveButton: {
    fontSize: FontSizes.md,
    color: DarkColors.primary,
    fontWeight: '600',
  },

  // Formulários
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },

  // Picker
  pickerContainer: {
    backgroundColor: DarkColors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: DarkColors.border,
  },

  picker: {
    height: 50,
    color: DarkColors.text,
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
    backgroundColor: DarkColors.primary,
    color: DarkColors.textLight,
  },

  tagError: {
    backgroundColor: DarkColors.error,
    color: DarkColors.textLight,
  },

  tagSuccess: {
    backgroundColor: DarkColors.success,
    color: DarkColors.textLight,
  },

  tagSecondary: {
    backgroundColor: DarkColors.textSecondary,
    color: DarkColors.textLight,
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
    backgroundColor: DarkColors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
  },

  badgeText: {
    fontSize: FontSizes.xs,
    color: DarkColors.primary,
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
    color: DarkColors.textSecondary,
  },

  labelSmall: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    color: DarkColors.textSecondary,
  },

  // Textos coloridos
  textSuccess: {
    fontSize: FontSizes.xs,
    color: DarkColors.success,
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
    color: DarkColors.text,
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
    color: DarkColors.text,
    marginLeft: Spacing.sm,
  },

  // Estilos para telas de perfil
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  pageTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: 'bold',
    color: DarkColors.text,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },

  actionButtonsContainer: {
    gap: Spacing.md,
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: DarkColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },

  primaryButtonText: {
    color: DarkColors.textLight,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: DarkColors.textSecondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },

  secondaryButtonText: {
    color: DarkColors.textLight,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },

  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: DarkColors.error,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...Shadows.sm,
  },

  dangerButtonText: {
    color: DarkColors.textLight,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
})
