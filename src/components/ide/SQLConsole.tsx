import { Database } from "lucide-react";
import type { SQLResult } from "@/hooks/useSQLite";

interface SQLConsoleProps {
  results: SQLResult[];
  isRunning: boolean;
}

const SQLConsole = ({ results, isRunning }: SQLConsoleProps) => {
  return (
    <div className="ide-console h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        <Database className="w-4 h-4 text-primary" />
        <span className="font-medium text-sm">SQL Output</span>
        {isRunning && (
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Running...
          </span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {results.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">
            Run your SQL queries to see results here...
          </p>
        ) : (
          results.map((result, index) => (
            <div key={index} className="animate-fade-in">
              {result.type === "table" && result.columns && result.rows ? (
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full text-sm font-mono">
                    <thead>
                      <tr className="bg-secondary/50">
                        {result.columns.map((col, i) => (
                          <th
                            key={i}
                            className="px-3 py-2 text-left font-semibold text-foreground border-b border-border whitespace-nowrap"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, ri) => (
                        <tr
                          key={ri}
                          className="border-b border-border/50 hover:bg-secondary/20 transition-colors"
                        >
                          {row.map((cell, ci) => (
                            <td
                              key={ci}
                              className="px-3 py-1.5 text-foreground whitespace-nowrap"
                            >
                              {cell === null ? (
                                <span className="text-muted-foreground italic">NULL</span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-3 py-1.5 text-xs text-muted-foreground bg-secondary/30 border-t border-border">
                    {result.rows.length} row{result.rows.length !== 1 ? "s" : ""}
                  </div>
                </div>
              ) : result.type === "error" ? (
                <div className="font-mono text-sm console-error">
                  <span className="text-destructive mr-2">❌</span>
                  <span className="whitespace-pre-wrap">{result.content}</span>
                </div>
              ) : result.type === "info" ? (
                <div className="font-mono text-sm text-accent">
                  <span className="mr-2">ℹ️</span>
                  <span className="whitespace-pre-wrap">{result.content}</span>
                </div>
              ) : (
                <div className="font-mono text-sm console-output">
                  <span className="mr-2">✅</span>
                  <span className="whitespace-pre-wrap">{result.content}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SQLConsole;
