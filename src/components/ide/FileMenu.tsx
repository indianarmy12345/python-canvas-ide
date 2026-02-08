import { useRef } from "react";
import { FileDown, FileUp, FileCode, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sampleTemplates = [
  {
    name: "Hello World",
    code: `# Hello World Example
print("Hello, World!")
print("Welcome to Python!")
`,
  },
  {
    name: "Variables & Types",
    code: `# Variables and Data Types
name = "Python"
version = 3.12
is_awesome = True

print(f"Language: {name}")
print(f"Version: {version}")
print(f"Is Awesome: {is_awesome}")
print(f"Type of name: {type(name)}")
print(f"Type of version: {type(version)}")
`,
  },
  {
    name: "Lists & Loops",
    code: `# Lists and Loops
fruits = ["apple", "banana", "cherry", "mango"]

print("All fruits:")
for fruit in fruits:
    print(f"  - {fruit}")

print(f"\\nFirst fruit: {fruits[0]}")
print(f"Last fruit: {fruits[-1]}")
print(f"Total fruits: {len(fruits)}")

# List comprehension
upper_fruits = [f.upper() for f in fruits]
print(f"Uppercase: {upper_fruits}")
`,
  },
  {
    name: "Functions",
    code: `# Functions Example
def greet(name, greeting="Hello"):
    """A simple greeting function."""
    return f"{greeting}, {name}!"

def calculate_area(length, width):
    """Calculate the area of a rectangle."""
    return length * width

# Using the functions
print(greet("Python Learner"))
print(greet("Developer", "Welcome"))

area = calculate_area(10, 5)
print(f"Area of 10x5 rectangle: {area}")
`,
  },
  {
    name: "Classes & Objects",
    code: `# Classes and Objects
class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
    
    def bark(self):
        return f"{self.name} says: Woof!"
    
    def info(self):
        return f"{self.name} is a {self.breed}"

# Create instances
buddy = Dog("Buddy", "Golden Retriever")
max_dog = Dog("Max", "German Shepherd")

print(buddy.info())
print(buddy.bark())
print(max_dog.info())
print(max_dog.bark())
`,
  },
  {
    name: "Dictionary Operations",
    code: `# Dictionary Operations
student = {
    "name": "Alice",
    "age": 20,
    "grades": [85, 90, 78, 92],
    "is_active": True
}

print(f"Student: {student['name']}")
print(f"Age: {student['age']}")
print(f"Average Grade: {sum(student['grades']) / len(student['grades']):.1f}")

# Adding and updating
student["email"] = "alice@example.com"
student["age"] = 21

# Iterating
print("\\nAll student info:")
for key, value in student.items():
    print(f"  {key}: {value}")
`,
  },
  {
    name: "Error Handling",
    code: `# Error Handling with Try/Except
def divide(a, b):
    try:
        result = a / b
        return f"{a} / {b} = {result}"
    except ZeroDivisionError:
        return "Error: Cannot divide by zero!"
    except TypeError:
        return "Error: Invalid types for division!"
    finally:
        print("Division attempted.")

print(divide(10, 2))
print(divide(10, 0))
print(divide("10", 2))
`,
  },
  {
    name: "List Comprehensions",
    code: `# List Comprehensions
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Basic comprehension
squares = [x**2 for x in numbers]
print(f"Squares: {squares}")

# With condition
evens = [x for x in numbers if x % 2 == 0]
print(f"Even numbers: {evens}")

# Nested comprehension
matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]
print(f"Matrix: {matrix}")

# Dictionary comprehension
square_dict = {x: x**2 for x in range(1, 6)}
print(f"Square dict: {square_dict}")
`,
  },
];

interface FileMenuProps {
  code: string;
  onCodeChange: (code: string) => void;
}

const FileMenu = ({ code, onCodeChange }: FileMenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const blob = new Blob([code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "script.py";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onCodeChange(content);
      };
      reader.readAsText(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTemplateSelect = (templateCode: string) => {
    onCodeChange(templateCode);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".py,.txt"
        className="hidden"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-1.5 px-3 py-2 rounded-md 
                       bg-secondary text-secondary-foreground hover:bg-secondary/80
                       transition-colors duration-200 text-sm font-medium"
          >
            <FileCode className="w-4 h-4" />
            <span className="hidden sm:inline">File</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={handleSave}>
            <FileDown className="w-4 h-4 mr-2" />
            Save as .py
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLoad}>
            <FileUp className="w-4 h-4 mr-2" />
            Open File...
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FileCode className="w-4 h-4 mr-2" />
              Sample Templates
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              {sampleTemplates.map((template) => (
                <DropdownMenuItem
                  key={template.name}
                  onClick={() => handleTemplateSelect(template.code)}
                >
                  {template.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FileMenu;
