import { useState, useEffect, useCallback, useRef } from "react";

export interface SQLResult {
  type: "table" | "message" | "error" | "info";
  columns?: string[];
  rows?: any[][];
  content?: string;
  timestamp: Date;
}

export const useSQLite = () => {
  const [db, setDb] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<SQLResult[]>([]);
  const dbRef = useRef<any>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);

  const initDB = useCallback(async () => {
    if (dbRef.current) return;
    if (initPromiseRef.current) {
      await initPromiseRef.current;
      return;
    }

    initPromiseRef.current = (async () => {
      setIsLoading(true);
      try {
        const initSqlJs = (await import("sql.js")).default;
        const SQL = await initSqlJs({
          locateFile: (file: string) =>
            `https://sql.js.org/dist/${file}`,
        });
        const database = new SQL.Database();
        dbRef.current = database;
        setDb(database);
        setResults([
          {
            type: "info",
            content: "SQL environment ready! Tables persist during your session.",
            timestamp: new Date(),
          },
        ]);
      } catch (error: any) {
        setResults([
          {
            type: "error",
            content: `Failed to load SQL engine: ${error.message || error}`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    })();

    await initPromiseRef.current;
  }, []);

  // Initialize on mount
  useEffect(() => {
    initDB();
  }, [initDB]);

  const runSQL = useCallback(
    async (code: string) => {
      await initDB();
      const database = dbRef.current;
      if (!database || isRunning) return;

      setIsRunning(true);
      setResults((prev) => [
        ...prev,
        { type: "info", content: ">>> Running SQL...", timestamp: new Date() },
      ]);

      // Split by semicolons, filter empty/comment-only
      const statements = code
        .split(";")
        .map((s) => s.trim())
        .filter((s) => {
          const lines = s
            .split("\n")
            .filter((l) => l.trim() && !l.trim().startsWith("--"));
          return lines.length > 0;
        });

      for (const stmt of statements) {
        const cleanLines = stmt
          .split("\n")
          .filter((l) => l.trim() && !l.trim().startsWith("--"));
        const clean = cleanLines.join("\n").trim();
        if (!clean) continue;

        try {
          const res = database.exec(clean);
          const upper = clean.toUpperCase();

          if (
            res.length > 0 &&
            (upper.startsWith("SELECT") ||
              upper.startsWith("PRAGMA") ||
              upper.startsWith("SHOW"))
          ) {
            for (const table of res) {
              setResults((prev) => [
                ...prev,
                {
                  type: "table",
                  columns: table.columns,
                  rows: table.values,
                  timestamp: new Date(),
                },
              ]);
            }
          } else {
            const changes = database.getRowsModified();
            setResults((prev) => [
              ...prev,
              {
                type: "message",
                content: `Query OK${changes > 0 ? `, ${changes} row(s) affected` : ""}`,
                timestamp: new Date(),
              },
            ]);
          }
        } catch (err: any) {
          setResults((prev) => [
            ...prev,
            {
              type: "error",
              content: `SQL Error: ${err.message || err}`,
              timestamp: new Date(),
            },
          ]);
        }
      }

      setIsRunning(false);
    },
    [isRunning, initDB]
  );

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const stopExecution = useCallback(() => {
    setIsRunning(false);
    setResults((prev) => [
      ...prev,
      { type: "info", content: "Execution stopped.", timestamp: new Date() },
    ]);
  }, []);

  return {
    db,
    isLoading,
    isRunning,
    results,
    runSQL,
    clearResults,
    stopExecution,
  };
};
