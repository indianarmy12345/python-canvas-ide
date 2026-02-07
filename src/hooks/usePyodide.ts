import { useState, useEffect, useCallback, useRef } from "react";
import type { ConsoleOutput } from "@/components/ide/Console";

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<any>;
  }
}

export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [outputs, setOutputs] = useState<ConsoleOutput[]>([]);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    const loadPyodideScript = async () => {
      // Check if script already loaded
      if (window.loadPyodide) {
        try {
          const py = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
          });
          pyodideRef.current = py;
          setPyodide(py);
          setOutputs([
            {
              type: "info",
              content: "Python environment loaded successfully! Ready to code.",
              timestamp: new Date(),
            },
          ]);
        } catch (error) {
          setOutputs([
            {
              type: "error",
              content: `Failed to load Python: ${error}`,
              timestamp: new Date(),
            },
          ]);
        }
        setIsLoading(false);
        return;
      }

      // Load Pyodide script
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
      script.async = true;

      script.onload = async () => {
        try {
          const py = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
          });
          pyodideRef.current = py;
          setPyodide(py);
          setOutputs([
            {
              type: "info",
              content: "Python environment loaded successfully! Ready to code.",
              timestamp: new Date(),
            },
          ]);
        } catch (error) {
          setOutputs([
            {
              type: "error",
              content: `Failed to load Python: ${error}`,
              timestamp: new Date(),
            },
          ]);
        }
        setIsLoading(false);
      };

      script.onerror = () => {
        setOutputs([
          {
            type: "error",
            content: "Failed to load Pyodide. Check your internet connection.",
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    loadPyodideScript();
  }, []);

  const runCode = useCallback(
    async (code: string) => {
      if (!pyodideRef.current || isRunning) return;

      setIsRunning(true);
      setOutputs((prev) => [
        ...prev,
        {
          type: "info",
          content: ">>> Running code...",
          timestamp: new Date(),
        },
      ]);

      try {
        // Redirect stdout and stderr
        pyodideRef.current.runPython(`
import sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.outputs = []
    
    def write(self, text):
        if text.strip():
            self.outputs.append(text)
    
    def flush(self):
        pass
    
    def get_output(self):
        return ''.join(self.outputs)

_stdout_capture = OutputCapture()
_stderr_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
        `);

        // Run the user's code
        await pyodideRef.current.runPythonAsync(code);

        // Get captured output
        const stdout = pyodideRef.current.runPython("_stdout_capture.get_output()");
        const stderr = pyodideRef.current.runPython("_stderr_capture.get_output()");

        if (stdout) {
          setOutputs((prev) => [
            ...prev,
            {
              type: "output",
              content: stdout,
              timestamp: new Date(),
            },
          ]);
        }

        if (stderr) {
          setOutputs((prev) => [
            ...prev,
            {
              type: "error",
              content: stderr,
              timestamp: new Date(),
            },
          ]);
        }

        if (!stdout && !stderr) {
          setOutputs((prev) => [
            ...prev,
            {
              type: "info",
              content: "Code executed successfully (no output)",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error: any) {
        setOutputs((prev) => [
          ...prev,
          {
            type: "error",
            content: error.message || String(error),
            timestamp: new Date(),
          },
        ]);
      } finally {
        // Reset stdout/stderr
        pyodideRef.current?.runPython(`
import sys
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
        `);
        setIsRunning(false);
      }
    },
    [isRunning]
  );

  const clearOutputs = useCallback(() => {
    setOutputs([]);
  }, []);

  const stopExecution = useCallback(() => {
    // Note: Pyodide doesn't support interrupting execution
    // This is a placeholder for UI feedback
    setIsRunning(false);
    setOutputs((prev) => [
      ...prev,
      {
        type: "info",
        content: "Execution stopped.",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    pyodide,
    isLoading,
    isRunning,
    outputs,
    runCode,
    clearOutputs,
    stopExecution,
  };
};
