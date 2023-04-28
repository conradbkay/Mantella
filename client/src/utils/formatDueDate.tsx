import { formatRelative } from 'date-fns'
import { TTask } from '../types/project'
import { toDaysHHMMSS } from './utilities'

export const formatDate = (date: Date) => {
  let str = formatRelative(date, new Date())
  str = str[0].toUpperCase() + str.slice(1)
  return str
}

const formatDueDateString = (date: Date): string => {
  return 'Due ' + formatDate(date)
}

export const formatDueDate = (task: TTask): string => {
  if (!task.dueDate) {
    return ''
  }

  if (task.recurrance && task.recurrance.interval) {
    return `Due every ${toDaysHHMMSS(
      task.recurrance.interval!,
      true
    )} next: ${formatDueDateString(new Date(task.dueDate))}`
  }

  return formatDueDateString(new Date(task.dueDate))
}
