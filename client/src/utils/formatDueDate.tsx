import { isPast } from 'date-fns'
import { TTask } from '../types/project'
import { toDaysHHMMSS } from './utilities'
import { formatDistanceToNowStrict } from 'date-fns'

// Jan 1st 12:02 am
const baseFormat = (date: Date): string => formatDistanceToNowStrict(date)

const overdueFormat = (date: Date): string => {
  return 'Overdue by ' + formatDistanceToNowStrict(date)
}

const formatDueDateString = (date: Date, hasOver?: boolean): string => {
  return isPast(date) && hasOver
    ? overdueFormat(date)
    : 'Due in ' + baseFormat(date)
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
