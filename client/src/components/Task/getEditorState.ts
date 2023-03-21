import { EditorState, convertFromRaw } from 'draft-js'

export const getEditorStateFromTaskDescription = (description: string) => {
  return EditorState.createWithContent(convertFromRaw(JSON.parse(description)))
}
