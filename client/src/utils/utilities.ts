import { cloneDeep } from 'lodash'
import { TProject, TTask, TList } from '../types/project'

export const toDaysHHMMSS = (s: number, verbose?: true): string => {
  let result = ''

  const days = Math.floor(s / 86400)
  s -= days * 86400
  if (days) {
    result += `${days} Day${days !== 1 ? 's ' : ' '}`
  }

  if (verbose) {
    const hours = Math.floor(s / 3600)
    s -= hours * 3600
    if (hours > 0) {
      result += `${hours} Hour${hours !== 1 ? 's ' : ' '}`
    }
    const minutes = Math.floor(s / 60)
    s -= minutes * 60
    if (minutes > 0) {
      result += `${minutes} Minute${minutes !== 1 ? 's ' : ' '}`
    }
    if (hours < 1 && s > 0) {
      result += `${s} second${s !== 1 ? 's' : ''}`
    }
  } else {
    const measuredTime = new Date(null as any)
    measuredTime.setSeconds(s)

    result += measuredTime.toISOString().slice(11, 19) // 8:43:32
    if (result.slice(0, 2) === '00') {
      result = result.slice(3)
    } else if (result.slice(0, 1) === '0') {
      result = result.slice(1)
    }
  }
  return result // 2 days, 8:43:32
}

export const id = (
  arr: Array<any & { id: string }>,
  passedId: string
): number => {
  return arr.findIndex((item) => item.id === passedId)
}

export const formalize = (str: string): string => {
  return str.toLowerCase().replace(/,/g, '').replace(/ /g, '')
}

export const filterItemsFromIds = <T = any>(
  ids: number[],
  items: { [id: string]: any } & T // add index signature
): T => {
  const newItems = cloneDeep(items) // changed in past :()
  Object.keys(newItems)
    .map((key) => parseInt(key, 10)) // Object.keys returns strings nomatter what
    .forEach((key: any) => {
      if (!ids.includes(key)) {
        delete newItems[key]
      }
    })
  return newItems
}

export const getAllTasks = (projects: TProject[]): TTask[] => {
  let tasks: TTask[] = []

  projects.map((project) => {
    tasks = [...tasks, ...project.tasks]
    return
  })

  return tasks
}

export const getAllListsArr = (projects: TProject[]): TList[] => {
  let lists: TList[] = []

  projects.map((project) => {
    lists = [...lists, ...project.lists]
  })

  return lists
}

export const getProjectIdFromTaskId = (
  projects: TProject[],
  taskId: string
): string => {
  let result = ''

  Object.values(projects).map((proj) => {
    Object.values(proj.tasks).map((task) => {
      if (task.id === taskId) {
        result = proj.id
      }
      return
    })
  })

  return result
}

export const moveInArray = (element: any, index: number, newIndex: number) => {
  const newArr = [...element]

  if (newIndex > -1 && newIndex < newArr.length) {
    const removedElement = newArr.splice(index, 1)[0]
    newArr.splice(newIndex, 0, removedElement)
  }

  return newArr
}
