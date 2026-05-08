/* TaskCard.tsx is responsible for:
- rendering a single task
- handling drag start events
- handling delete actions
*/

import type { ColumnId, Task } from "../types";
import { Card } from "../components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,DialogDescription,  DialogFooter, DialogClose } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

// props expected by the TaskCard component
interface TaskCardProps {
  task: Task;
  columnId: ColumnId;
  onDragStart: (columnId: ColumnId, task: Task) => void;
  onDelete: (columnId: ColumnId, task: Task) => void;
  isLoading: boolean;
}

export default function TaskCard({
  task,
  columnId,
  onDragStart,
  onDelete,
  isLoading,
}: TaskCardProps) {
  return (
    <Card draggable onDragStart={() => onDragStart(columnId, task)} className="task-card flex flex-col gap-2 p-4 cursor-grab">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">{task.content}</h3>

        <Dialog>
          <DialogTrigger asChild>
            <button className="delete-dialog shrink-0" onClick={(e) => e.stopPropagation()}>✕</button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[400px] bg-zinc-900 border border-zinc-700 text-zinc-100">
            <DialogHeader>
              <DialogTitle className="text-zinc-200">Delete Task</DialogTitle>
              <DialogDescription className="text-zinc-200">
                This will permanently delete this GitHub issue. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" className="text-zinc-300 hover:text-zinc-800">Cancel</Button>
              </DialogClose>

              <Button variant="destructive" disabled={isLoading} onClick={(e) => {e.stopPropagation();  onDelete(columnId, task);}}>
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {task.description && (
        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{task.description}</p>
      )}
    </Card>
  );
}