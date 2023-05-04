import { ButtonBase, IconButton } from '@mui/material'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import Add from '@mui/icons-material/Add'

type OwnProps = {
  selected?: string
  colors: string[]
  onChange(color: string): void
  create(color: string): void
}

export const ChooseColor = ({
  selected,
  colors,
  onChange,
  create
}: OwnProps) => {
  const [adding, setAdding] = useState(false)

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {colors.map((color, i) => (
          <ButtonBase
            onClick={() => onChange(color)}
            key={i}
            style={{ backgroundColor: color, borderRadius: 4, margin: 8 }}
          />
        ))}
        <IconButton
          onClick={() => {
            if (!adding) {
              setAdding(true)
            } else {
              create(selected || '#00f')
            }
          }}
        >
          <Add />
        </IconButton>
      </div>
      {adding && <HexColorPicker color={selected} onChange={onChange} />}
    </div>
  )
}
