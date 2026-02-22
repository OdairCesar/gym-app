import { View, Text, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useAppTheme } from '@/hooks/useAppTheme'

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name']

interface Props {
  label: string
  value?: string | null
  icon?: IconName
  iconColor?: string
}

export function ProfileInfoRow({ label, value, icon, iconColor }: Props) {
  const { colors } = useAppTheme()

  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    textWrapper: {
      flex: 1,
    },
    label: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    value: {
      fontSize: 15,
      color: colors.text,
      fontWeight: '500',
    },
    valueEmpty: {
      fontSize: 15,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
  })

  return (
    <View style={styles.row}>
      {icon && (
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={iconColor ?? colors.primary}
          />
        </View>
      )}
      <View style={styles.textWrapper}>
        <Text style={styles.label}>{label}</Text>
        {value ? (
          <Text style={styles.value}>{value}</Text>
        ) : (
          <Text style={styles.valueEmpty}>Não informado</Text>
        )}
      </View>
    </View>
  )
}
