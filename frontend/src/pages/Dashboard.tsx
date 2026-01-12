import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { logout } = useAuth();
  const { projects, loading } = useProjects();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notificationCount] = useState(3); // Sample notification count

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.classList.toggle('light', !isDarkMode);
  }, [isDarkMode]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-full p-4">
        <div className="animate-spin w-16 h-16 border-4 border-[#6C63FF] border-t-transparent rounded-full"></div>
      </div>
    </div>
  );

  // Sample data for charts
  const budgetData = [
    { name: 'Expenses', value: 45000, color: '#6C63FF' },
    { name: 'Revenue', value: 75000, color: '#38B2AC' },
    { name: 'Profit', value: 30000, color: '#E0E5EC' },
  ];

  const statusData = [
    { name: 'Completed', value: 12, color: '#38B2AC' },
    { name: 'In Progress', value: 8, color: '#6C63FF' },
    { name: 'Overdue', value: 3, color: '#FF6B6B' },
  ];

  const tasks = [
    { id: 1, title: 'Design mockups', priority: 'High', assignee: 'John', dueDate: '2024-01-15', status: 'In Progress' },
    { id: 2, title: 'Code review', priority: 'Medium', assignee: 'Sarah', dueDate: '2024-01-18', status: 'Completed' },
    { id: 3, title: 'Client meeting', priority: 'High', assignee: 'Mike', dueDate: '2024-01-12', status: 'Overdue' },
    { id: 4, title: 'Material procurement', priority: 'Medium', assignee: 'Lisa', dueDate: '2024-01-20', status: 'In Progress' },
    { id: 5, title: 'Quality inspection', priority: 'Low', assignee: 'Tom', dueDate: '2024-01-25', status: 'To Do' },
    { id: 6, title: 'Budget review', priority: 'High', assignee: 'Anna', dueDate: '2024-01-14', status: 'Completed' },
  ];

  const projectsDueToday = projects.filter(p => {
    const today = new Date().toDateString();
    return p.phases && p.phases.some(phase => new Date(phase.endDate).toDateString() === today);
  }).length;

  const overallProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + (p.phases && p.phases.length > 0 ? (p.currentPhaseIndex / p.phases.length) : 0), 0) / projects.length * 100)
    : 0;

  const tasksCompleted = tasks.filter(t => t.status === 'Completed').length;

  const CircularProgress = ({ value, size = 80, strokeWidth = 8, color = '#6C63FF' }: { value: number; size?: number; strokeWidth?: number; color?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{value}%</span>
        </div>
      </div>
    );
  };
  const tasksOverdue = tasks.filter(t => t.status === 'Overdue').length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} flex font-['Inter']`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-1/5'}`}>
        {/* Header */}
        <header className={`sticky top-0 z-40 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b p-6 flex items-center justify-between shadow-sm`} role="banner">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-[#6C63FF] rounded flex items-center justify-center text-white font-bold" aria-label="WoodShop Pro Logo">W</div>
              <h1 className="text-2xl font-bold font-['Inter']">WoodShop Pro</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <label htmlFor="search-input" className="sr-only">Search projects and tasks</label>
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="search-input"
                type="text"
                placeholder="Search projects, tasks..."
                className={`pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-transparent`}
              />
            </div>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label={`${notificationCount} new notifications`}
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold" aria-hidden="true">
                  {notificationCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" aria-hidden="true" /> : <Moon className="w-5 h-5" aria-hidden="true" />}
            </button>
            <button
              onClick={logout}
              className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg hover:bg-[#5a52e0] transition-colors font-['Inter'] focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* Hero Section - Key KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`bg-gray-800 rounded-lg shadow-card p-6 text-center hover:shadow-card-hover hover:scale-105 transition-all duration-200 ${isDarkMode ? '' : 'bg-white'}`} role="region" aria-labelledby="projects-due">
              <h3 id="projects-due" className="text-sm font-medium text-gray-400 mb-4 font-['Inter'] uppercase tracking-wide">Projects Due Today</h3>
              <div className="flex justify-center">
                <CircularProgress value={projectsDueToday * 10} color="#6C63FF" />
              </div>
              <p className="text-2xl font-bold text-[#6C63FF] mt-2">{projectsDueToday}</p>
            </div>
            <div className={`bg-gray-800 rounded-lg shadow-card p-6 text-center hover:shadow-card-hover hover:scale-105 transition-all duration-200 ${isDarkMode ? '' : 'bg-white'}`} role="region" aria-labelledby="overall-progress">
              <h3 id="overall-progress" className="text-sm font-medium text-gray-400 mb-4 font-['Inter'] uppercase tracking-wide">Overall Progress</h3>
              <div className="flex justify-center">
                <CircularProgress value={overallProgress} color="#38B2AC" />
              </div>
            </div>
            <div className={`bg-gray-800 rounded-lg shadow-card p-6 text-center hover:shadow-card-hover hover:scale-105 transition-all duration-200 ${isDarkMode ? '' : 'bg-white'}`} role="region" aria-labelledby="tasks-status">
              <h3 id="tasks-status" className="text-sm font-medium text-gray-400 mb-4 font-['Inter'] uppercase tracking-wide">Tasks Completed/Overdue</h3>
              <div className="flex justify-center">
                <CircularProgress value={(tasksCompleted / (tasksCompleted + tasksOverdue)) * 100 || 0} color="#10B981" />
              </div>
              <p className="text-lg font-bold text-white mt-2">{tasksCompleted}/{tasksOverdue}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Budget Pie Chart */}
            <div className={`bg-gray-800 rounded-lg shadow-card p-6 hover:shadow-card-hover hover:scale-105 transition-all duration-200 ${isDarkMode ? '' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold text-white mb-4 font-['Inter']">Budget Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Status Bar Chart */}
            <div className={`bg-gray-800 rounded-lg shadow-card p-6 hover:shadow-card-hover hover:scale-105 transition-all duration-200 ${isDarkMode ? '' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold text-white mb-4 font-['Inter']">Task Status Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gantt Chart Preview */}
            <div className={`bg-gray-800 rounded-lg shadow-card p-6 hover:shadow-card-hover hover:scale-105 transition-all duration-200 ${isDarkMode ? '' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold text-white mb-4 font-['Inter']">Gantt Timeline Preview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">B2669 Ridge Road</span>
                  <span className="text-xs text-gray-400">Due: Jan 25</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[#38B2AC] h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Oak Street Renovation</span>
                  <span className="text-xs text-gray-400">Due: Feb 10</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-[#6C63FF] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Maple Ave Extension</span>
                  <span className="text-xs text-gray-400">Due: Feb 28</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Task Filter/Search */}
            <div className={`bg-gray-800 rounded-lg shadow-card p-6 hover:shadow-card-hover hover:scale-105 transition-all duration-200 ${isDarkMode ? '' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white font-['Inter']">Quick Task Filter</h3>
                <select className={`bg-gray-700 text-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF] ${isDarkMode ? '' : 'bg-gray-100 text-gray-700'}`}>
                  <option>Sort by Priority</option>
                  <option>Sort by Due Date</option>
                  <option>Sort by Assignee</option>
                </select>
              </div>
              <div className="space-y-3">
                {tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`} role="button" tabIndex={0}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-200">{task.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'High' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>👤 {task.assignee}</span>
                      <span>📅 {task.dueDate}</span>
                      <span className={task.status === 'Overdue' ? 'text-red-400' : task.status === 'Completed' ? 'text-green-400' : 'text-blue-400'}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kanban Board Preview */}
            <div className={`bg-gray-800 rounded-lg shadow-card p-6 hover:shadow-card-hover hover:scale-105 transition-all duration-200 ${isDarkMode ? '' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold text-white mb-6 font-['Inter']">Kanban Board Preview</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { title: 'To Do', color: '#6C63FF', tasks: ['Design review', 'Client meeting prep'] },
                  { title: 'In Progress', color: '#38B2AC', tasks: ['Code implementation', 'Testing phase'] },
                  { title: 'Done', color: '#10B981', tasks: ['Requirements gathering', 'Initial planning'] }
                ].map((column) => (
                  <div key={column.title} className={`bg-gray-700 rounded p-3 min-h-[150px] ${isDarkMode ? '' : 'bg-gray-100'}`}>
                    <h4 className="font-medium text-gray-200 mb-3 text-center text-sm">{column.title}</h4>
                    <div className="space-y-2">
                      {column.tasks.map((task, index) => (
                        <div key={index} className={`p-2 rounded text-xs text-gray-200 ${isDarkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
                          {task}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Projects */}
          <div className={`bg-gray-800 rounded-lg shadow-card p-6 ${isDarkMode ? '' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold text-white mb-6 font-['Inter']">Current Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 6).map((project) => {
                const hasPhases = project.phases && project.phases.length > 0;
                const progress = hasPhases ? Math.round((project.currentPhaseIndex / project.phases.length) * 100) : 0;
                const lastPhase = hasPhases ? project.phases[project.phases.length - 1] : null;
                const isOverdue = lastPhase ? new Date(lastPhase.endDate) < new Date() : false;
                const statusColors = {
                  complete: 'bg-green-100 text-green-800',
                  inProgress: 'bg-blue-100 text-blue-800',
                  overdue: 'bg-red-100 text-red-800'
                };

                let status = 'inProgress';
                if (hasPhases && project.currentPhaseIndex === project.phases.length - 1) status = 'complete';
                if (isOverdue && status !== 'complete') status = 'overdue';

                return (
                  <div key={project.id} className={`bg-gray-700 rounded-lg p-4 hover:shadow-card-hover hover:scale-105 transition-all duration-200 cursor-pointer ${isDarkMode ? '' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:ring-offset-2 focus:ring-offset-gray-900`} tabIndex={0} role="button">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-200 text-sm line-clamp-2">{project.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${statusColors[status as keyof typeof statusColors]}`}>
                        {status === 'complete' ? 'Complete' : status === 'overdue' ? 'Overdue' : 'In Progress'}
                      </span>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            status === 'overdue' ? 'bg-red-500' :
                            status === 'complete' ? 'bg-green-500' :
                            'bg-[#6C63FF]'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <span>Due: {lastPhase ? new Date(lastPhase.endDate).toLocaleDateString() : 'No due date'}</span>
                      <span>👤 {hasPhases && project.phases[project.currentPhaseIndex]?.personInCharge || 'Unassigned'}</span>
                    </div>
                    {/* Mini Gantt Bar */}
                    <div className="flex space-x-1">
                      {hasPhases ? project.phases.map((_, phaseIndex) => (
                        <div
                          key={phaseIndex}
                          className={`h-1 rounded-full flex-1 ${
                            phaseIndex < project.currentPhaseIndex ? 'bg-[#38B2AC]' :
                            phaseIndex === project.currentPhaseIndex ? 'bg-[#6C63FF]' :
                            'bg-gray-500'
                          }`}
                          title={`Phase ${phaseIndex + 1}`}
                        ></div>
                      )) : (
                        <div className="h-1 rounded-full flex-1 bg-gray-500" title="No phases defined"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}