import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Stethoscope,
  FileText,
  History,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "New Authorization", path: "/new-authorization", icon: PlusCircle },
  { label: "Requests", path: "/requests", icon: ClipboardList },
  { label: "Nurse Review", path: "/nurse-review", icon: Stethoscope },
  { label: "Policy Rules", path: "/policies", icon: FileText },
  { label: "Audit Trail", path: "/audit-trail", icon: History },
];

function Sidebar({ mobileOpen, onCloseMobile }) {
  return (
    <aside
      className={`
        fixed md:static top-0 left-0 z-50 h-screen
        w-[260px] min-w-[260px]
        md:w-[220px] md:min-w-[220px]
        lg:w-[260px] lg:min-w-[260px]
        bg-sidebar text-sidebar-text flex flex-col overflow-y-auto
        border-r border-sidebar-border
        transition-[left,width] duration-200 shadow-2xl md:shadow-none
        ${mobileOpen ? "left-0" : "-left-[280px] md:left-0"}
      `}
    >
      <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2 text-base font-bold tracking-wide">
          <span className="text-primary-light text-lg">✚</span>
          <span className="text-sidebar-text">PA SYSTEM</span>
        </div>
        <button
          className="md:hidden text-sidebar-text-secondary hover:text-sidebar-text"
          onClick={onCloseMobile}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col py-3 gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium border-l-[3px] transition-colors duration-150 ${
                  isActive
                    ? "bg-sidebar-active border-primary-light text-white font-semibold shadow-sm"
                    : "border-transparent text-sidebar-text-secondary hover:bg-sidebar-secondary hover:text-sidebar-text"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-5 pb-5 pt-4">
        <button className="flex items-center gap-3 w-full text-sm font-medium text-sidebar-text-secondary hover:text-sidebar-text transition-colors py-2.5">
          <Settings size={18} />
          <span>Settings</span>
        </button>

        <div className="h-px bg-sidebar-border my-3" />

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-primary-light text-sidebar flex items-center justify-center text-xs font-bold shrink-0">
            NR
          </div>
          <div>
            <div className="text-sm font-semibold text-sidebar-text">Nurse Reviewer</div>
            <div className="text-xs text-sidebar-text-secondary">Clinical Review Team</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;