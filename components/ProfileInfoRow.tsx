import { View, Text, StyleSheet } from 'react-native'
import { useAppTheme } from '@/hooks/useAppTheme'

interface Props {
  label: string
  value?: string | null
}

export function ProfileInfoRow({ label, value }: Props) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    row: {
      marginBottom: 12,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    label: {
      fontWeight: '600',
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '500',
    },
  })

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  )
}
