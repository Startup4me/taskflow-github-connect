
import React, { useState } from "react";
import { Task } from "@/types";
import { useBoard } from "@/contexts/BoardContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Edit,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  listId: string;
  boardId: string;
  onDragStart: (taskId: string, listId: string) => void;
  isDragging: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  listId,
  boardId,
  onDragStart,
  isDragging,
}) => {
  const { updateTask, deleteTask } = useBoard();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="task-priority-high flex items-center">
            <AlertTriangle size={12} className="mr-1" />
            High
          </span>
        );
      case "medium":
        return <span className="task-priority-medium">Medium</span>;
      case "low":
        return (
          <span className="task-priority-low flex items-center">
            <CheckCircle2 size={12} className="mr-1" />
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleSaveTask = () => {
    updateTask(boardId, listId, task.id, editedTask);
    setIsEditDialogOpen(false);
  };

  const handleDeleteTask = () => {
    deleteTask(boardId, listId, task.id);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div
        className={`task-card ${isDragging ? "is-dragging" : ""}`}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          onDragStart(task.id, listId);
        }}
        onClick={() => setIsEditDialogOpen(true)}
      >
        <div className="font-medium mb-2">{task.title}</div>
        
        {task.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-2 mt-auto">
          {getPriorityBadge(task.priority)}
          
          {task.dueDate && (
            <div className="text-xs flex items-center text-gray-600">
              <Calendar size={12} className="mr-1" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
      </div>

      {/* Task Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editedTask.title}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editedTask.description || ""}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Due Date
                </label>
                <Input
                  type="date"
                  value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, dueDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) =>
                    setEditedTask({
                      ...editedTask,
                      priority: value as Task["priority"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editedTask.status}
                onValueChange={(value) =>
                  setEditedTask({
                    ...editedTask,
                    status: value as Task["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editedTask.createdAt && (
              <div className="text-sm text-gray-500 flex items-center">
                <Clock size={14} className="mr-1" />
                Created: {new Date(editedTask.createdAt).toLocaleString()}
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={handleDeleteTask}
              className="mr-auto"
            >
              <X size={16} className="mr-1" /> Delete
            </Button>
            <div>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSaveTask} className="bg-taskflow-600 hover:bg-taskflow-700">
                <Edit size={16} className="mr-1" /> Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
