import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, DollarSign, Monitor, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('poweriq_settings');
    if (saved) return JSON.parse(saved);
    return {
      landingPage: 'dashboard',
      timeRange: 'monthly',
      theme: 'system',
      emailNotifs: true,
      pushNotifs: true,
      alertThreshold: 'warning',
      costPerUnit: 8.00,
      currency: 'INR',
      powerLimit: 5.5
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem('poweriq_settings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-left pb-10">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-ink tracking-tight">Make it work for you</h1>
        <p className="text-muted text-xs mt-0.5">Your tariffs, your alerts, your everyday preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {isSaved && (
          <div className="p-3 bg-emerald-100/40 border border-emerald-200/60 text-emerald-700 text-xs rounded-sm flex items-center gap-2">
            <Check size={15} />
            <span>Settings saved successfully</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Appearance & Layout */}
          <Card className="flex flex-col gap-4 p-5 bg-surface">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-ink border-b border-line pb-2">
              <Monitor size={15} className="text-muted" />
              <span>Appearance & Defaults</span>
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-ink font-medium">Default Landing Page</label>
                <select 
                  value={settings.landingPage}
                  onChange={(e) => handleChange('landingPage', e.target.value)}
                  className="bg-paper border border-line rounded-sm p-2 text-xs text-ink outline-none"
                >
                  <option value="dashboard">Dashboard</option>
                  <option value="analytics">Analytics</option>
                  <option value="reports">Reports</option>
                  <option value="devices">Devices</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-ink font-medium">Default Analytics Interval</label>
                <select 
                  value={settings.timeRange}
                  onChange={(e) => handleChange('timeRange', e.target.value)}
                  className="bg-paper border border-line rounded-sm p-2 text-xs text-ink outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Card 2: Energy & Utility */}
          <Card className="flex flex-col gap-4 p-5 bg-surface">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-ink border-b border-line pb-2">
              <DollarSign size={15} className="text-muted" />
              <span>Tariff & Pricing Model</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-ink font-medium">Currency</label>
                  <select 
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="bg-paper border border-line rounded-sm p-2 text-xs text-ink outline-none"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-ink font-medium">Cost per kWh</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={settings.costPerUnit}
                    onChange={(e) => handleChange('costPerUnit', parseFloat(e.target.value) || 0)}
                    className="bg-paper border border-line rounded-sm p-2 text-xs text-ink outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-ink">Peak Load Alert Threshold</span>
                  <span className="font-mono text-ink font-bold">{settings.powerLimit.toFixed(1)} kW</span>
                </div>
                <input 
                  type="range"
                  min="2.0"
                  max="12.0"
                  step="0.5"
                  value={settings.powerLimit}
                  onChange={(e) => handleChange('powerLimit', parseFloat(e.target.value))}
                  className="w-full accent-accent bg-surface-muted rounded-sm cursor-pointer"
                />
              </div>
            </div>
          </Card>

          {/* Notifications Card */}
          <Card className="flex flex-col gap-4 p-5 md:col-span-2 bg-surface">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-ink border-b border-line pb-2">
              <Bell size={15} className="text-muted" />
              <span>Notification Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-sm bg-paper border border-line cursor-pointer">
                <input 
                  type="checkbox"
                  checked={settings.emailNotifs}
                  onChange={(e) => handleChange('emailNotifs', e.target.checked)}
                  className="w-4 h-4 rounded bg-surface border-line text-ink"
                />
                <div>
                  <span className="block text-ink font-medium">Email Digests</span>
                  <span className="block text-[11px] text-muted mt-0.5">Receive weekly consumption reports.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-sm bg-paper border border-line cursor-pointer">
                <input 
                  type="checkbox"
                  checked={settings.pushNotifs}
                  onChange={(e) => handleChange('pushNotifs', e.target.checked)}
                  className="w-4 h-4 rounded bg-surface border-line text-ink"
                />
                <div>
                  <span className="block text-ink font-medium">Push Alerts</span>
                  <span className="block text-[11px] text-muted mt-0.5">Instant browser notifications for peak load anomalies.</span>
                </div>
              </label>
            </div>
          </Card>

          {/* Action Row */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button type="submit" variant="primary">
              Save Settings
            </Button>
          </div>

          {/* Session Termination */}
          <Card className="flex flex-col gap-4 p-5 md:col-span-2 border-rose-200/60 bg-rose-100/20">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-rose-700">Session Management</p>
                <p className="text-rose-700/70 mt-0.5">Sign out of the current device session and redirect to homepage.</p>
              </div>
              <Button type="button" variant="danger" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut size={14} /> Logout
              </Button>
            </div>
          </Card>

        </div>

      </form>
    </div>
  );
}
