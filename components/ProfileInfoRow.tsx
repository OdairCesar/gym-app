import { View, Text, StyleSheet } from 'react-native'

interface Props {
  label: string
  value?: string | null
}

export function ProfileInfoRow({ label, value }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
})
