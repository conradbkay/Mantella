import { Project } from './../types'
import { ProjectProps } from '../../models/Project'
import { MutationResolvers } from '../../graphql/types'
import { ProjectModel } from '../../models/Project'
import { Types } from 'mongoose'

const createSwimlane: MutationResolvers['createSwimlane'] = async (
  parent,
  obj
) => {
  const project = await ProjectModel.findById(obj.projId)

  const newId = Types.ObjectId()

  const adding: any = { _id: newId }
  if (project) {
    project.swimlanes.push({
      name: obj.name || 'swimlane',
      taskIds: [],
      ...adding
    })

    const newProj = await project.save()

    const pure = await newProj.toObject()

    if (pure) {
      const newSwim = pure.swimlanes.find((swim) =>
        newId.equals(Types.ObjectId(swim._id))
      )

      if (!newSwim) {
        throw new Error('Swimlane Not created in createSwimlane!')
      }

      return {
        project: pure,
        swimlane: newSwim
      }
    }
  }
  return null
}
const editSwimlane: MutationResolvers['editSwimlane'] = async (parent, obj) => {
  const project = await ProjectModel.findById(obj.projId)

  if (project) {
    const swimlane: ProjectProps['swimlanes'][0] = (project.swimlanes as any).id(
      obj.swimId
    )

    swimlane.name = obj.newSwim.name || swimlane.name
    swimlane.taskIds = obj.newSwim.taskIds || swimlane.taskIds

    const newProj = await project.save()
    const pure = await purifyProject(newProj)

    const newSwim = pure ? (newProj.swimlanes as any).id(obj.swimId) : undefined

    if (!newSwim) {
      throw new Error('Swimlane not edited in editSwimlane!')
    }

    return {
      swimlane: newSwim,
      project: pure as Project
    }
  }
  return null
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
    const pure = await purifyProject(deleted)

    return { project: pure as Project, swimlane: null }
  }

  return null
}

export const swimlaneMutations = {
  createSwimlane,
  editSwimlane,
  deleteSwimlane
}
