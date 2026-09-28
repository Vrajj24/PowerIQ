import { useState } from 'react';
import { useDevices } from '../context/DeviceContext';
import { 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  CheckCheck, 
  Search, 
  Clock
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Alerts() {
  const { alerts, markAlertRead, markAllAlertsRead } = useDevices();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertOctagon className="text-rose-400 w-4 h-4 shrink-0" />;
      case 'warning': return <AlertTriangle className="text-amber-400 w-4 h-4 shrink-0" />;
      default: return <Info className="text-sky-400 w-4 h-4 shrink-0" />;
    }
  };

  const getAlertStyle = (severity: string, read: boolean) => {
    if (read) return 'border-[#1e293b] bg-[#0d121d]/50 opacity-50';
    switch (severity) {
      case 'critical': return 'border-rose-900/60 bg-rose-950/30 text-rose-200';
      case 'warning': return 'border-amber-900/60 bg-amber-950/30 text-amber-200';
      default: return 'border-[#1e293b] bg-[#121824] text-slate-200';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'read' ? alert.read : !alert.read);
    const titleText = alert.title || alert.message || '';
    const matchesSearch = alert.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          titleText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Alert Center</h1>
          <p className="text-slate-400 text-xs mt-0.5">Real-time anomaly monitoring, high power warnings, and status logs.</p>
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAlertsRead()}
            className="flex items-center gap-2 text-xs"
          >
            <CheckCheck size={14} />
            <span>Mark All Read ({unreadCount})</span>
          </Button>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#121824] p-3 border border-[#1e293b] rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search alerts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d121d] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-slate-400"
          />
        </div>

        <div className="flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#0d121d] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card className="text-center py-12">
            <CheckCheck className="mx-auto text-emerald-400 w-8 h-8 mb-2" />
            <h3 className="text-sm font-semibold text-slate-200">No active alerts</h3>
            <p className="text-slate-400 text-xs mt-0.5">All telemetry indicators are operating within normal parameters.</p>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              onClick={() => markAlertRead(alert.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${getAlertStyle(alert.severity || 'info', alert.read)}`}
            >
              {getAlertIcon(alert.severity || 'info')}
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                    {!alert.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                    <span>{alert.title || 'Notification'}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
