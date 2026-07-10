import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import poweriqLogo from '../assets/poweriq-logo.png';
import { 
  LayoutDashboard, 
  Zap, 
  BarChart3, 
  FileText, 
  Bell, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronDown,
  MonitorSmartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDevices } from '../context/DeviceContext';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { alerts, markAllAlertsRead, markAlertRead } = useDevices();
  
  const location = useLocation();
  const navigate = useNavigate();

  // Filter unread notifications to display
  const unreadAlerts = alerts.filter(a => !a.read);
  const unreadCount = unreadAlerts.length;

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Devices', path: '/devices', icon: MonitorSmartphone },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Alerts', path: '/alerts', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    setLogoutConfirmOpen(false);
    logout();
    navigate('/login');
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-50 border-2 border-rose-900 text-rose-900';
      case 'warning': return 'bg-amber-50 border-2 border-amber-900 text-amber-900';
      default: return 'bg-sky-50 border-2 border-sky-900 text-sky-900';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'JD';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex h-screen bg-[#f4f1ea] text-slate-900 overflow-hidden">
      
      {/* Sidebar — no header, nav starts at top */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#faf9f5] border-r-2 border-slate-900 flex flex-col transition-transform duration-300 md:translate-x-0 md:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>

        {/* Navigation items — starts directly from top */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 group
                  ${isActive 
                    ? 'bg-[#1a2a3a] text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] pl-3.5' 
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-900/5 pl-4'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'} transition-colors duration-150`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border-2
                    ${isActive 
                      ? 'bg-white text-[#1a2a3a] border-slate-900' 
                      : 'bg-rose-50 text-rose-900 border-rose-900'
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t-2 border-slate-900 shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-rose-900 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-rose-50 transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header — PowerIQ brand on left, controls on right */}
        <header className="h-16 bg-[#faf9f5] border-b-2 border-slate-900 flex items-center justify-between px-6 z-20 shrink-0">
          
          {/* Left: mobile toggle + PowerIQ brand */}
          <div className="flex items-center gap-4">
            <button 
              className="p-1.5 rounded-lg border-2 border-slate-900 bg-white hover:bg-[#f4f1ea] text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={16} />
            </button>

            {/* PowerIQ Logo */}
            <img src={poweriqLogo} alt="PowerIQ" className="h-14 w-auto object-contain mix-blend-darken" />
          </div>

          {/* Right: Alerts + Profile */}
          <div className="flex items-center gap-4">
            
            {/* Notification bell and popover */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                className={`p-2 rounded-lg border-2 border-slate-900 bg-white hover:bg-[#f4f1ea] text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] relative transition-all ${notificationsOpen ? 'bg-[#f4f1ea] translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]' : ''}`}
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 border-2 border-slate-900 text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dialog */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Alerts ({unreadCount})</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={() => markAllAlertsRead()}
                          className="text-[9px] text-[#c5a059] hover:text-[#b08c45] cursor-pointer bg-transparent border-none font-bold uppercase tracking-wider"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <p className="text-slate-400 text-center text-[10px] py-4">No recent alerts</p>
                      ) : (
                        alerts.slice(0, 4).map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              markAlertRead(n.id);
                            }}
                            className={`p-2.5 rounded-lg text-xs space-y-1 cursor-pointer transition-all border-2
                              ${getAlertColor(n.severity)}
                              ${n.read ? 'opacity-40 border-slate-200 hover:opacity-60' : 'border-slate-900 hover:-translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'}
                            `}
                          >
                            <div className="flex items-center justify-between font-bold">
                              <span className="flex items-center gap-1.5 truncate">
                                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 border border-slate-900 shrink-0" />}
                                <span className="truncate">{n.title}</span>
                              </span>
                              <span className="opacity-60 font-semibold text-[9px] shrink-0">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="opacity-95 leading-normal text-[10px]">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="border-t-2 border-slate-900 pt-2 text-center">
                      <Link 
                        to="/alerts" 
                        onClick={() => setNotificationsOpen(false)} 
                        className="text-[10px] text-slate-500 hover:text-slate-950 font-bold uppercase tracking-wider block"
                      >
                        View all notification history →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2.5 p-1 pr-3 rounded-lg border-2 border-slate-900 bg-white hover:bg-[#faf9f5] transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
              >
                <div className="w-7 h-7 rounded-md bg-[#1a2a3a] text-white border border-slate-900 flex items-center justify-center font-extrabold text-[10px] font-sans tracking-wider">
                  {getInitials(user?.name)}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-[10px] font-bold leading-none text-slate-900 uppercase tracking-wider">{user?.name || 'John Doe'}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Analyst</p>
                </div>
                <ChevronDown size={12} className="text-slate-900" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-3 w-48 bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link 
                      to="/profile" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-950 hover:bg-slate-900/5 transition-colors"
                    >
                      <UserIcon size={14} />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-950 hover:bg-slate-900/5 transition-colors"
                    >
                      <Settings size={14} />
                      <span>Settings</span>
                    </Link>
                    <div className="h-[2px] bg-slate-900/10 my-1" />
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-rose-900 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm" onClick={() => setLogoutConfirmOpen(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-6 w-full max-w-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 border-2 border-rose-900 flex items-center justify-center text-rose-900 shrink-0">
                  <LogOut size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-serif text-slate-900">Confirm Logout</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Your session will end</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to sign out of PowerIQ? You will need to enter your credentials again to access the dashboard.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-[#f4f1ea] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-rose-600 border-2 border-rose-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-rose-700 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
