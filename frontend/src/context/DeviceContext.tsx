import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Device, Alert, UsageSummary, AnalyticsData } from '../types';
import { deviceService, alertService, dashboardService, analyticsService } from '../services';
import { useAuth } from './AuthContext';
import { isLocalSession, mockAccountStore } from '../services/mockAccountStore';
interface DeviceContextType {
  devices: Device[]; alerts: Alert[]; summary: UsageSummary | null; history: AnalyticsData[]; error: string | null;
  toggleDeviceStatus: (id: string) => Promise<void>;
  addDevice: (device: Omit<Device, 'id'>) => Promise<void>;
  updateDevice: (id: string, fields: Partial<Device>) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  markAlertRead: (id: string) => void; markAllAlertsRead: () => void;
}
const DeviceContext = createContext<DeviceContextType | undefined>(undefined);
export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [history, setHistory] = useState<AnalyticsData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const request = useRef(0);
  const refresh = useCallback(async () => {
    const accountGeneration = generation.current;
    const sequence = ++request.current;
    try {
      const [devs, alts, summ, readings] = await Promise.all([
        deviceService.getDevices(), alertService.getAlerts(), dashboardService.getSummary(), analyticsService.getHistoricalData(30),
      ]);
      if (accountGeneration !== generation.current || sequence !== request.current) return;
      setDevices(devs); setAlerts(alts); setSummary({ ...summ, efficiencyScore: devs.length ? 85 : undefined });
      setHistory(devs.length ? readings : []); setError(null);
    } catch (e) {
      if (accountGeneration === generation.current && sequence === request.current) setError(e instanceof Error ? e.message : 'Unable to load account data.');
    }
  }, []);
  useEffect(() => {
    const accountGeneration = ++generation.current; setDevices([]); setAlerts([]); setSummary(null); setHistory([]); setError(null);
    void refresh();
    const interval = window.setInterval(() => {
      if (isLocalSession()) mockAccountStore.capture();
      void refresh();
    }, 5000);
    return () => { if (generation.current === accountGeneration) generation.current = accountGeneration + 1; window.clearInterval(interval); };
  }, [user?.email, refresh]);
  const mutate = async (action: () => Promise<unknown>) => {
    const accountGeneration = generation.current;
    try { await action(); if (accountGeneration === generation.current) await refresh(); }
    catch (e) { if (accountGeneration === generation.current) setError(e instanceof Error ? e.message : 'Unable to save device.'); throw e; }
  };
  const toggleDeviceStatus = (id: string) => mutate(() => deviceService.toggleDeviceStatus(id, devices.find(d => d.id === id)?.status === 'online' ? 'offline' : 'online'));
  const addDevice = (device: Omit<Device, 'id'>) => mutate(() => deviceService.updateDevices([{ ...device, id: `new_${crypto.randomUUID()}` }]));
  const updateDevice = (id: string, fields: Partial<Device>) => mutate(async () => {
    const device = devices.find(d => d.id === id); if (!device) throw new Error('Device not found');
    await deviceService.updateDevices([{ ...device, ...fields }]);
  });
  const deleteDevice = (id: string) => mutate(() => deviceService.deleteDevice(id));
  const markAlertRead = (id: string) => { setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a)); void alertService.markAsRead(id); };
  const markAllAlertsRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  return <DeviceContext.Provider value={{ devices, alerts, summary, history, error, toggleDeviceStatus, addDevice, updateDevice, deleteDevice, markAlertRead, markAllAlertsRead }}>{children}</DeviceContext.Provider>;
};
export const useDevices = () => {
  const context = useContext(DeviceContext); if (!context) throw new Error('useDevices must be used within a DeviceProvider'); return context;
};
