import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Device, Alert, UsageSummary } from '../types';
import { deviceService, alertService, dashboardService, websocketService } from '../services';

interface DeviceContextType {
  devices: Device[];
  alerts: Alert[];
  summary: UsageSummary | null;
  error: string | null;
  toggleDeviceStatus: (id: string) => void;
  addDevice: (device: Omit<Device, 'id'>) => void;
  updateDevice: (id: string, updatedFields: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<UsageSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [devs, alts, summ] = await Promise.all([
          deviceService.getDevices(),
          alertService.getAlerts(),
          dashboardService.getSummary()
        ]);
        setDevices(devs);
        setAlerts(alts as any);
        setSummary(summ as any);
      } catch (err: any) {
        console.error("Failed to load backend data", err);
        setError(err.message || String(err));
      }
    };
    loadData();

    // Connect to WebSockets
    websocketService.connect();
    
    websocketService.onTelemetry((data: any) => {
      setSummary({
        currentPower: data.currentPowerDraw,
        dailyUsage: data.dailyUsageKwh,
        monthlyUsage: data.monthlyUsageKwh,
        estimatedBill: data.estimatedBill,
        activeDevices: data.activeDevices,
        totalDevices: data.totalDevices, // Include totalDevices from backend
        efficiencyScore: 85 // Mock or calculate based on data
      });
      // Optionally reload devices to get fresh powerDraw values
      deviceService.getDevices().then(setDevices);
    });

    websocketService.onAlert((alert: any) => {
      setAlerts(prev => [alert, ...prev]);
    });

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const toggleDeviceStatus = async (id: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    const newStatus = device.status === 'online' ? 'offline' : 'online';
    
    // Optimistic UI update
    setDevices(prev => prev.map(d => 
      d.id === id ? { ...d, status: newStatus } : d
    ));

    const success = await deviceService.toggleDeviceStatus(id, newStatus === 'online' ? 'online' : 'offline');
    if (!success) {
      // Revert if failed
      setDevices(prev => prev.map(d => 
        d.id === id ? { ...d, status: device.status } : d
      ));
    }
  };

  const addDevice = async (device: Omit<Device, 'id'>) => {
    // Generate a temporary ID so it renders immediately
    const tempId = `new_${Date.now()}`;
    const newDevice = { ...device, id: tempId } as Device;
    setDevices(prev => [...prev, newDevice]);

    // Send to backend
    const updated = await deviceService.updateDevices([newDevice]);
    setDevices(prev => prev.map(d => d.id === tempId ? updated[0] : d));
  };

  const updateDevice = async (id: string, updatedFields: Partial<Device>) => {
    const original = devices.find(d => d.id === id);
    if (!original) return;
    
    const updatedDevice = { ...original, ...updatedFields };
    setDevices(prev => prev.map(d => d.id === id ? updatedDevice : d));
    
    await deviceService.updateDevices([updatedDevice]);
  };

  const deleteDevice = async (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    // Implementation needed in deviceService for delete if you want it to persist deletion
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    alertService.markAsRead(id);
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <DeviceContext.Provider value={{
      devices,
      alerts,
      summary,
      error,
      toggleDeviceStatus,
      addDevice,
      updateDevice,
      deleteDevice,
      markAlertRead,
      markAllAlertsRead
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};
