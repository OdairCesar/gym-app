import { useTheme } from '../context/themeContext'

export const useAppTheme = () => {
  const { theme, currentColors, currentStyles, isDark, toggleTheme, setTheme } =
    useTheme()

  return {
    theme,
    colors: currentColors,
    styles: currentStyles,
    isDark,
    toggleTheme,
    setTheme,
  }
}
