import { useEffect, useCallback } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";
import FileTabs from "./FileTabs";
import CodeEditor from "./CodeEditor";
import Console from "./Console";
import TipsPanel from "./TipsPanel";
import { usePyodide } from "@/hooks/usePyodide";
import { useFileTabs } from "@/hooks/useFileTabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const PythonIDE = () => {
  const isMobile = useIsMobile();
  const {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    createNewTab,
    closeTab,
    updateTabContent,
    renameTab,
    loadFileToTab,
  } = useFileTabs();
  
  const { isLoading, isRunning, outputs, runCode, clearOutputs, stopExecution } =
    usePyodide();

  const handleRun = useCallback(() => {
    runCode(activeTab.content);
  }, [activeTab.content, runCode]);

  const handleCodeChange = useCallback(
    (value: string | undefined) => {
      updateTabContent(activeTabId, value || "");
    },
    [activeTabId, updateTabContent]
  );

  const handleLoadFile = useCallback(
    (code: string, fileName?: string) => {
      loadFileToTab(fileName || "loaded.py", code);
    },
    [loadFileToTab]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        createNewTab();
      }
    },
    [handleRun, createNewTab]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary animate-spin mx-auto" />
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Loading Python Environment
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-2">
              Setting up Pyodide... This may take a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <Header
          onRun={handleRun}
          onStop={stopExecution}
          onClear={clearOutputs}
          isRunning={isRunning}
          code={activeTab.content}
          onCodeChange={(code) => handleLoadFile(code)}
        />
      </div>

      {/* Mobile Header */}
      <MobileNav
        onRun={handleRun}
        onStop={stopExecution}
        onClear={clearOutputs}
        isRunning={isRunning}
        code={activeTab.content}
        onCodeChange={(code) => handleLoadFile(code)}
      />

      {/* File Tabs */}
      <FileTabs
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={setActiveTabId}
        onTabClose={closeTab}
        onNewTab={() => createNewTab()}
        onTabRename={renameTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tips Panel - Desktop only */}
        <aside className="hidden xl:block w-64 flex-shrink-0">
          <TipsPanel />
        </aside>

        {/* Editor and Console */}
        {isMobile ? (
          // Mobile: Vertical stack
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0">
              <CodeEditor code={activeTab.content} onChange={handleCodeChange} />
            </div>
            <div className="h-48 border-t border-border flex-shrink-0">
              <Console outputs={outputs} isRunning={isRunning} />
            </div>
          </div>
        ) : (
          // Desktop: Resizable panels
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={60} minSize={30}>
              <CodeEditor code={activeTab.content} onChange={handleCodeChange} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={20}>
              <Console outputs={outputs} isRunning={isRunning} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default PythonIDE;
