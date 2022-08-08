import {
  Select,
  MenuItem,
  FormControl,
  FormHelperText
} from '@material-ui/core'

import { colors } from '../../colors'
import uuidv1 from 'uuid/v1'

type OwnProps = {
  color?: string[] | string
  hasAllOption?: boolean
  onChange(color: string | string[]): void
}

export const ChooseColor = (props: OwnProps) => {
  const { hasAllOption } = props
  const gradientNames = `linear-gradient(to right, ${Object.values(colors)
    .slice(1)
    .join(', ')})`

  return (
    <FormControl fullWidth>
      <Select
        multiple={props.hasAllOption}
        fullWidth
        value={props.color}
        onChange={(e: any) => props.onChange(e.target.value)}
      >
        {hasAllOption && (
          <MenuItem
            value="all"
            style={{
              background: gradientNames
            }}
          >
            Any
          </MenuItem>
        )}
        {Object.keys(colors).map((key: any, i) => (
          <MenuItem
            style={{ backgroundColor: (colors as any)[key] || 'white' }}
            key={uuidv1()}
            value={(colors as any)[key]}
          >
            {key}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Color</FormHelperText>
    </FormControl>
  )
}
