import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBoard } from "@/contexts/BoardContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, Priority } from "@/types";
import { Plus, X, Edit, Calendar } from "lucide-react";
import TaskCard from "./TaskCard";

const BoardDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { boards, setCurrentBoard, createList, updateList, deleteList, createTask } = useBoard();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editedListTitle, setEditedListTitle] = useState("");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [targetListId, setTargetListId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
  });

  const board = boards.find((b) => b.id === boardId);

  useEffect(() => {
    if (boardId) {
      setCurrentBoard(boardId);
    } else {
      navigate("/dashboard");
    }
  }, [boardId, navigate, setCurrentBoard]);

  if (!board) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <p>Board not found</p>
      </div>
    );
  }

  const handleAddList = () => {
    if (newListTitle.trim() && boardId) {
      createList(boardId, newListTitle);
      setNewListTitle("");
      setIsAddingList(false);
    }
  };

  const handleSaveListTitle = () => {
    if (editedListTitle.trim() && boardId && editingListId) {
      updateList(boardId, editingListId, editedListTitle);
      setEditingListId(null);
      setEditedListTitle("");
    }
  };

  const handleDeleteList = (listId: string) => {
    if (boardId) {
      deleteList(boardId, listId);
    }
  };

  const handleCreateTask = () => {
    if (boardId && targetListId && newTask.title) {
      createTask(boardId, targetListId, newTask as Omit<Task, "id" | "createdAt" | "createdBy">);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "todo",
      });
      setIsTaskDialogOpen(false);
      setTargetListId(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  return (
    <div className="p-4 mt-16">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{board.title}</h1>
        {board.description && <p className="text-gray-600 mt-1">{board.description}</p>}
        {board.githubRepo && (
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
              </svg>
              {board.githubRepo}
            </span>
          </div>
        )}
      </div>

      <div className="board-container">
        {board.lists.map((list) => (
          <div
            key={list.id}
            className="list-container"
          >
            <div className="mb-3 flex items-center justify-between">
              {editingListId === list.id ? (
                <div className="flex w-full items-center">
                  <Input
                    value={editedListTitle}
                    onChange={(e) => setEditedListTitle(e.target.value)}
                    className="flex-1 py-1 text-sm mr-2"
                    onBlur={handleSaveListTitle}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveListTitle()}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={() => setEditingListId(null)}>
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="font-medium text-sm text-gray-700 flex-1">
                    {list.title} 
                    <span className="ml-1 text-gray-500">
                      ({list.tasks.length})
                    </span>
                  </h3>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingListId(list.id);
                        setEditedListTitle(list.title);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteList(list.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto mb-2">
              {list.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  listId={list.id}
                  boardId={board.id}
                />
              ))}
            </div>

            <Button
              onClick={() => {
                setTargetListId(list.id);
                setIsTaskDialogOpen(true);
              }}
              variant="ghost"
              className="w-full justify-start text-gray-500 hover:text-gray-900"
            >
              <Plus size={16} className="mr-2" />
              Add a task
            </Button>
          </div>
        ))}

        <div className="list-container bg-gray-50 border border-dashed min-h-[100px]">
          {isAddingList ? (
            <div className="flex flex-col">
              <Input
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="Enter list title"
                className="mb-2"
                autoFocus
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleAddList}
                  className="bg-taskflow-600 hover:bg-taskflow-700 flex-1"
                >
                  Add List
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingList(false);
                    setNewListTitle("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsAddingList(true)}
              variant="ghost"
              className="w-full justify-start text-gray-500 hover:text-gray-900"
            >
              <Plus size={16} className="mr-2" />
              Add another list
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Task title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder="Add details about this task"
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
                  value={formatDate(newTask.dueDate || "")}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) =>
                    setNewTask({ ...newTask, priority: value as Priority })
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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask} className="bg-taskflow-600 hover:bg-taskflow-700">
                Add Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardDetail;
