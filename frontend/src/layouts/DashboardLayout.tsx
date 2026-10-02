import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
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
      case 'critical': return 'bg-rose-100/40 border border-rose-200/60 text-rose-700';
      case 'warning': return 'bg-amber-100/40 border border-amber-200/60 text-amber-700';
      default: return 'bg-surface-muted border border-line text-ink';
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
    <div className="energy-app flex h-screen bg-paper text-ink overflow-hidden font-sans">

      {/* Sidebar */}
      <aside className={`energy-sidebar fixed inset-y-0 left-0 z-40 border-r border-line flex flex-col transition-transform duration-300 md:translate-x-0 md:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="sidebar-brand"><Brand /></div>

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2 rounded-sm text-xs font-medium transition-all duration-150 group
                  ${isActive
                    ? 'bg-[#fbe4d7] text-ink border border-[#efb599] font-semibold'
                    : 'text-muted hover:text-ink hover:bg-[#e9ecde]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={`${isActive ? 'text-ink' : 'text-muted group-hover:text-ink'} transition-colors duration-150`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-sm
                    ${isActive
                      ? 'bg-surface-muted text-ink'
                      : 'bg-rose-100/60 text-rose-700 border border-rose-200/60'
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
        <div className="p-3 border-t border-line shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2.5 w-full px-3 py-2 rounded-sm text-xs font-medium text-rose-700 hover:text-rose-700 bg-rose-100/30 hover:bg-rose-100/60 border border-rose-200/40 transition-all duration-150"
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
        <header className="energy-header border-b border-line flex items-center justify-between z-20 shrink-0">

          {/* Left: mobile toggle + PowerIQ brand */}
          <div className="flex items-center gap-3">
            <button
              className="p-1.5 rounded-sm border border-line bg-surface hover:bg-surface-muted text-ink md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
            >
              <Menu size={16} />
            </button>

            {/* PowerIQ Logo */}
            <div className="header-context"><strong>{menuItems.find(item => item.path === location.pathname)?.name || (location.pathname === '/profile' ? 'Profile' : location.pathname === '/settings' ? 'Settings' : 'Overview')}</strong></div>
          </div>

          {/* Right: Alerts + Profile */}
          <div className="flex items-center gap-3">

            {/* Notification bell */}
            <div className="relative">
              <button
                aria-label="Toggle notifications"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileDropdownOpen(false);
                }}
                className={`p-2 rounded-sm border border-line bg-surface hover:bg-surface-muted text-ink relative transition-all ${notificationsOpen ? 'bg-surface-muted border-line' : ''}`}
              >
                <Bell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-700 text-[9px] font-bold text-paper flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dialog */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="energy-notifications absolute right-0 mt-2 w-80 max-w-[calc(100vw-40px)] bg-surface border border-line rounded-sm shadow-sm p-4 space-y-3 z-50 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-line pb-2">
                      <span className="text-xs font-semibold text-ink">Active Alerts ({unreadCount})</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllAlertsRead()}
                          className="text-[10px] text-muted hover:text-ink cursor-pointer bg-transparent border-none font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <p className="text-muted text-center text-xs py-4">No active notifications</p>
                      ) : (
                        alerts.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markAlertRead(n.id)}
                            className={`p-2.5 rounded-sm text-xs space-y-1 cursor-pointer transition-all ${getAlertColor(n.severity as any)}`}
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
                    <div className="border-t border-line pt-2 text-center">
                      <Link
                        to="/alerts"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-xs text-muted hover:text-ink font-medium block"
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
                aria-label="Open account menu"
                aria-expanded={profileDropdownOpen}
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-sm border border-line bg-surface hover:bg-surface-muted transition-all"
              >
                <div className="w-6 h-6 rounded-sm bg-line text-ink flex items-center justify-center font-bold text-[10px]">
                  {getInitials(user?.name)}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-medium text-ink leading-none">{user?.name || 'John Doe'}</p>
                </div>
                <ChevronDown size={12} className="text-muted" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-surface border border-line rounded-sm shadow-sm p-1.5 space-y-0.5 z-50 animate-in fade-in duration-150">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-medium text-ink hover:text-ink hover:bg-surface-muted transition-colors"
                    >
                      <UserIcon size={14} />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-xs font-medium text-ink hover:text-ink hover:bg-surface-muted transition-colors"
                    >
                      <Settings size={14} />
                      <span>Settings</span>
                    </Link>
                    <div className="h-px bg-line my-1" />
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-sm text-xs font-medium text-rose-700 hover:bg-rose-100/40 transition-colors"
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
        <main className="energy-content flex-1 overflow-y-auto bg-paper">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" onClick={() => setLogoutConfirmOpen(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="bg-surface border border-line rounded-sm p-5 w-full max-w-sm space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-rose-100/50 border border-rose-200/60 flex items-center justify-center text-rose-700 shrink-0">
                  <LogOut size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">Confirm Logout</h3>
                  <p className="text-xs text-muted mt-0.5">End your current session</p>
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Are you sure you want to sign out of PowerIQ? You can log back in anytime.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="flex-1 px-3 py-2 rounded-sm text-xs font-medium text-ink bg-surface-muted border border-line hover:bg-line transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-3 py-2 rounded-sm text-xs font-medium text-rose-700 bg-rose-100/80 hover:bg-rose-100 border border-rose-200 transition-all"
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
