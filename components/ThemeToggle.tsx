import React from 'react'
import { View, Text, TouchableOpacity, Switch } from 'react-native'
import { useAppTheme } from '../hooks/useAppTheme'

const ThemeToggle: React.FC = () => {
  const { theme, isDark, setTheme, colors, styles } = useAppTheme()
  const handleToggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <View style={[styles.card, { marginHorizontal: 16 }]}>
      <Text style={styles.titleMedium}>Configurações de Tema</Text>

      <View style={styles.marginVertical}>
        <Text style={styles.text}>Tema atual: {theme}</Text>
        <Text style={styles.textSecondary}>
          {isDark ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}
        </Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.text}>Alternar Tema</Text>
        <Switch
          value={isDark}
          onValueChange={() => setTheme(isDark ? 'light' : 'dark')}
          thumbColor={isDark ? colors.primary : colors.background}
          trackColor={{
            false: colors.border,
            true: colors.primary,
          }}
        />
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.primaryButton]}
          onPress={() => setTheme('light')}
        >
          <Text style={styles.primaryButtonText}>Tema Claro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton]}
          onPress={() => setTheme('dark')}
        >
          <Text style={styles.secondaryButtonText}>Tema Escuro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.info }]}
          onPress={() => setTheme('system')}
        >
          <Text style={styles.buttonText}>Sistema</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.warning }]}
          onPress={handleToggleTheme}
        >
          <Text style={styles.buttonText}>Alternar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ThemeToggle
