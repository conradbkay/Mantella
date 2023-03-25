import { TwitterPicker } from 'react-color'
import { colors } from '../colors'
type OwnProps = {
  color: string
  onChange(color: string | string[]): void
}

export const ChooseColor = (props: OwnProps) => {
  return (
    <TwitterPicker
      triangle="hide"
      width={'208px'}
      colors={Object.values(colors)}
      color={props.color}
      onChangeComplete={(color) => props.onChange(color.hex)}
    />
  )
}
