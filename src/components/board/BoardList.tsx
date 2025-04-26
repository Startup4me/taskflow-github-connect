
import { useState } from 'react';
import { useBoard } from '@/contexts/BoardContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const BoardList = () => {
  const { boards, createBoard, connectGitHubRepo } = useBoard();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGithubDialogOpen, setIsGithubDialogOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [githubRepo, setGithubRepo] = useState('');

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      createBoard(newBoardTitle, newBoardDescription);
      setNewBoardTitle('');
      setNewBoardDescription('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleConnectGithub = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBoardId && githubRepo.trim()) {
      connectGitHubRepo(selectedBoardId, githubRepo);
      setGithubRepo('');
      setIsGithubDialogOpen(false);
      setSelectedBoardId(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Your Boards</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-taskflow-600 hover:bg-taskflow-700">
              <Plus className="mr-2 h-4 w-4" />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new board</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateBoard} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Board Title
                </label>
                <Input
                  id="title"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  placeholder="Enter board title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  value={newBoardDescription}
                  onChange={(e) => setNewBoardDescription(e.target.value)}
                  placeholder="Enter board description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Create Board</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* GitHub Repository Dialog */}
      <Dialog open={isGithubDialogOpen} onOpenChange={setIsGithubDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect GitHub Repository</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleConnectGithub} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="github-repo" className="text-sm font-medium">
                GitHub Repository URL
              </label>
              <Input
                id="github-repo"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="https://github.com/username/repo"
                required
              />
              <p className="text-sm text-gray-500">
                Enter the URL of your GitHub repository to connect it to this board.
              </p>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Connect Repository</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Card key={board.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{board.title}</CardTitle>
              {board.description && (
                <CardDescription className="line-clamp-2">
                  {board.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center text-sm text-gray-500">
                <span>
                  {board.lists.reduce(
                    (count, list) => count + list.tasks.length,
                    0
                  )}{' '}
                  tasks
                </span>
                {board.githubRepo && (
                  <div className="ml-auto flex items-center text-sm bg-gray-100 rounded-full px-2 py-1">
                    <Github className="h-3 w-3 mr-1" />
                    <span className="truncate max-w-[120px]">
                      {board.githubRepo}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSelectedBoardId(board.id);
                  setIsGithubDialogOpen(true);
                }}
              >
                <Github className="h-4 w-4 mr-2" />
                {board.githubRepo ? "Change Repo" : "Connect GitHub"}
              </Button>
              <Button asChild size="sm" className="bg-taskflow-600 hover:bg-taskflow-700">
                <Link to={`/board/${board.id}`}>View Board</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {boards.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No boards yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first board to get started with TaskFlow
          </p>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-taskflow-600 hover:bg-taskflow-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Board
          </Button>
        </div>
      )}
    </div>
  );
};

export default BoardList;
