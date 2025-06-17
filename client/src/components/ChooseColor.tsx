import { Button, ButtonBase, IconButton } from '@mui/material'
import { useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import Add from '@mui/icons-material/Add'
import { TProject } from '../types/project'
import { useEditProjectMutation } from '../store/api'

type OwnProps = {
  selected?: string
  project: TProject
  onChange(color: string): void
}

export const ChooseColor = ({ selected, project, onChange }: OwnProps) => {
  const [adding, setAdding] = useState('')
  const [editProject] = useEditProjectMutation()

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {project.colors
          ? project.colors.map((color, i) => (
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
            ))
          : null}
        {adding ? (
          <>
            <Button onClick={() => setAdding('')}>Cancel</Button>
            <Button
              variant="outlined"
              sx={{ ml: 1 }}
              onClick={async () => {
                setAdding('')
                onChange(adding)
                await editProject({
                  id: project.id,
                  newProj: {
                    colors: [...(project.colors || []), adding]
                  }
                })
              }}
            >
              Add
            </Button>
          </>
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
