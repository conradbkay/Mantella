export const pls = 'pls'

/*
const baseFormat = (date: Date): string => format(date, 'MMM do h:mm a')
const passedFormat = (date: Date): string => {
  if (differenceInSeconds(new Date(), date) === 0) {
    return 'Overdue by < 1 Minute'
  }
  return (
    'Overdue by ' + toDaysHHMMSS(differenceInSeconds(new Date(), date), true)
  )
}
*/
/*
const god = (date: Date, hasOver?: boolean): string => {
  if (
    hasOver &&
    differenceInSeconds(new Date(), date) < 60 &&
    differenceInSeconds(new Date(), date) > 0
  ) {
    return 'Overdue by < 1 Minute'
  }
  return hasPassed(date) && hasOver
    ? passedFormat(date)
    : 'Due ' + baseFormat(date)
}
*/

/*
export const formatDueDate = (task: TTask, hasOverDue?: boolean): string => {
  if (!task.dueDate) {
    return ''
  }

  if (task.startDate && task.dueDate) {
    return (
      // tslint:disable-next-line:prefer-template
      format(task.startDate, 'MMM d') +
      ' - ' +
      format(task.dueDate, 'MMM d, h:mm a')
    )
  }
  if (!task.recurrance) {
    return god(task.dueDate, hasOverDue)
  }

  if (task.recurrance === 'daily') {
    return `Due every day at ${format(task.dueDate, 'h:mm a')} next: ${god(
      task.dueDate,
      hasOverDue
    )}`
  }

  if (task.recurrance === 'weekly') {
    return `Due every week on ${format(
      task.dueDate,
      'eee h:mm a'
    )} next: ${baseFormat(task.dueDate)}`
  }

  if (task.recurrance === 'monthly') {
    return 'Due every month on the' + format(task.dueDate, 'do at h:mm a') // due every month on the 23rd at 3:24 AM
  }

  return 'Due on the next big thonk?'
}

*/
