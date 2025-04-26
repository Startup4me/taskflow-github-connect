
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 py-16 md:py-32 mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900">
          Manage Tasks with
          <span className="text-taskflow-600 block md:ml-2 md:inline">
            GitHub Integration
          </span>
        </h1>
        
        <p className="mt-6 text-xl text-center text-gray-600 max-w-2xl">
          TaskFlow connects your project management with GitHub, automatically linking tasks to commits and making collaboration seamless.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {isAuthenticated ? (
            <Button
              asChild
              className="bg-taskflow-600 hover:bg-taskflow-700 px-8 py-6 text-lg"
            >
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                className="bg-taskflow-600 hover:bg-taskflow-700 px-8 py-6 text-lg"
              >
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                <Link to="/login">Log In</Link>
              </Button>
            </>
          )}
        </div>
        
        <div className="mt-16 relative overflow-hidden rounded-md shadow-2xl max-w-4xl w-full">
          <img
            src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
            alt="TaskFlow dashboard preview"
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl w-full">
          <div className="text-center">
            <div className="bg-taskflow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-taskflow-600"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h.01" />
                <path d="M11 7h6" />
                <path d="M7 11h.01" />
                <path d="M11 11h.01" />
                <path d="M15 11h.01" />
                <path d="M7 15h.01" />
                <path d="M11 15h.01" />
                <path d="M15 15h.01" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Intuitive Boards</h3>
            <p className="mt-2 text-gray-600">
              Create multiple boards with drag-and-drop task management
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-taskflow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-taskflow-600"
              >
                <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">GitHub Integration</h3>
            <p className="mt-2 text-gray-600">
              Connect repositories and link commits to tasks automatically
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-taskflow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8 text-taskflow-600"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Task Analytics</h3>
            <p className="mt-2 text-gray-600">
              Track progress and visualize your team's productivity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
