import { Home, Users, CreditCard, FileText, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const links = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: CreditCard, label: "Payments", path: "/payments" },
    { icon: FileText, label: "Reports", path: "/reports" },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg" alt="ACS Logo" className="w-8 h-8" />
            <h1 className="font-bold text-lg text-primary">ACS Manager</h1>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;