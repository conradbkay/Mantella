import { createFileRoute, useParams } from '@tanstack/react-router'
import { Project } from '../components/Project/Project'

export const Route = createFileRoute('/_auth/project/$id')({
  component: ProjectComponent
})

function ProjectComponent() {
  const { id } = useParams({ from: '/_auth/project/$id' })
  return <Project params={{ id }} />
}
