import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import poweriqLogo from '../assets/poweriq-logo.png';
import { 
  LayoutDashboard, 
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
    navigate('/');
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-950/40 border border-rose-900/60 text-rose-200';
      case 'warning': return 'bg-amber-950/40 border border-amber-900/60 text-amber-200';
      default: return 'bg-slate-800 border border-slate-700 text-slate-200';
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
    <div className="flex h-screen bg-[#090d14] text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0d121d] border-r border-[#1e293b] flex flex-col transition-transform duration-300 md:translate-x-0 md:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 group
                  ${isActive 
                    ? 'bg-[#1a2336] text-white border border-[#2a3650] font-semibold' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#141b2b]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={`${isActive ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'} transition-colors duration-150`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-md
                    ${isActive 
                      ? 'bg-slate-700 text-slate-100' 
                      : 'bg-rose-900/60 text-rose-300 border border-rose-800/60'
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
        <div className="p-3 border-t border-[#1e293b] shrink-0">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-100 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 transition-all duration-150"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-14 bg-[#0d121d] border-b border-[#1e293b] flex items-center justify-between px-5 z-20 shrink-0">
          
          {/* Left: mobile toggle + PowerIQ brand */}
          <div className="flex items-center gap-3">
            <button 
              className="p-1.5 rounded-lg border border-[#1e293b] bg-[#121824] hover:bg-[#1a2234] text-slate-300 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={16} />
            </button>

            {/* PowerIQ Logo */}
            <div className="flex items-center gap-2">
              <img src={poweriqLogo} alt="PowerIQ" className="h-9 w-auto object-contain brightness-110" />
            </div>
          </div>

          {/* Right: Alerts + Profile */}
          <div className="flex items-center gap-3">
            
            {/* Notification bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                className={`p-2 rounded-lg border border-[#1e293b] bg-[#121824] hover:bg-[#1a2234] text-slate-300 relative transition-all ${notificationsOpen ? 'bg-[#1a2234] border-slate-600' : ''}`}
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dialog */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-[#121824] border border-[#1e293b] rounded-xl shadow-xl p-4 space-y-3 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
                      <span className="text-xs font-semibold text-slate-200">Active Alerts ({unreadCount})</span>
                      {unreadCount > 0 && (
                        <button 
                          onClick={() => markAllAlertsRead()}
                          className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer bg-transparent border-none font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <p className="text-slate-500 text-center text-xs py-4">No active notifications</p>
                      ) : (
                        alerts.slice(0, 4).map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => markAlertRead(n.id)}
                            className={`p-2.5 rounded-lg text-xs space-y-1 cursor-pointer transition-all ${getAlertColor(n.severity as any)}`}
                          >
                            <div className="flex items-center justify-between font-medium">
                              <span className="truncate">{n.title}</span>
                              <span className="opacity-50 text-[10px] shrink-0">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="opacity-80 text-[11px] leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="border-t border-[#1e293b] pt-2 text-center">
                      <Link 
                        to="/alerts" 
                        onClick={() => setNotificationsOpen(false)} 
                        className="text-xs text-slate-400 hover:text-slate-200 font-medium block"
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
                className="flex items-center gap-2 p-1 pr-2.5 rounded-lg border border-[#1e293b] bg-[#121824] hover:bg-[#1a2234] transition-all"
              >
                <div className="w-6 h-6 rounded-md bg-[#1e293b] text-slate-200 flex items-center justify-center font-bold text-[10px]">
                  {getInitials(user?.name)}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-medium text-slate-200 leading-none">{user?.name || 'John Doe'}</p>
                </div>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-[#121824] border border-[#1e293b] rounded-xl shadow-xl p-1.5 space-y-0.5 z-50 animate-in fade-in duration-150">
                    <Link 
                      to="/profile" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-[#1a2234] transition-colors"
                    >
                      <UserIcon size={14} />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-slate-100 hover:bg-[#1a2234] transition-colors"
                    >
                      <Settings size={14} />
                      <span>Settings</span>
                    </Link>
                    <div className="h-px bg-[#1e293b] my-1" />
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
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
        <main className="flex-1 overflow-y-auto p-5 md:p-7 bg-[#090d14]">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={() => setLogoutConfirmOpen(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-5 w-full max-w-sm space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-950/50 border border-rose-900/60 flex items-center justify-center text-rose-400 shrink-0">
                  <LogOut size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Confirm Logout</h3>
                  <p className="text-xs text-slate-400 mt-0.5">End your current session</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to sign out of PowerIQ? You can log back in anytime.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 bg-[#1a2234] border border-[#2e3b52] hover:bg-[#242f44] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-rose-200 bg-rose-900/80 hover:bg-rose-900 border border-rose-800 transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
