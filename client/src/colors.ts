import Color from 'color'

export const colors = {
  Red: '#C20026',
  Orange: '#C38300',
  Yellow: '#ffe100',
  Green: '#3D8F00',
  Blue: '#005BD2',
  Purple: '#7B39BC',
  Magenta: '#B52DB5',
  cyan: '#00A86C'
}

// colors are dark-mode designed by default
export const colorForLightMode = (color: string) => {
  return new Color(color).lightness(85).hex().toString()
}

/*for (const color in colors) {
  colors[color] = new Color(colors[color]).lightness(40).hex().toString()
}*/

export type TColor = typeof colors
