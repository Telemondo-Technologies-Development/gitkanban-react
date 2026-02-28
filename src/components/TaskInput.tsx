/* TaskInput.tsx is responsible for
- capturing new task text input
- selecting which column to add the task to
- triggering task creation
*/

import type { ColumnId, Columns } from "../types";

// props expected by the TaskInput component
interface TaskInputProps {
  newTask: string;
  setNewTask: (value: string) => void;
  activeColumn: ColumnId;
  setActiveColumn: (value: ColumnId) => void;
  columns: Columns;
  addNewTask: () => void;
}

export default function TaskInput({
  newTask,
  setNewTask,
  addNewTask,
}: TaskInputProps) {
  return (
    <div className="task-input-wrapper">
      {/* Input field for typing a new task */}
      <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add a new task..."className="task-input" onKeyDown={(e) => e.key === "Enter" && addNewTask()}/>

      {/* Button to trigger adding a new task */}
      <button onClick={addNewTask} className="task-button">Add</button>
    </div>
  );
}