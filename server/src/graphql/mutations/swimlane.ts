import { Project } from './../types'
import { ProjectProps } from '../../models/Project'
import { MutationResolvers } from '../../graphql/types'
import { ProjectModel } from '../../models/Project'
import uuid from 'uuid'
const createSwimlane: MutationResolvers['createSwimlane'] = async (
  parent,
  obj
) => {
  const project = await ProjectModel.findOne({ id: obj.projId })

  const newId = uuid()

  const adding = { id: newId }
  if (project) {
    project.swimlanes.push({
      name: obj.name || 'swimlane',
      taskIds: [],
      ...adding
    })

    const newProj = await project.save()

    const pure = await newProj.toObject()

    if (pure) {
      const newSwim = newProj.swimlanes.find((swim) => newId === swim.id)

      if (!newSwim) {
        throw new Error('Swimlane Not created in createSwimlane!')
      }

      return {
        project: pure,
        swimlane: newSwim
      }
    }
  }

  throw new Error('proj not found')
}
const editSwimlane: MutationResolvers['editSwimlane'] = async (parent, obj) => {
  const project = await ProjectModel.findOne({ id: obj.projId })

  if (project) {
    const swimlane: ProjectProps['swimlanes'][0] = project.swimlanes.find(
      (swim) => swim.id === obj.swimId
    )!

    swimlane.name = obj.newSwim.name || swimlane.name
    swimlane.taskIds = obj.newSwim.taskIds || swimlane.taskIds

    const newProj = await project.save()
    const pure = await newProj.toObject()

    const newSwim = pure
      ? newProj.swimlanes.find((swim) => swim.id === obj.swimId)
      : undefined

    if (!newSwim) {
      throw new Error('Swimlane not edited in editSwimlane!')
    }

    return {
      swimlane: newSwim,
      project: pure as Project
    }
  }

  throw new Error('proj not found')
}
const deleteSwimlane: MutationResolvers['deleteSwimlane'] = async (
  parent,
  obj
) => {
  const deleted = await ProjectModel.findByIdAndUpdate(
    obj.projId,
    {
      $pull: {
        swimlanes: {
          _id: obj._id
        }
      }
    },
    { new: true }
  )
  if (deleted) {
    const pure = await deleted.toObject()

    return { project: pure as Project, swimlane: null }
  }

  throw new Error('proj not found')
}

export const swimlaneMutations = {
  createSwimlane,
  editSwimlane,
  deleteSwimlane
}
