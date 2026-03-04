/* Column.tsx is responsible for
- rendering column header and task count
- handling drop events
- rendering all tasks within the column
*/

import type { ColumnId, Task } from "../types";
import TaskCard from "./TaskCard";
import { Card, CardHeader, CardContent } from "../components/ui/card";

// props expected by the Column component
interface ColumnProps {
  columnId: ColumnId;
  name: string;
  items: Task[];
  headerStyle: string;
  borderStyle: string;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: ColumnId) => void;
  onDragStart: (columnId: ColumnId, task: Task) => void;
  onDelete: (columnId: ColumnId, taskId: number) => void;
}

export default function Column({
  columnId,
  name,
  items,
  headerStyle,
  borderStyle,
  onDragOver,
  onDrop,
  onDragStart,
  onDelete,
}: ColumnProps) {
  return (
    <Card className={`column-card ${borderStyle} p-0`} onDragOver={onDragOver} onDrop={(e) => onDrop(e, columnId)}>
      <CardHeader className={`column-header ${headerStyle}`}>
        <span className="column-title">{name}</span>
        <span className="column-count">{items.length}</span>
      </CardHeader>

      <CardContent className="column-body !pt-0">
        {items.length === 0 ? (
          <div className="empty-column">Drop tasks here.</div>
        ) : (
          items.map((task) => (
            <TaskCard key={task.id} task={task} columnId={columnId} onDragStart={onDragStart} onDelete={onDelete} />
          ))
        )}
      </CardContent>
    </Card>
  );
}