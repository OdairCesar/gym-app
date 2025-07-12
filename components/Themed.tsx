/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from 'react-native'
import { useAppTheme } from '@/hooks/useAppTheme'

type ThemeProps = {
  lightColor?: string
  darkColor?: string
}

export type TextProps = ThemeProps & DefaultText['props']
export type ViewProps = ThemeProps & DefaultView['props']

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string,
) {
  const { colors, isDark } = useAppTheme()
  const theme = isDark ? 'dark' : 'light'
  const colorFromProps = props[theme]

  if (colorFromProps) {
    return colorFromProps
  } else {
    // Mapear colorName para as cores do novo sistema
    const colorMap: Record<string, string> = {
      text: colors.text,
      background: colors.background,
      tint: colors.primary,
      tabIconDefault: colors.textSecondary,
      tabIconSelected: colors.primary,
    }
    return colorMap[colorName] || colors.text
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')

  return <DefaultText style={[{ color }, style]} {...otherProps} />
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background',
  )

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />
}
