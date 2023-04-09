import { useEffect } from 'react'

import { $getRoot, $getSelection, EditorState } from 'lexical'

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot()
    const selection = $getSelection()

    console.log(root, selection)
  })
}

// TODO: lazy load
function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus()
  }, [editor])

  return null
}

export const Description = () => {
  const initialConfig = {
    namespace: 'Description',
    theme: {},
    onError: (error: Error) => console.error(error)
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onChange} />
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
    </LexicalComposer>
  )
}

/*
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2
  }
}
const getBlockStyle: any = (block: any) => {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote'
    default:
      return null
  }
}

const StyleButton = ({ onToggle, active, label, style }: any) => {
  let spanStyle = {
    color: '#999',
    cursor: 'pointer',
    marginRight: 16,
    padding: '2px 0',
    display: 'inline-block'
  }

  if (active) {
    spanStyle = { ...spanStyle, color: '#5890ff' }
  }

  return (
    <span
      style={spanStyle}
      onMouseDown={(e) => {
        e.preventDefault()
        onToggle(style)
      }}
    >
      {label}
    </span>
  )
}

const controlsContainerStyle: CSSProperties = {
  fontFamily: "'Helvetica', sans-serif",
  fontSize: 14,
  marginBottom: 5,
  userSelect: 'none'
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-two' },
  { label: 'H2', style: 'header-three' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' }
]

function BlockStyleControls({ editorState, onToggle }: any) {
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div style={controlsContainerStyle}>
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' }
]

function InlineStyleControls({ editorState, onToggle }: any) {
  const currentStyle = editorState.getCurrentInlineStyle()
  return (
    <div style={controlsContainerStyle}>
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  )
}

export const Description = ({
  editorState,
  setEditorState
}: {
  editorState: EditorState
  setEditorState: (newEditorState: EditorState) => void
}) => {
  const editor: any = useRef(null)

  const focusEditor = () => {
    if (editor && editor.current) {
      editor.current.focus()
    }
  }

  const handleKeyCommand = useCallback(
    (command, editorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command)
      if (newState) {
        setEditorState(newState)
        return 'handled'
      }
      return 'not-handled'
    },
    [setEditorState]
  )

  const mapKeyToEditorCommand = useCallback(
    (e) => {
      switch (e.keyCode) {
        case 9: // TAB
          const newEditorState = RichUtils.onTab(
            e,
            editorState,
            4 
          )
          if (newEditorState !== editorState) {
            setEditorState(newEditorState)
          }
          return null
      }
      return getDefaultKeyBinding(e)
    },
    [editorState, setEditorState]
  )

  let style: CSSProperties = {
    cursor: 'text',
    fontSize: 16,
    marginTop: 10
  }

  var contentState = editorState.getCurrentContent()
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      style = { ...style, display: 'none' }
    }
  }

  return (
    <div className="RichEditor-root">
      <BlockStyleControls
        editorState={editorState}
        onToggle={(blockType: any) => {
          const newState = RichUtils.toggleBlockType(editorState, blockType)
          setEditorState(newState)
        }}
      />
      <InlineStyleControls
        editorState={editorState}
        onToggle={(inlineStyle: any) => {
          const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle)
          setEditorState(newState)
        }}
      />
      <div
        style={{ margin: '12px 4px', ...style }}
        className="RichEditor-editor"
        onClick={focusEditor}
      >
        <Editor
          blockStyleFn={getBlockStyle}
          customStyleMap={styleMap}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={setEditorState}
          placeholder="Include any additional requirements or information..."
          ref={editor}
          spellCheck={true}
        />
      </div>
    </div>
  )
}
*/
