
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Board, List, Task } from '@/types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface BoardContextType {
  boards: Board[];
  currentBoard: Board | null;
  setCurrentBoard: (boardId: string) => void;
  createBoard: (title: string, description?: string) => void;
  updateBoard: (boardId: string, data: Partial<Board>) => void;
  deleteBoard: (boardId: string) => void;
  createList: (boardId: string, title: string) => void;
  updateList: (boardId: string, listId: string, title: string) => void;
  deleteList: (boardId: string, listId: string) => void;
  createTask: (boardId: string, listId: string, task: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => void;
  updateTask: (boardId: string, listId: string, taskId: string, taskData: Partial<Task>) => void;
  deleteTask: (boardId: string, listId: string, taskId: string) => void;
  moveTask: (boardId: string, fromListId: string, toListId: string, taskId: string) => void;
  connectGitHubRepo: (boardId: string, repoUrl: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

const initialBoards: Board[] = [
  {
    id: 'demo-board-1',
    title: 'Getting Started',
    description: 'Welcome to TaskFlow! This is a demo board to help you get started.',
    lists: [
      {
        id: 'list-1',
        title: 'To Do',
        tasks: [
          {
            id: 'task-1',
            title: 'Create your first board',
            description: 'Click the "New Board" button to create your own board',
            priority: 'medium',
            status: 'todo',
            createdBy: 'system',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'task-2',
            title: 'Add tasks to your board',
            description: 'Click the "Add Task" button in any list to create tasks',
            priority: 'low',
            status: 'todo',
            createdBy: 'system',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'list-2',
        title: 'In Progress',
        tasks: [
          {
            id: 'task-3',
            title: 'Learn to use TaskFlow',
            description: 'Explore the different features of TaskFlow',
            priority: 'high',
            status: 'in-progress',
            createdBy: 'system',
            createdAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'list-3',
        title: 'Done',
        tasks: [
          {
            id: 'task-4',
            title: 'Sign up for TaskFlow',
            description: 'You have successfully signed up for TaskFlow',
            priority: 'medium',
            status: 'done',
            createdBy: 'system',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ],
    createdBy: 'system',
    createdAt: new Date().toISOString(),
  },
];

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(initialBoards[0]?.id || null);
  const { user } = useAuth();

  const currentBoard = boards.find((board) => board.id === currentBoardId) || null;

  const setCurrentBoard = (boardId: string) => {
    setCurrentBoardId(boardId);
  };

  const createBoard = (title: string, description?: string) => {
    if (!user) {
      toast.error('You must be logged in to create a board');
      return;
    }

    const newBoard: Board = {
      id: uuidv4(),
      title,
      description,
      lists: [
        { id: uuidv4(), title: 'To Do', tasks: [] },
        { id: uuidv4(), title: 'In Progress', tasks: [] },
        { id: uuidv4(), title: 'Done', tasks: [] },
      ],
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    setBoards([...boards, newBoard]);
    setCurrentBoardId(newBoard.id);
    toast.success('Board created successfully');
  };

  const updateBoard = (boardId: string, data: Partial<Board>) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
    toast.success('Board updated successfully');
  };

  const deleteBoard = (boardId: string) => {
    setBoards(boards.filter((board) => board.id !== boardId));
    
    if (currentBoardId === boardId) {
      setCurrentBoardId(boards.find(board => board.id !== boardId)?.id || null);
    }
    
    toast.success('Board deleted successfully');
  };

  const createList = (boardId: string, title: string) => {
    const newList: List = {
      id: uuidv4(),
      title,
      tasks: [],
    };

    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: [...board.lists, newList],
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
    toast.success('List created successfully');
  };

  const updateList = (boardId: string, listId: string, title: string) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId ? { ...list, title } : list
              ),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
    toast.success('List updated successfully');
  };

  const deleteList = (boardId: string, listId: string) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.filter((list) => list.id !== listId),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
    toast.success('List deleted successfully');
  };

  const createTask = (
    boardId: string,
    listId: string,
    taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>
  ) => {
    if (!user) {
      toast.error('You must be logged in to create a task');
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    };

    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? { ...list, tasks: [...list.tasks, newTask] }
                  : list
              ),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
    toast.success('Task created successfully');
  };

  const updateTask = (
    boardId: string,
    listId: string,
    taskId: string,
    taskData: Partial<Task>
  ) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? {
                      ...list,
                      tasks: list.tasks.map((task) =>
                        task.id === taskId
                          ? {
                              ...task,
                              ...taskData,
                              updatedAt: new Date().toISOString(),
                            }
                          : task
                      ),
                    }
                  : list
              ),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
    toast.success('Task updated successfully');
  };

  const deleteTask = (boardId: string, listId: string, taskId: string) => {
    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              lists: board.lists.map((list) =>
                list.id === listId
                  ? {
                      ...list,
                      tasks: list.tasks.filter((task) => task.id !== taskId),
                    }
                  : list
              ),
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
    toast.success('Task deleted successfully');
  };

  const moveTask = (
    boardId: string,
    fromListId: string,
    toListId: string,
    taskId: string
  ) => {
    const boardIndex = boards.findIndex((board) => board.id === boardId);
    if (boardIndex === -1) return;

    const board = boards[boardIndex];
    
    // Find the source list and task
    const fromListIndex = board.lists.findIndex((list) => list.id === fromListId);
    if (fromListIndex === -1) return;
    
    const fromList = board.lists[fromListIndex];
    const taskIndex = fromList.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;
    
    const task = fromList.tasks[taskIndex];
    
    // Create new lists array with the task moved
    const newLists = [...board.lists];
    
    // Remove from original list
    newLists[fromListIndex] = {
      ...fromList,
      tasks: fromList.tasks.filter((t) => t.id !== taskId),
    };
    
    // Add to destination list
    const toListIndex = board.lists.findIndex((list) => list.id === toListId);
    if (toListIndex !== -1) {
      const toList = board.lists[toListIndex];
      newLists[toListIndex] = {
        ...toList,
        tasks: [...toList.tasks, 
          { 
            ...task, 
            updatedAt: new Date().toISOString(),
            // Update status based on the list name (if needed)
            status: toList.title.toLowerCase().includes('done') 
              ? 'done' 
              : toList.title.toLowerCase().includes('progress') 
                ? 'in-progress'
                : toList.title.toLowerCase().includes('review')
                  ? 'review'
                  : 'todo'
          }
        ],
      };
    }
    
    // Update the boards state
    const newBoards = [...boards];
    newBoards[boardIndex] = {
      ...board,
      lists: newLists,
      updatedAt: new Date().toISOString(),
    };
    
    setBoards(newBoards);
    toast.success('Task moved successfully');
  };

  const connectGitHubRepo = (boardId: string, repoUrl: string) => {
    // Extract repo name from URL
    const repoMatch = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
    const repoName = repoMatch ? repoMatch[1] : repoUrl;

    setBoards(
      boards.map((board) =>
        board.id === boardId
          ? {
              ...board,
              githubRepo: repoName,
              updatedAt: new Date().toISOString(),
            }
          : board
      )
    );
    toast.success(`Connected to GitHub repository: ${repoName}`);
  };

  return (
    <BoardContext.Provider
      value={{
        boards,
        currentBoard,
        setCurrentBoard,
        createBoard,
        updateBoard,
        deleteBoard,
        createList,
        updateList,
        deleteList,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        connectGitHubRepo,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
