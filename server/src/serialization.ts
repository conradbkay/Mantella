import { Project } from './models/Project'

// if we ever want to allow local file download and upload, make these real

export const serializeProject = (project: Project): string => {
  const projectJSON = JSON.stringify(project)
  return projectJSON
}

export const deserializeProject = (projectJSON: string) => {
  const project = JSON.parse(projectJSON)

  return project
}
