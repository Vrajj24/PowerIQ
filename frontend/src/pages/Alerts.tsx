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
      case 'critical': return <AlertOctagon className="text-rose-700 w-4 h-4 shrink-0" />;
      case 'warning': return <AlertTriangle className="text-amber-700 w-4 h-4 shrink-0" />;
      default: return <Info className="text-sky-700 w-4 h-4 shrink-0" />;
    }
  };

  const getAlertStyle = (severity: string, read: boolean) => {
    if (read) return 'border-line bg-paper/50 opacity-50';
    switch (severity) {
      case 'critical': return 'border-rose-200/60 bg-rose-100/30 text-rose-700';
      case 'warning': return 'border-amber-200/60 bg-amber-100/30 text-amber-700';
      default: return 'border-line bg-surface text-ink';
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
          <h1 className="text-xl font-bold text-ink tracking-tight">Keep an eye on things</h1>
          <p className="text-muted text-xs mt-0.5">Real-time anomaly monitoring, high power warnings, and status logs.</p>
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
      <div className="flex flex-col sm:flex-row gap-3 bg-surface p-3 border border-line rounded-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted" />
          <input 
            type="text" 
            placeholder="Search alerts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-paper border border-line rounded-sm pl-9 pr-3 py-1.5 text-xs text-ink placeholder:text-muted outline-none focus:border-line"
          />
        </div>

        <div className="flex gap-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-paper border border-line rounded-sm px-3 py-1.5 text-xs text-ink outline-none"
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
            <CheckCheck className="mx-auto text-emerald-700 w-8 h-8 mb-2" />
            <h3 className="text-sm font-semibold text-ink">No active alerts</h3>
            <p className="text-muted text-xs mt-0.5">All telemetry indicators are operating within normal parameters.</p>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              onClick={() => markAlertRead(alert.id)}
              className={`p-4 rounded-sm border transition-all cursor-pointer flex items-start gap-3.5 ${getAlertStyle(alert.severity || 'info', alert.read)}`}
            >
              {getAlertIcon(alert.severity || 'info')}
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-ink flex items-center gap-2">
                    {!alert.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
                    <span>{alert.title || 'Notification'}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-muted flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-ink leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
