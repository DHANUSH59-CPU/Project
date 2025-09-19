import React from 'react'; // Removed unused useEffect, useRef
import Editor from "@monaco-editor/react";

const CodeEditor = ({ language = "javascript", value = "", onChange, editorTheme, fontSize=14, tabSize=2, minimap=false }) => { // Renamed theme to editorTheme to avoid conflict
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      // onMount={handleEditorDidMount}
      theme={editorTheme}
      options={{
        fontSize: fontSize,
        minimap: { enabled: minimap },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: tabSize,
        insertSpaces: true,
        wordWrap: 'on',
        lineNumbers: 'on',
        glyphMargin: false,
        folding: true,
        lineDecorationsWidth: 10,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        mouseWheelZoom: true,
      }}
    />
  );
};

export default CodeEditor;

// function CodeEditor({ language="javascript", value = "", onChange, theme = 'vs-dark' }) {
//   const editorRef = useRef(Editor);
//   const monacoInstanceRef = useRef(null);

//   useEffect(() => {
//     if (editorRef.current && window.require) {
//       window.require(['vs/editor/editor.main'], (monaco) => {
//         if (!monacoInstanceRef.current) { // Check if editor is already initialized
//           const editorInstance = monaco.editor.create(editorRef.current, {
//             value: value,
//             language: language,
//             theme: theme,
//             automaticLayout: true,
//             minimap: { enabled: true },
//             scrollbar: {
//               verticalScrollbarSize: 8,
//               horizontalScrollbarSize: 8,
//             },
//             fontSize: 14,
//             lineNumbers: 'on',
//             roundedSelection: false,
//             scrollBeyondLastLine: false,
//             readOnly: false,
//             wordWrap: 'on', // Enable word wrap
//             wrappingIndent: 'indent',
//           });

//           editorInstance.onDidChangeModelContent(() => {
//             onChange(editorInstance.getValue());
//           });
//           monacoInstanceRef.current = editorInstance;
//         } else {
//            // If instance exists, update value if it's different
//           if (monacoInstanceRef.current.getValue() !== value) {
//             monacoInstanceRef.current.setValue(value);
//           }
//         }
//       });
//     }

//     return () => {
//       if (monacoInstanceRef.current) {
//         monacoInstanceRef.current.dispose();
//         monacoInstanceRef.current = null;
//       }
//     };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [language, theme]); // Rerun if language or theme changes. Value changes handled separately or by initial set.

//   // Effect to update editor value when `value` prop changes externally (e.g. reset button)
//    useEffect(() => {
//     if (monacoInstanceRef.current && monacoInstanceRef.current.getValue() !== value) {
//       // Preserve cursor position and selection if possible
//       const model = monacoInstanceRef.current.getModel();
//       if (model) {
//         // Using pushEditOperations for better undo/redo stack management
//         monacoInstanceRef.current.executeEdits("external-update", [{
//           range: model.getFullModelRange(),
//           text: value
//         }]);
//       } else {
//         monacoInstanceRef.current.setValue(value);
//       }
//     }
//   }, [value]);


//   return <div ref={editorRef} className="h-full w-full"></div>;
// }
