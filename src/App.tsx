import { useState } from "react";
import { fetchIssues, createIssue, updateIssueStatus } from "./lib/github";
import "./App.css";
import { useEffect } from "react";

import type { ColumnId, Columns, DraggedItem, Task } from "./types";
import TaskInput from "./components/TaskInput";
import Column from "./components/Column";

/*
  App Component

  Acts as the main controller of the Kanban board.
  Responsible for:
  - Managing global board state
  - Handling task creation, deletion, and movement
  - Passing logic down to child components
*/
function App() {
  // State containing all columns and their tasks
  const [columns, setColumns] = useState<Columns>({
    todo: { name: "To Do", items: [] },
    inProgress: {name: "In Progress", items: [] },
    done: {name: "Done", items: []},
  });

  // State for new task input
  const [newTask, setNewTask] = useState("");

  // Currently selected column for new task
  const [activeColumn, setActiveColumn] =
    useState<ColumnId>("todo");

  // Stores information about the task being dragged
  const [draggedItem, setDraggedItem] =
    useState<DraggedItem | null>(null);

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
            content: issue.title,
          };

          const labelNames = issue.labels.map((l: any) => l.name);

          if (labelNames.includes("inProgress")) {
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
  const addNewTask = async () => {
    if (!newTask.trim()) return;

    try {
      const createdIssue = await createIssue(newTask);

      const newTaskItem = {
        id: createdIssue.number,
        content: createdIssue.title,
      };

      setColumns((prev) => ({
        ...prev,
        todo: {
          ...prev.todo,
          items: [...prev.todo.items, newTaskItem],
        },
      }));

      setNewTask("");
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  };

  // Removes a task from a specific column
  const removeTask = (columnId: ColumnId, taskId: number) => {
    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.filter(
          (item) => item.id !== taskId
        ),
      },
    }));
  };

  // Stores the task being dragged
  const handleDragStart = (columnId: ColumnId, task: Task) => {
    setDraggedItem({ columnId, item: task });
  };

  // Allows drop event to occur
  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
  };

  // Handles dropping a task into a new column
  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    columnId: ColumnId
  ) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceId, item } = draggedItem;

    if (sourceId === columnId) return;

    try {
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

  return (
    <div className="app-wrapper dark">
      <div className="app-container">
        <h1 className="app-title">
          Git Kanban Board
        </h1>

        {/* Task creation component */}
        <TaskInput
          newTask={newTask}
          setNewTask={setNewTask}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
          columns={columns}
          addNewTask={addNewTask}
        />

        {/* Render all columns */}
        <div className="columns-wrapper">
          {(Object.keys(columns) as ColumnId[]).map(
            (columnId) => (
              <Column
                key={columnId}
                columnId={columnId}
                name={columns[columnId].name}
                items={columns[columnId].items}
                headerStyle={
                  columnStyles[columnId].header
                }
                borderStyle={
                  columnStyles[columnId].border
                }
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
                onDelete={removeTask}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;