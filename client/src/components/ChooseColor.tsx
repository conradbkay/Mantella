import { Button, ButtonBase, IconButton } from '@mui/material'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import Add from '@mui/icons-material/Add'
import { setProjectColors } from '../actions/project'
import { useDispatch } from 'react-redux'
import { TProject } from '../types/project'

type OwnProps = {
  selected?: string
  project: TProject
  onChange(color: string): void
}

export const ChooseColor = ({ selected, project, onChange }: OwnProps) => {
  const [adding, setAdding] = useState('')

  const dispatch = useDispatch()

  const { colors } = project

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {colors.map((color, i) => (
          <ButtonBase
            onClick={() => onChange(color)}
            key={i}
            style={{
              backgroundColor: color,
              borderRadius: 4,
              margin: 4,
              outline: color === selected ? '2px solid #FFF' : undefined,
              width: 32,
              height: 32
            }}
          />
        ))}
        {adding ? (
          <Button
            onClick={async () => {
              setAdding('')
              onChange(adding)
              await setProjectColors(dispatch, project, [
                ...colors,
                adding as string
              ])
            }}
          >
            Confirm
          </Button>
        ) : (
          <IconButton
            onClick={() => {
              if (!adding) {
                setAdding('#FFF')
              }
            }}
          >
            <Add />
          </IconButton>
        )}
      </div>
      {adding && (
        <div style={{ position: 'absolute', zIndex: 2 }}>
          <HexColorPicker
            color={adding}
            onChange={(color) => setAdding(color)}
          />
        </div>
      )}
    </div>
  )
}
