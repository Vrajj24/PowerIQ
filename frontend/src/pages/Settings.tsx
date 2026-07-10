import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, DollarSign, Monitor, ShieldAlert, Check, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Load from localStorage or defaults
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-left pb-10">
      <div>
        <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-600 text-xs font-medium mt-1">Configure dashboard defaults, utility pricing, and security parameters.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {isSaved && (
          <div className="p-3 bg-emerald-50 border-2 border-emerald-900 text-[#5a7366] text-xs rounded-lg flex items-center gap-2 font-bold uppercase tracking-wide">
            <Check size={16} />
            <span>Settings synced successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Dashboard Settings & Appearance */}
          <Card className="flex flex-col gap-6 p-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b-2 border-slate-900 pb-2">
                <Monitor size={16} className="text-[#c5a059]" />
                Appearance & Layout
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Default Landing Page</label>
                  <select 
                    value={settings.landingPage}
                    onChange={(e) => handleChange('landingPage', e.target.value)}
                    className="bg-white border-2 border-slate-900 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  >
                    <option value="dashboard">Dashboard</option>
                    <option value="analytics">Analytics</option>
                    <option value="reports">Reports</option>
                    <option value="devices">Devices</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Default Time Range</label>
                  <select 
                    value={settings.timeRange}
                    onChange={(e) => handleChange('timeRange', e.target.value)}
                    className="bg-white border-2 border-slate-900 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Theme Mode</label>
                  <div className="flex gap-2">
                    {['light', 'dark', 'system'].map(theme => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => handleChange('theme', theme)}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border-2 transition-all ${settings.theme === theme ? 'bg-[#1a2a3a] text-white border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]' : 'border-slate-900 bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: Energy Settings */}
          <Card className="flex flex-col gap-6 p-6">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b-2 border-slate-900 pb-2">
                <DollarSign size={16} className="text-[#c5a059]" />
                Energy & Utility
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Currency</label>
                    <select 
                      value={settings.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="bg-white border-2 border-slate-900 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div className="flex-[2] flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Cost per Unit</label>
                    <input 
                      type="number"
                      step="0.1"
                      value={settings.costPerUnit}
                      onChange={(e) => handleChange('costPerUnit', parseFloat(e.target.value) || 0)}
                      className="bg-white border-2 border-slate-900 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 uppercase tracking-wide">
                    <span>Consumption Target (kW)</span>
                    <span className="text-slate-900 font-serif text-sm">{settings.powerLimit.toFixed(1)} kW</span>
                  </div>
                  <input 
                    type="range"
                    min="2.0"
                    max="12.0"
                    step="0.5"
                    value={settings.powerLimit}
                    onChange={(e) => handleChange('powerLimit', parseFloat(e.target.value))}
                    className="w-full accent-[#c5a059] h-1.5 bg-slate-200 rounded-full cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Triggers 'High Load' warning if active demand exceeds this threshold.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 3: Notification Preferences */}
          <Card className="flex flex-col gap-6 p-6 md:col-span-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b-2 border-slate-900 pb-2">
                <Bell size={16} className="text-[#c5a059]" />
                Notification Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border-2 border-slate-900 cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-1px] transition-all">
                  <input 
                    type="checkbox"
                    checked={settings.emailNotifs}
                    onChange={(e) => handleChange('emailNotifs', e.target.checked)}
                    className="w-4 h-4 rounded bg-white border-2 border-slate-900 text-[#c5a059] focus:ring-[#c5a059]/35 accent-[#c5a059]"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider leading-tight">Email Digests</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 font-semibold leading-relaxed">Receive weekly summary reports.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border-2 border-slate-900 cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-1px] transition-all">
                  <input 
                    type="checkbox"
                    checked={settings.pushNotifs}
                    onChange={(e) => handleChange('pushNotifs', e.target.checked)}
                    className="w-4 h-4 rounded bg-white border-2 border-slate-900 text-[#c5a059] focus:ring-[#c5a059]/35 accent-[#c5a059]"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900 uppercase tracking-wider leading-tight">Push Alerts</span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 font-semibold leading-relaxed">Instant browser notifications for anomalies.</span>
                  </div>
                </label>

                <div className="sm:col-span-2 pt-2">
                  <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block mb-2">Minimum Alert Threshold</label>
                  <select 
                    value={settings.alertThreshold}
                    onChange={(e) => handleChange('alertThreshold', e.target.value)}
                    className="bg-white border-2 border-slate-900 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] w-full sm:w-1/2"
                  >
                    <option value="info">All Alerts (Info, Warning, Critical)</option>
                    <option value="warning">Warnings & Critical Only</option>
                    <option value="critical">Critical Anomalies Only</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Row */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <Button type="submit" variant="primary">
              Save Preferences
            </Button>
          </div>

          {/* Security & Danger Zone */}
          <Card className="flex flex-col gap-6 p-6 md:col-span-2 border-rose-900 bg-rose-50/30">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-rose-900 uppercase tracking-wider mb-4 border-b-2 border-rose-900 pb-2">
                <ShieldAlert size={16} />
                Security & Access
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900 font-serif">Terminate Session</p>
                  <p className="text-[10px] font-semibold text-slate-600 mt-0.5">Securely log out of the current device session.</p>
                </div>
                <Button type="button" variant="outline" onClick={handleLogout} className="flex items-center gap-2 min-w-[140px]">
                  <LogOut size={14} /> Logout
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6 pt-6 border-t border-rose-200">
                <div>
                  <p className="text-sm font-bold text-rose-900 font-serif">Delete Account</p>
                  <p className="text-[10px] font-semibold text-rose-700 mt-0.5">Permanently erase all user data, devices, and telemetry history.</p>
                </div>
                {!showDeleteConfirm ? (
                  <button 
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="min-w-[140px] p-2 bg-rose-100 hover:bg-rose-200 text-rose-900 border-2 border-rose-900 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(159,18,57,1)] transition-all active:translate-y-[1px] active:translate-x-[1px] active:shadow-none"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-2 bg-white text-slate-600 border-2 border-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className="px-3 py-2 bg-rose-700 text-white border-2 border-rose-950 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(159,18,57,1)] flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
        </div>
      </form>
    </div>
  );
}
