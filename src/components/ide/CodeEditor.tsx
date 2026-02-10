import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  language?: string;
}

const CodeEditor = ({ code, onChange, language = "python" }: CodeEditorProps) => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  return (
    <div className="ide-editor h-full w-full">
      <Editor
        height="100%"
        language={language}
        theme={theme === "dark" ? "vs-dark" : "light"}
        value={code}
        onChange={onChange}
        options={{
          fontSize: isMobile ? 12 : 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: !isMobile },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          lineNumbers: isMobile ? "off" : "on",
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
          folding: !isMobile,
          glyphMargin: !isMobile,
        }}
      />
    </div>
  );
};

export default CodeEditor;
