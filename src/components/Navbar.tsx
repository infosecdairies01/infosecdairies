import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle2, Menu, X } from "lucide-react";
import logo from "@/assets/infosecdairies-logo.png";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Certifications" },
  { to: "/labs", label: "Practice" },
  { to: "/about", label: "About" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      isActive(path) ? "text-[#7bff81]" : "text-[#00ffc8] hover:text-[#7bff81]"
    }`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="w-full z-50 relative">
      <div className="w-full px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="group flex-shrink-0" onClick={closeMenu}>
            <img src={logo} alt="BlueTeamers" className="h-14 md:h-20 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={linkClass(to)}>
                {label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <Link to="/auth" className="text-sm font-medium text-[#00ffc8] hover:text-[#7bff81] transition-colors">
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

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-[#00ffc8] p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#020817] border-t border-[#00ffc8]/20 z-50 shadow-xl">
          <div className="flex flex-col px-6 py-4 gap-4">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className={linkClass(to)} onClick={closeMenu}>
                {label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <Link
                to="/auth"
                className="text-sm font-medium text-[#00ffc8] hover:text-[#7bff81] transition-colors"
                onClick={closeMenu}
              >
                Login / Sign Up
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  className="text-left text-sm font-medium text-[#00ffc8] hover:text-[#7bff81] transition-colors"
                  onClick={() => { navigate("/dashboard"); closeMenu(); }}
                >
                  My Dashboard
                </button>
                <button
                  type="button"
                  className="text-left text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                  onClick={() => { logout(); closeMenu(); navigate("/"); }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
