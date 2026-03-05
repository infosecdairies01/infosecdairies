import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import logo from "@/assets/infosecdairies-logo.png";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="w-full z-50">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="group flex-shrink-0">
            <img src={logo} alt="InfosecDairies" className="h-32 w-auto" />
          </Link>

          <div className="flex items-center gap-8 ml-auto">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") 
                  ? "text-[#7bff81]" 
                  : "text-[#00ffc8] hover:text-[#7bff81]"
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className={`text-sm font-medium transition-colors ${
                isActive("/courses") 
                  ? "text-[#7bff81]" 
                  : "text-[#00ffc8] hover:text-[#7bff81]"
              }`}
            >
              Certifications
            </Link>
            <Link
              to="/labs"
              className={`text-sm font-medium transition-colors ${
                isActive("/labs") 
                  ? "text-[#7bff81]" 
                  : "text-[#00ffc8] hover:text-[#7bff81]"
              }`}
            >
              practice 
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                isActive("/about") 
                  ? "text-[#7bff81]" 
                  : "text-[#00ffc8] hover:text-[#7bff81]"
              }`}
            >
              About
            </Link>
            {!isAuthenticated ? (
              <Link
                to="/auth"
                className="text-sm font-medium text-[#00ffc8] hover:text-[#7bff81] transition-colors"
              >
                Login / Sign Up
              </Link>
            ) : (
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm font-medium text-[#00ffc8] hover:text-[#7bff81] transition-colors"
                >
                  <UserCircle2 className="w-6 h-6" />
                  <span>{user?.fullName || user?.email?.split("@")[0] || "Profile"}</span>
                </button>
                <div className="absolute right-0 mt-2 w-44 rounded-md bg-[#020817] border border-[#00ffc8]/20 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-[#00ffc8] hover:bg-[#020B1B]"
                    onClick={() => navigate("/dashboard")}
                  >
                    My Dashboard
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#200910]"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
