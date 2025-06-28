import { Button, StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'
import { useAuth } from '@/context/authContext'

export default function PerfilScreen() {
  const { logout } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Button title="Sair Perfil" onPress={async () => await logout()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
