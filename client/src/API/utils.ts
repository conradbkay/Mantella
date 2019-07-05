export const haha = 'haha'

/*
export const resToNiceProjects = (
  resProjects: ProjectFieldsFragment[]
): TProjects => {
  if (resProjects) {
    const result: TProjects = {}
    resProjects.map(resProject => {
      const proj = resToNiceProject(resProject)
      result[proj.id] = proj
      return
    })
    return result
  }
  throw new Error(
    'You dissapoint me, son, why you no good in restoNiceProjects'
  )
}


export const resToNiceSwimlanes = (
  resSwimlanes: ProjectFieldsFragment['swimlanes']
): TSwimLanes => {
  const swimlanes: TSwimLanes = {}
  resSwimlanes.map(swimlane => {
    swimlanes[swimlane.id as string] = {
      taskIds: swimlane.taskIds,
      name: swimlane.name,
      id: swimlane.id as string
    }
  })

  return swimlanes
}

export const resToNiceProject = (
  resProject: ProjectFieldsFragment
): TProject => {
  if (resProject && resProject.id) {
    const columns: TColumns = {}
    resProject.columns.map(column => {
      columns[column.id as string] = {
        name: column.name,
        id: column.id,
        isCompletedColumn: column.isCompletedColumn || false,
        taskIds: column.taskIds || [],
        taskLimit: column.taskLimit || undefined
      }
    })

    const swimlanes: TSwimLanes = resToNiceSwimlanes(resProject.swimlanes)

    const tasks: TTasks = {}
    resProject.tasks.map(task => {
      tasks[task.id] = resToNiceTask(task)
    })

    const tags: TTags = {}

    if (resProject.tags) {
      resProject.tags.map(tag => {
        tags[tag.id] = {
          ...tag,
          name: tag.name || '',
          color: tag.color || colors.White,
          id: tag.id as string
        }
      })
    }

    return {
      name: resProject.name,
      id: resProject.id,
      tags: tags || {},
      users: {},
      columnOrder:
        resProject.columnIds || resProject.columns.map(col => col.id),
      swimlaneOrder: Object.values(swimlanes).map(swim => swim.id),
      selectingMember: null,
      columns,
      swimlanes,
      tasks
    }
  }
  throw new Error(
    'YOU LIBTARD, YOU ARE DUMB BOY,  resToNiceProject so bad, undefined parameter man'
  )
}

export const resToNiceTask = (resTask: Partial<TaskFieldsFragment>): TTask => {
  if (resTask && resTask.id && resTask.comments) {
    const comments = resTask.comments.map(
      (comment: TaskFieldsFragment['comments'][0]) => {
        return {
          ...comment,
          dateAdded: new Date(Date.parse(comment.dateAdded) * 1000),
          lastEdited: (comment.lastEdited
            ? new Date(Date.parse(comment.lastEdited) * 1000)
            : null) as any
        }
      }
    )

    let subTasks: TSubtask[] = []

    if (resTask.subTasks) {
      subTasks = resTask.subTasks.map(
        (subTask: TaskFieldsFragment['subTasks'][0]) => {
          return {
            id: subTask.id as string,
            name: subTask.name,
            completed: subTask.completed
          }
        }
      )
    }

    return {
      id: resTask.id as string,
      name: resTask.name || 'No Name Task',
      completed: resTask.completed || false,
      tags: resTask.tags || [],
      assignedUsers: (resTask.assignedUsers as string[]) || [],
      description: resTask.description as string,
      dueDate: resTask.dueDate,
      startDate: resTask.startDate,
      recurrance: resTask.recurrance as any,
      color: resTask.color || '#FFFFFF',
      subTasks: subTasks || [],
      timeWorkedOn: resTask.timeWorkedOn || 0,
      comments: comments || [],
      points: resTask.points || 0
    }
  }
  throw new Error(
    'REEE! ResTask no defined in API converter, YOU ARE DUMB BOY!'
  )
}
*/
