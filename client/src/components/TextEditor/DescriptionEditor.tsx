import { useEffect } from 'react'

import {
  InitialConfigType,
  LexicalComposer
} from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { AutoLinkNode } from '@lexical/link'
import { ListNode, ListItemNode } from '@lexical/list'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import {
  registerCodeHighlighting,
  CodeHighlightNode,
  CodeNode
} from '@lexical/code'
import { $getRoot, $createParagraphNode } from 'lexical'
import './text-editor.css'
import { useTheme } from '@mui/material'

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text)
    if (match === null) {
      return null
    }
    const fullMatch = match[0]
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
      attributes: { rel: 'noopener', target: '_blank' } // newtab
    }
  }
]

function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return registerCodeHighlighting(editor)
  }, [editor])
  return null
}

function DescriptionUpdatePlugin({
  description
}: {
  description?: string | null
}) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (description !== undefined) {
      editor.update(() => {
        try {
          if (description) {
            // Parse the JSON string and set the editor state
            const editorState = editor.parseEditorState(description)
            editor.setEditorState(editorState)
          } else {
            // Clear the editor if description is null or empty
            const root = $getRoot()
            root.clear()
            root.append($createParagraphNode())
          }
        } catch (error) {
          console.error('Failed to parse description:', error)
          // If parsing fails, clear the editor
          const root = $getRoot()
          root.clear()
          root.append($createParagraphNode())
        }
      })
    }
  }, [editor, description])

  return null
}

export const Description = ({
  onChange,
  initialState,
  readOnly,
  color,
  description
}: {
  onChange: (newStr: string) => void
  initialState?: string
  readOnly?: boolean
  color: string
  description?: string | null
}) => {
  const theme = useTheme()

  // make it actually change when text changes

  const initialConfig: InitialConfigType = {
    namespace: 'Description',
    theme: {},
    editable: !readOnly,
    nodes: [AutoLinkNode, CodeHighlightNode, CodeNode, ListNode, ListItemNode],
    onError: (error: Error) => console.error(error)
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <DescriptionUpdatePlugin description={description} />
      <div style={{ margin: readOnly ? 4 : '12px 4px' }}>
        <div style={{ textAlign: 'left', position: 'relative' }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                readOnly={readOnly}
                style={
                  readOnly
                    ? { outline: 'none', color }
                    : {
                        outline: 'none',
                        padding: '16px 12px',
                        border: '1px solid ' + theme.palette.divider,
                        borderRadius: 8,
                        color
                      }
                }
              />
            }
            placeholder={
              <div
                style={{
                  overflow: 'hidden',
                  position: 'absolute',
                  textOverflow: 'ellipsis',
                  top: 16,
                  left: 12,
                  fontSize: '15px',
                  userSelect: 'none',
                  display: 'inline-block',
                  pointerEvents: 'none',
                  color
                }}
              >
                Enter some text...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin
            onChange={(editorState) =>
              onChange(JSON.stringify(editorState.toJSON()))
            }
          />
          <HistoryPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <AutoLinkPlugin matchers={MATCHERS} />
        </div>
      </div>
    </LexicalComposer>
  )
}
