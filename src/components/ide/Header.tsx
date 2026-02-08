import { Play, Square, RotateCcw } from "lucide-react";
import pythonLogo from "@/assets/python-logo.png";
import ThemeToggle from "@/components/ThemeToggle";
import FileMenu from "./FileMenu";

interface HeaderProps {
  onRun: () => void;
  onStop: () => void;
  onClear: () => void;
  isRunning: boolean;
  code: string;
  onCodeChange: (code: string) => void;
}

const Header = ({ onRun, onStop, onClear, isRunning, code, onCodeChange }: HeaderProps) => {
  return (
    <header className="ide-header px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img 
          src={pythonLogo} 
          alt="Python Logo" 
          className="w-10 h-10 object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="python-logo-gradient">PYTHON</span>
            <span className="text-foreground ml-2">EDITOR</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Write, Run, and Learn Python in your browser
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        <FileMenu code={code} onCodeChange={onCodeChange} />
        <ThemeToggle />
        
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 rounded-md 
                     bg-secondary text-secondary-foreground hover:bg-secondary/80
                     transition-colors duration-200"
          title="Clear Console"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
        
        {isRunning ? (
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-6 py-2 rounded-md 
                       bg-destructive text-destructive-foreground hover:bg-destructive/90
                       font-semibold transition-all duration-200
                       shadow-lg shadow-destructive/20"
          >
            <Square className="w-4 h-4" />
            <span>Stop</span>
          </button>
        ) : (
          <button
            onClick={onRun}
            className="run-button"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
