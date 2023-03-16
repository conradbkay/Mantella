import { format, isPast } from 'date-fns'
import { TTask } from '../types/project'
import { toDaysHHMMSS } from './utilities'
import { formatDistance } from 'date-fns'

// Jan 1st 12:02 am
const baseFormat = (date: Date): string => format(date, 'MMM do h:mm a')

const overdueFormat = (date: Date): string => {
  return 'Overdue by ' + formatDistance(new Date(), date)
}

const formatDueDateString = (date: Date, hasOver?: boolean): string => {
  return isPast(date) && hasOver
    ? overdueFormat(date)
    : 'Due ' + baseFormat(date)
}

export const formatDueDate = (task: TTask, hasOverDue?: boolean): string => {
  if (!task.dueDate) {
    return ''
  }

  if (!task.recurrance) {
    return formatDueDateString(new Date(task.dueDate), hasOverDue)
  }

  if (task.recurrance.interval) {
    return `Due every ${toDaysHHMMSS(
      task.recurrance.interval!,
      true
    )} next: ${formatDueDateString(new Date(task.dueDate), hasOverDue)}`
  }

  return formatDueDateString(new Date(task.dueDate), hasOverDue)
}
