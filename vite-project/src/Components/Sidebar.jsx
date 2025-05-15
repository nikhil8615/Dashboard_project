import {
  LayoutDashboard,
  Square,
  BarChart2,
  Columns3,
  Table,
  Pencil,
  ChevronDown,
  File,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const role = localStorage.getItem("userRole");
        setIsSuperAdmin(role === "superadmin");
      } catch (error) {
        console.error("Error checking role:", error);
      }
    }
  }, []);

  return (
    <div className="w-16 md:w-64 h-screen bg-[#1f2a40] text-white flex flex-col transition-all duration-300">
      <div className="bg-red-600 text-white py-4 px-2 md:px-6 text-lg font-semibold truncate">
        Dashboard
      </div>
      <nav className="flex-1 px-2 md:px-4 py-6 space-y-2 text-sm">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "block" : "block")}
        >
          {({ isActive }) => (
            <SidebarItem
              icon={<Square size={18} />}
              label="Dashboard Panel"
              isActive={isActive}
            />
          )}
        </NavLink>

        {isSuperAdmin && (
          <NavLink to="/create-roles" className="block">
            {({ isActive }) => (
              <SidebarItem
                icon={<BarChart2 size={18} />}
                label="Create Roles"
                isActive={isActive}
              />
            )}
          </NavLink>
        )}

        <NavLink to="/tables" className="block">
          {({ isActive }) => (
            <SidebarItem
              icon={<Table size={18} />}
              label="Responsive Tables"
              isActive={isActive}
            />
          )}
        </NavLink>
        <NavLink to="/forms" className="block">
          {({ isActive }) => (
            <SidebarItem
              icon={<Pencil size={18} />}
              label="Forms"
              isActive={isActive}
            />
          )}
        </NavLink>
        <NavLink to="/dropdown" className="block">
          {({ isActive }) => (
            <SidebarItem
              icon={<ChevronDown size={18} />}
              label="Multi-Level Dropdown"
              isActive={isActive}
            />
          )}
        </NavLink>
        <NavLink to="/empty" className="block">
          {({ isActive }) => (
            <SidebarItem
              icon={<File size={18} />}
              label="Empty Page"
              isActive={isActive}
            />
          )}
        </NavLink>
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, isActive }) => (
  <div
    className={`flex items-center md:space-x-3 px-2 py-2 cursor-pointer rounded-md ${
      isActive ? "bg-black text-white" : "hover:bg-[#2a3548] text-gray-300"
    }`}
  >
    <span className={isActive ? "text-white" : "text-gray-300"}>{icon}</span>
    <span
      className={`hidden md:inline ${
        isActive ? "text-white" : "text-gray-300"
      }`}
    >
      {label}
    </span>
  </div>
);

export default Sidebar;
