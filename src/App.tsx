/* App.tsx acts as the main controller of the Kanban board and is responsible for 
- managing global board state 
- handling task creation, deletion, and movement 
- passing logic down to child components */

import { useState } from "react";
import { fetchIssues, createIssue, updateIssueStatus } from "./lib/github";
import { deleteIssueGraphQL } from "./lib/graphql";
import "./App.css";
import { useEffect } from "react";
import { Spinner } from "./components/ui/spinner";
import { Input } from "./components/ui/input";
import type { ColumnId, Columns, DraggedItem, Task } from "./types";
import TaskInput from "./components/TaskInput";
import Column from "./components/Column";
import { Search } from "lucide-react";

function App() {
  // state containing all columns and their tasks
  const [columns, setColumns] = useState<Columns>({
    todo: { name: "To Do", items: [] },
    inProgress: {name: "In Progress", items: [] },
    done: {name: "Done", items: []},
  });

  // state for new task input
  const [newTask, setNewTask] = useState("");

  // stores information about the task being dragged
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const issues = await fetchIssues();

        const newColumns: Columns = {
          todo: { name: "To Do", items: [] },
          inProgress: { name: "In Progress", items: [] },
          done: { name: "Done", items: [] },
        };

        issues.forEach((issue: any) => {
          const task = {
            id: issue.number,
            nodeId: issue.node_id,
            content: issue.title,
            description: issue.body || "",
          };

          const labelNames = issue.labels.map((l: any) => l.name);

          if (labelNames.includes("in-progress")) {
            newColumns.inProgress.items.push(task);
          } else if (labelNames.includes("done")) {
            newColumns.done.items.push(task);
          } else {
            newColumns.todo.items.push(task);
          }
        });

        setColumns(newColumns);
      } catch (error) {
        console.error("Error loading issues:", error);
      }
    };

    loadIssues();
  }, []);  

  // Adds a new task to the selected column
  const addNewTask = async (description: string): Promise<boolean> => {
    if (!newTask.trim() && !description.trim()) return false;

    try {
      setIsLoading(true);

      const createdIssue = await createIssue(newTask, description);

      const newTaskItem = {
        id: createdIssue.number,
        nodeId: createdIssue.node_id,
        content: createdIssue.title,
        description: createdIssue.body || "",
      };

      setColumns((prev) => ({
        ...prev,
        todo: {
          ...prev.todo,
          items: [...prev.todo.items, newTaskItem],
        },
      }));

      setNewTask("");
      return true;
    } catch (error) {
      console.error("Error creating issue:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Removes a task from a specific column
  const removeTask = async (columnId: ColumnId, task: Task) => {
    try {
      setIsLoading(true);

      setColumns((prev) => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          items: prev[columnId].items.filter(
            (item) => item.id !== task.id
          ),
        },
      }));

      await deleteIssueGraphQL(task.nodeId);
      
    } catch (error) {
      console.error("Error closing issue: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Stores the task being dragged
  const handleDragStart = (columnId: ColumnId, task: Task) => {
    setDraggedItem({ columnId, item: task });
  };

  // Allows drop event to occur
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handles dropping a task into a new column
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, columnId: ColumnId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceId, item } = draggedItem;
    if (sourceId === columnId) return;

    try {
      setIsLoading(true);

      await updateIssueStatus(item.id, columnId);

      setColumns((prev) => ({
        ...prev,
        [sourceId]: {
          ...prev[sourceId],
          items: prev[sourceId].items.filter(
            (i) => i.id !== item.id
          ),
        },
        [columnId]: {
          ...prev[columnId],
          items: [...prev[columnId].items, item],
        },
      }));

      setDraggedItem(null);
    } catch (error) {
      console.error("Error updating issue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Styling configuration for each column
  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-red-600 to-red-400",
      border: "border-red-400",
    },
    inProgress: {
      header: "bg-gradient-to-r from-yellow-600 to-yellow-400",
      border: "border-yellow-400",
    },
    done: {
      header: "bg-gradient-to-r from-green-600 to-green-400",
      border: "border-green-400",
    },
  };

  const filteredColumns: Columns = Object.fromEntries (
    Object.entries(columns).map(([key, column]) => [
      key,
      {
        ...column,
        items: column.items.filter((task) =>
          task.content.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      },
    ])
  ) as Columns;

  return (
    <div className="app-wrapper dark">
      <div className="app-container relative">

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-zinc-900/90 px-8 py-6 shadow-2xl border border-zinc-700">
            <Spinner size={69}/>
            <p className="text-sm text-muted-foreground">Syncing with GitHub...</p>
          </div>
        </div>
      )}

      {/* Dim content while loading */}
      <div className={`flex flex-col items-center transition-all duration-200 ${isLoading ? "blur-sm pointer-events-none select-none" : ""}`}>
        <h1 className="app-title">Git Kanban Board</h1>

        <div className="w-full flex items-start justify-between mb-6 px-16 gap-6">
          <div className="flex flex-col">
            <p className="font-semibold text-white">Issue Board for acAcebedo/GitKanbanBoard</p>
            <p className="text-sm text-muted-foreground">Drag cards between columns to update the status</p>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
            <Input placeholder="Search issues..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 pr-4 h-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:ring-1 focus:ring-zinc-500" />
            {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white">✕</button>
            )}
          </div>

          {/* Task creation component */}
          <TaskInput
            newTask={newTask}
            setNewTask={setNewTask}
            addNewTask={addNewTask}
            isLoading={isLoading}
          />
        </div>

        {/* Render all columns */}
        <div className="columns-wrapper justify-center">
          {(Object.keys(columns) as ColumnId[]).map(
            (columnId) => (
              <Column
                key={columnId}
                columnId={columnId}
                name={columns[columnId].name}
                items={filteredColumns[columnId].items}
                headerStyle={columnStyles[columnId].header}
                borderStyle={columnStyles[columnId].border}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDelete={removeTask}
                isLoading={isLoading}
                isSearching={!!searchQuery.trim()}
              />
            )
          )}
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;