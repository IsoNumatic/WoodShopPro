import { ChevronLeft, ChevronRight, X, User, Settings, Calendar, Home, Users, DollarSign, Clock, Target, Kanban, GitBranch, Filter, BarChart3 } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export default function Sidebar({ isOpen, onToggle, collapsed = false, onCollapseToggle }: SidebarProps) {
  const navigationItems = [
    'Overall Dashboard',
    'Monthly Calendar',
    'Weekly Calendar',
    'Project Overview',
    'Project Manager',
    'Project Budget',
    'Variable Tasks',
    'Recurring Tasks',
    'Tasks Schedule',
    'Tasks Filter',
    'Decision Matrix',
    'Kanban Board',
    'Gantt Chart',
  ];

  const getIconForItem = (item: string) => {
    switch (item) {
      case 'Overall Dashboard': return <Home className="w-5 h-5" />;
      case 'Monthly Calendar':
      case 'Weekly Calendar': return <Calendar className="w-5 h-5" />;
      case 'Project Overview':
      case 'Project Manager': return <Users className="w-5 h-5" />;
      case 'Project Budget': return <DollarSign className="w-5 h-5" />;
      case 'Variable Tasks':
      case 'Recurring Tasks':
      case 'Tasks Schedule': return <Clock className="w-5 h-5" />;
      case 'Tasks Filter': return <Filter className="w-5 h-5" />;
      case 'Decision Matrix': return <Target className="w-5 h-5" />;
      case 'Kanban Board': return <Kanban className="w-5 h-5" />;
      case 'Gantt Chart': return <GitBranch className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-[#242424] to-[#1A1B1E] shadow-lg transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 ${collapsed ? 'w-16' : 'w-1/5'} w-full lg:w-auto`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-700 ${collapsed ? 'px-4' : 'px-6'}`}>
          {!collapsed && <h2 className="text-xl font-bold text-white font-['Inter']">WoodShop Pro</h2>}
          {collapsed && <div className="w-8 h-8 bg-[#6C63FF] rounded-full flex items-center justify-center text-white font-bold text-sm" aria-label="WoodShop Pro Logo">W</div>}

          {/* Desktop collapse toggle */}
          <button
            onClick={onCollapseToggle}
            className="hidden lg:block p-2 rounded hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-5 h-5 text-gray-400" /> : <ChevronLeft className="w-5 h-5 text-gray-400" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`mt-8 ${collapsed ? 'px-2' : 'px-6'}`} aria-label="Main navigation">
          <ul className="space-y-1" role="list">
            {navigationItems.map((item) => (
              <li key={item} role="listitem">
                <a
                  href="#"
                  className={`flex items-center ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'} text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-800 font-['Inter'] group relative`}
                  aria-label={item}
                >
                  <span className={`${collapsed ? '' : 'mr-3'}`} aria-hidden="true">{getIconForItem(item)}</span>
                  {!collapsed && <span className="text-sm">{item}</span>}
                  <div className="absolute left-0 bottom-0 w-full h-0.5 bg-[#6C63FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" aria-hidden="true"></div>
                </a>
              </li>
            ))}
          </ul>

          {/* Bottom Section - Persistent */}
          <div className="mt-auto pt-8 border-t border-gray-700">
            <ul className="space-y-1" role="list">
              <li role="listitem">
                <a
                  href="#"
                  className={`flex items-center ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'} text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-800 font-['Inter'] group relative`}
                  aria-label="User Profile"
                >
                  <User className={`w-5 h-5 rounded-full bg-gray-600 p-1 ${collapsed ? '' : 'mr-3'}`} aria-hidden="true" />
                  {!collapsed && <span className="text-sm">Profile</span>}
                  <div className="absolute left-0 bottom-0 w-full h-0.5 bg-[#6C63FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" aria-hidden="true"></div>
                </a>
              </li>
              <li role="listitem">
                <a
                  href="#"
                  className={`flex items-center ${collapsed ? 'justify-center px-3 py-3' : 'px-4 py-3'} text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-800 font-['Inter'] group relative`}
                  aria-label="App Settings"
                >
                  <Settings className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} aria-hidden="true" />
                  {!collapsed && <span className="text-sm">Settings</span>}
                  <div className="absolute left-0 bottom-0 w-full h-0.5 bg-[#6C63FF] scale-x-0 group-hover:scale-x-100 transition-transform duration-200" aria-hidden="true"></div>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle}></div>
      )}
    </>
  );
}