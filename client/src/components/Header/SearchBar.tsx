import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import { useAppSelector } from '../../store/hooks'
import { selectProjects } from '../../store/projects'
import Close from '@mui/icons-material/Close'
import fuzzysort from 'fuzzysort'
import { List, ListItem } from '@mui/material'
import { Link } from 'react-router-dom'

type TResult = {
  title: string
  projectId: string
  toId: string | null
}

// TODO: animation when closed
export const HeaderSearchBar = () => {
  const [value, setValue] = useState('')
  const [results, setResults] = useState<TResult[]>([])
  const projects = useAppSelector(selectProjects)

  const populateResults = (search: string) => {
    let possibleResults: TResult[] = []

    for (let project of projects) {
      possibleResults.push({
        title: 'Project: ' + project.name,
        projectId: project.id,
        toId: null
      })

      for (let list of project.lists) {
        possibleResults.push({
          title: 'List: ' + list.name,
          projectId: project.id,
          toId: list.id
        })
      }

      for (let task of project.tasks) {
        possibleResults.push({
          title: 'Task: ' + task.name,
          projectId: project.id,
          toId: task.id
        })
      }
    }

    let newResults = fuzzysort
      .go(search, possibleResults, {
        key: 'title',
        limit: 25,
        threshold: -10000
      })
      .map((result) => result.obj)

    setResults(newResults)
  }

  return (
    <Paper
      style={{
        width: 400
      }}
      sx={{
        p: '2px 4px',
        display: 'flex',
        ml: 'auto',
        alignItems: 'center',
        zIndex: 99999
      }}
    >
      <InputBase
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          populateResults(e.target.value)
        }}
        sx={{ ml: 1, flex: 1 }}
        placeholder={'Search Projects'}
      />
      {results.length !== 0 && (
        <>
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <Close onClick={() => setResults([])} />
          </IconButton>

          <Paper
            style={{
              width: 408,
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              top: 48,
              zIndex: 2,
              marginLeft: -4
            }}
          >
            <List>
              {results.map((result, i) => (
                <ListItem
                  button
                  key={result.title + i + result.toId}
                  component={Link}
                  onClick={() => {
                    setResults([])
                  }}
                  to={`/project/${result.projectId}#${result.toId || ''}`}
                >
                  {result.title}
                </ListItem>
              ))}
            </List>
          </Paper>
        </>
      )}
    </Paper>
  )
}
