import Color from 'color'

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

// colors are dark-mode designed by default
export const colorForLightMode = (color: string) => {
  return new Color(color).lightness(85).hex().toString()
}

export type TColor = typeof colors
