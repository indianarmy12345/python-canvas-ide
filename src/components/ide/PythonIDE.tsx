import { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import CodeEditor from "./CodeEditor";
import Console from "./Console";
import TipsPanel from "./TipsPanel";
import { usePyodide } from "@/hooks/usePyodide";
import { Loader2 } from "lucide-react";

const defaultCode = `# Welcome to Python Editor! 🐍
# Write your Python code here and click "Run" to execute it.

# Example: Hello World
print("Hello, World!")

# Example: Simple calculation
x = 10
y = 20
print(f"The sum of {x} and {y} is {x + y}")

# Example: Loop
for i in range(5):
    print(f"Count: {i}")

# Try modifying this code and run it!
`;

const PythonIDE = () => {
  const [code, setCode] = useState(defaultCode);
  const { isLoading, isRunning, outputs, runCode, clearOutputs, stopExecution } =
    usePyodide();

  const handleRun = useCallback(() => {
    runCode(code);
  }, [code, runCode]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    },
    [handleRun]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Loading Python Environment
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Setting up Pyodide... This may take a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onRun={handleRun}
        onStop={stopExecution}
        onClear={clearOutputs}
        isRunning={isRunning}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Tips Panel - Hidden on mobile */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <TipsPanel />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 min-h-[300px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-border">
            <CodeEditor code={code} onChange={(value) => setCode(value || "")} />
          </div>

          {/* Console */}
          <div className="h-64 lg:h-auto lg:w-[400px] xl:w-[500px] flex-shrink-0">
            <Console outputs={outputs} isRunning={isRunning} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PythonIDE;
