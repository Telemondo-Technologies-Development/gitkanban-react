/* TaskCard.tsx is responsible for:
- rendering a single task
- handling drag start events
- handling delete actions
*/

import type { ColumnId, Task } from "../types";
import { Card } from "../components/ui/card";
import { X } from "lucide-react";

// props expected by the TaskCard component
interface TaskCardProps {
  task: Task;
  columnId: ColumnId;
  onDragStart: (columnId: ColumnId, task: Task) => void;
  onDelete: (columnId: ColumnId, taskId: number) => void;
}

export default function TaskCard({
  task,
  columnId,
  onDragStart,
  onDelete,
}: TaskCardProps) {
  return (
    <Card
      draggable
      onDragStart={() => onDragStart(columnId, task)}
      className="task-card !flex-row items-center justify-between gap-2"
    >
      <span className="task-text">{task.content}</span>

      <button
        onClick={() => onDelete(columnId, task.id)}
        className="delete-btn"
      >
        <X size={16} />
      </button>
    </Card>
  );
}