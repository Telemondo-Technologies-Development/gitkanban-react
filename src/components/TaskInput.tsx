/* TaskInput.tsx is responsible for
- capturing new task text input
- selecting which column to add the task to
- triggering task creation
*/

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// props expected by the TaskInput component
interface TaskInputProps {
  newTask: string;
  setNewTask: (value: string) => void;
  addNewTask: (description: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function TaskInput({
  newTask,
  setNewTask,
  addNewTask,
  isLoading,
}: TaskInputProps) {
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">+ New Task</Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border border-zinc-700 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-zinc-200">Create Task</DialogTitle>
        </DialogHeader>

        <Input placeholder="Task title" value={newTask} onChange={(e) => setNewTask(e.target.value)}/>

        <Textarea placeholder="Task description" value={description} onChange={(e) => setDescription(e.target.value)}/>

        <Button variant="ghost" className="w-full justify-center text-white hover:bg-white hover:text-black transition-colors" disabled={isLoading} onClick={async () => {const success = await addNewTask(description); if (success) {setDescription(""); setOpen(false);}}}>
          
          {isLoading ? "Creating..." : "Create"}
          
        </Button>  
      </DialogContent>
    </Dialog>
  );
}