import { Lightbulb, BookOpen, Keyboard, Zap } from "lucide-react";

const tips = [
  {
    icon: Keyboard,
    title: "Keyboard Shortcuts",
    description: "Press Ctrl+Enter to run your code quickly",
  },
  {
    icon: Lightbulb,
    title: "Auto-completion",
    description: "Press Ctrl+Space to see code suggestions",
  },
  {
    icon: BookOpen,
    title: "Python Basics",
    description: "Use print() to display output in the console",
  },
  {
    icon: Zap,
    title: "Quick Tip",
    description: "Indent with 4 spaces for proper Python syntax",
  },
];

const TipsPanel = () => {
  return (
    <div className="ide-sidebar p-4 space-y-4 overflow-auto">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-python-yellow" />
        <h2 className="font-semibold text-foreground">IDE Tips</h2>
      </div>
      
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="tip-card">
            <div className="flex items-start gap-3">
              <tip.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-foreground">
                  {tip.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {tip.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
        <h3 className="font-medium text-sm text-primary mb-2">
          🐍 Python in Browser
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This IDE uses Pyodide to run Python directly in your browser. 
          No installation needed! Standard library included.
        </p>
      </div>
    </div>
  );
};

export default TipsPanel;
