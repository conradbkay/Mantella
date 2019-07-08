import { cloneDeep } from 'lodash'

export const id = (
  arr: Array<any & { id: string }>,
  passedId: string
): number => {
  return arr.findIndex(item => item.id === passedId)
}

export const formalize = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/,/g, '')
    .replace(/ /g, '')
}

export const filterItemsFromIds = <T = any>(
  ids: number[],
  items: { [id: string]: any } & T // add index signature
): T => {
  const newItems = cloneDeep(items) // changed in past :()
  Object.keys(newItems)
    .map(key => parseInt(key, 10)) // Object.keys returns strings nomatter what
    .forEach((key: any) => {
      if (!ids.includes(key)) {
        delete newItems[key]
      }
    })
  return newItems
}

export const getDaysInMonth = (month: number, year: number): Date[] => {
  // Since no month has fewer than 28 days
  const date: Date = new Date(year, month, 1)
  const days: Date[] = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

/*

export const getTasksProject = (taskId: string, stateProjects: TProjects) => {
  const projects = [...Object.values(stateProjects)]

  for (const project of projects) {
    for (const projectsColumn of Object.values(project.columns)) {
      if (projectsColumn && projectsColumn.taskIds.includes(taskId)) {
        return project
      }
    }
  }
  return
}

export const getUnassignedTasks = (
  filtered: TTask[],
  tasks: TTasks,
  project: TProject
) => {
  return filtered.filter(task => {
    const projSwimlanes = project.swimlaneOrder.map(id => project.swimlanes[id])
    const swimlaneTasks = projSwimlanes.reduce(
      (accum, swimlane) => {
        const swimlanesTasks = swimlane.taskIds.map(taskId => tasks[taskId])
        return [...accum, ...swimlanesTasks]
      },
      [] as TTask[]
    )
    return !swimlaneTasks.includes(task) // we don't want to duplicate
  })
}

export const getTasksSwimlane = (
  taskId: string,
  project: TProject
): TSwimLane | null => {
  let swimlaneReturn = null

  Object.values(project.swimlanes).map(swimlane => {
    if (swimlane.taskIds.includes(taskId)) {
      swimlaneReturn = swimlane
    }
    return
  })

  return swimlaneReturn
}

export const getProjIdFromColumnId = (
  projects: TProjects,
  columnId: string | undefined
): string | undefined => {
  let result
  if (columnId === undefined) {
    return undefined
  }
  Object.values(projects).map(project => {
    if (Object.keys(project.columns).includes(columnId.toString())) {
      result = project.id
    }
    return
  })
  return result
}

export const getAllColumnsArr = (projects: TProjects): TColumn[] => {
  return Object.values(projects).reduce(
    (accum, project) => [...accum, ...Object.values(project.columns)],
    []
  )
}

export const getAllTasksArr = (projects: TProjects): TTask[] => {
  let tasks: TTask[] = []

  Object.values(projects).map(project => {
    tasks = [...tasks, ...Object.values(project.tasks)]
  })

  return tasks
}

export const getAllTasks = (projects: TProjects): TTasks => {
  let tasks: TTasks = {}

  Object.values(projects).map(project => {
    tasks = {
      ...tasks,
      ...project.tasks
    }
    return
  })

  return tasks
}

export const getProjectIdFromTaskId = (
  projects: TProjects,
  taskId: string
): string => {
  let result = ''

  Object.values(projects).map(proj => {
    Object.values(proj.tasks).map(task => {
      if (task.id === taskId) {
        result = proj.id
      }
      return
    })
  })

  return result
}

export const moveInArray = (element: any, index: number, offset: number) => {
  const newIndex = index + offset

  const newArr = [...element]

  if (newIndex > -1 && newIndex < newArr.length) {
    const removedElement = newArr.splice(index, 1)[0]
    newArr.splice(newIndex, 0, removedElement)
  }

  return newArr
}
*/
