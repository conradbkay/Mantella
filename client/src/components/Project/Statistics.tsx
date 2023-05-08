import { TProject } from '../../types/project'
import { useTheme } from '@mui/material'
import { Circle } from '../../utils/Circle'
import Color from 'color'

type OwnProps = {
  project: TProject
}

// make it stylistic with good colors
export const ProjStats = ({ project }: OwnProps) => {
  const theme = useTheme()

  const cols: [number, string][] = [
    [project.tasks.length, 'Tasks'],
    [0, 'Created'],
    [0, 'Started'],
    [0, 'Completed']
  ]
  project.lists.forEach((list) => {
    list.taskIds.forEach((ids, i) => {
      cols[i + 1][0] += ids.length
    })
  })

  return (
    <div
      style={{
        color: theme.palette.text.secondary,
        paddingTop: 16
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {cols.map((col, i) => {
          const color =
            i === 3
              ? theme.palette.success.main
              : i === 2
              ? theme.palette.warning.main
              : i === 1
              ? theme.palette.text.secondary
              : theme.palette.text.primary

          const percentOf = +((col[0] / cols[0][0]) * 100).toFixed(2) // + is to convert to number which will remove trailing zeros
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                margin: '8px 0',
                textAlign: 'center',
                width: i ? '33.33%' : '100%',
                color
              }}
            >
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 32,
                  marginRight: 4,
                  color: theme.palette.text.primary
                }}
              >
                <div>
                  {i ? (
                    <Circle
                      progress={percentOf}
                      progressColor={color}
                      textColor={color}
                      bgColor={new Color(theme.palette.background.paper)
                        .lighten(0.6)
                        .toString()}
                      textStyle={{ fontSize: 80 }}
                    />
                  ) : (
                    col[0]
                  )}
                </div>
              </span>
              {col[1]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
