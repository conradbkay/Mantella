import Color from 'color'
import { useTheme } from '@mui/material'

export const colors = {
  Red: '#C20026',
  Orange: '#C38300',
  Green: '#3D8F00',
  Blue: '#005BD2',
  Purple: '#7B39BC',
  Magenta: '#B52DB5',
  cyan: '#00A86C',
  Yellow: '#D0CD00'
}

export type TColor = typeof colors

// colors are dark-mode designed by default
export const colorForLightMode = (color: string) => {
  return new Color(color).lightness(85).hex().toString()
}

export const invertColor = (hex: string) => {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16)

  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
}

export const transformDefault = (color: string, mode: 'dark' | 'light') => {
  return color === '#FFFFFF' ? (mode === 'dark' ? '#121212' : '#FFFFFF') : color
}

export const inverse = (color: string, by: number) => {
  const manip = new Color(color)

  const dark = manip.isDark()

  const func = dark ? 'lighten' : 'darken'

  return manip[func](dark ? by : by / 6).toString()
}

export const useTaskColor = (color?: string) => {
  const theme = useTheme()

  const backgroundColor =
    color && color.toUpperCase() !== '#FFFFFF' && color !== '#121212'
      ? theme.palette.mode === 'dark'
        ? color
        : colorForLightMode(color)
      : theme.palette.background.paper

  const taskColor = transformDefault(backgroundColor, theme.palette.mode)

  const textColor = invertColor(taskColor)
  const secondary = inverse(textColor, 0.2)

  return { backgroundColor, textColor, secondary, taskColor }
}
