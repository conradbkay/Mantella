import { TTask } from '../types/project'
import { isSameDay } from 'date-fns/fp'
import { addDays } from 'date-fns'
import { TFilterData } from '../components/Project/types'

const filterByDate = (
  task: TTask,
  filterData: TFilterData['dueDate']
): boolean => {
  if (filterData && !filterData[0] && !filterData[1]) {
    return true
  }
  switch (filterData) {
    case 'all':
      return true
    case 'none':
      return !Boolean(task.dueDate)
    case 'has':
      return Boolean(task.dueDate)
    case 'today':
    case 'tomorrow':
      if (!task.dueDate) {
        return false
      }
      const amount = filterData === 'today' ? 0 : 1
      return isSameDay(addDays(new Date(), amount), new Date(task.dueDate))
    default:
      if (!task.dueDate) {
        return false
      }

      const time = new Date(task.dueDate).getTime()

      if (
        (filterData[0] && time < filterData[0].getTime()) ||
        (filterData[1] && time > filterData[1].getTime())
      ) {
        return false
      }

      return true
  }
}

const filterByPoints = (
  task: TTask,
  filterData: TFilterData['points']
): boolean => {
  return (
    !filterData ||
    (task.points >= filterData[0] &&
      task.points <= (filterData[1] === 50 ? Infinity : filterData[1]))
  )
}

const filterByColor = (
  task: TTask,
  filterData: TFilterData['color']
): boolean => {
  return (
    !filterData ||
    filterData.includes('all') ||
    filterData.map((c) => c.toLowerCase()).includes(task.color.toLowerCase())
  )
}

export const filterTask = (task: TTask, filterData: TFilterData): boolean => {
  return (
    filterByColor(task, filterData.color) &&
    filterByPoints(task, filterData.points) &&
    filterByDate(task, filterData.dueDate)
  )
}

export const filterTasks = (tasks: TTask[], filter: TFilterData): TTask[] => {
  return tasks.filter((task) => filterTask(task, filter))
}
