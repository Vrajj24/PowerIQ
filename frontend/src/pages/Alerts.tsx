import { useState } from 'react';
import { useDevices } from '../context/DeviceContext';

import { 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  CheckCheck, 
  Search, 
  SlidersHorizontal,
  Clock
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Alerts() {
  const { alerts, markAlertRead, markAllAlertsRead } = useDevices();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertOctagon className="text-rose-900 w-5 h-5" />;
      case 'warning': return <AlertTriangle className="text-amber-900 w-5 h-5" />;
      default: return <Info className="text-[#c5a059] w-5 h-5" />;
    }
  };

  const getAlertBorderColor = (severity: string, read: boolean) => {
    if (read) return 'border-slate-200 opacity-60';
    switch (severity) {
      case 'critical': return 'border-rose-900 bg-rose-50 border-2';
      case 'warning': return 'border-amber-900 bg-amber-50 border-2';
      default: return 'border-slate-900 bg-slate-50 border-2';
    }
  };

  const handleMarkRead = (id: string) => {
    markAlertRead(id);
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesCategory = filterCategory === 'all' || alert.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'read' ? alert.read : !alert.read);
    const matchesSearch = alert.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight">Alert Center</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">Monitor real-time system alerts, efficiency warnings, and grid anomalies.</p>
        </div>
        {alerts.filter(a => !a.read).length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={markAllAlertsRead}
            className="flex items-center gap-2"
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {/* Controls: Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#faf9f5] p-4 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2 h-4 w-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search alerts by title or description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-slate-900 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SlidersHorizontal size={14} className="text-slate-500 hidden sm:block" />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-white border-2 border-slate-900 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold uppercase tracking-wider outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          >
            <option value="all">All Categories</option>
            <option value="energy">Energy</option>
            <option value="device">Device</option>
            <option value="system">System</option>
            <option value="billing">Billing</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border-2 border-slate-900 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold uppercase tracking-wider outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          >
            <option value="all">All Statuses</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCheck className="mx-auto text-emerald-800 w-12 h-12 mb-3 opacity-80" />
            <h3 className="text-lg font-bold font-serif text-slate-900">No alerts found</h3>
            <p className="text-slate-500 text-xs mt-1">Everything looks normal in your smart grid network.</p>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl flex gap-4 transition-all duration-150 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] ${getAlertBorderColor(alert.severity as any, alert.read)}`}
            >
              <div className="shrink-0 mt-0.5">
                {getAlertIcon(alert.severity as any)}
              </div>
              <div className="flex-1 space-y-1 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                    {alert.message}
                    {!alert.read && (
                      <span className="bg-rose-50 text-rose-900 border-2 border-rose-900 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md">
                        New
                      </span>
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{alert.message}</p>
              </div>
              {!alert.read && (
                <button 
                  onClick={() => handleMarkRead(alert.id)}
                  className="self-center p-1.5 rounded-lg border-2 border-slate-900 bg-white text-slate-800 hover:bg-[#faf9f5] shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none"
                  title="Mark as read"
                >
                  <CheckCheck size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
