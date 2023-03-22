import { TProject } from '../../types/project'
import { useTheme } from '@mui/material'

type OwnProps = {
  project: TProject
}

// make it real pretty, lotta colors
export const ProjStats = ({ project }: OwnProps) => {
  const theme = useTheme()

  return (
    <div
      style={{
        minWidth: 400,
        color: theme.palette.text.secondary,
        paddingTop: 32
      }}
    >
      <div style={{ margin: 'auto', textAlign: 'center', fontSize: 24 }}>
        {project.tasks.length} Tasks
      </div>
    </div>
  )
}
