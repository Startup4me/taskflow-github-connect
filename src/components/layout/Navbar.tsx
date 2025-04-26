
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <Link to="/" className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-taskflow-700">
            TaskFlow
          </span>
        </Link>

        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto mt-4 md:mt-0`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
            <li>
              <Link
                to="/"
                className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-taskflow-700 md:p-0"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-taskflow-700 md:p-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <span className="md:hidden block py-2 pl-3 pr-4 text-gray-700">
                    {user?.email}
                  </span>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full md:w-auto"
                  >
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-taskflow-700 md:p-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="block py-2 pl-3 pr-4 text-taskflow-700 md:bg-taskflow-700 md:text-white md:px-4 md:py-2 md:rounded"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="hidden md:flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 hidden lg:block">
                {user?.email}
              </span>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
