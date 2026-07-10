import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Device, Alert, UsageSummary, DeviceStatus } from '../types';
import { deviceService, alertService, dashboardService } from '../services';

interface DeviceContextType {
  devices: Device[];
  alerts: Alert[];
  summary: UsageSummary | null;
  toggleDeviceStatus: (id: string) => void;
  addDevice: (device: Omit<Device, 'id' | 'currentConsumption' | 'lastUpdated'>) => void;
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

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const [devs, alts, summ] = await Promise.all([
        deviceService.getDevices(),
        alertService.getAlerts(),
        dashboardService.getSummary()
      ]);
      setDevices(devs);
      setAlerts(alts);
      setSummary(summ);
    };
    loadData();
  }, []);

  // Sync state to services when they change
  useEffect(() => {
    if (devices.length > 0) {
      deviceService.updateDevices(devices);
    }
  }, [devices]);

  useEffect(() => {
    if (alerts.length > 0) {
      alertService.updateAlerts(alerts);
    }
  }, [alerts]);

  // Recalculate summary metrics whenever devices change
  useEffect(() => {
    if (devices.length === 0 || !summary) return;

    const activeCount = devices.filter(d => d.status === 'on').length;
    
    // Sum active wattages
    const totalWatts = devices.reduce((sum, d) => sum + d.currentConsumption, 0);
    const totalKw = parseFloat((totalWatts / 1000).toFixed(2));

    // Dynamic calculations based on base mock data
    const baselineDailyKwh = 20.0;
    const activeConsumptionContribution = totalKw * 1.5; // weight
    const todayKwh = parseFloat((baselineDailyKwh + activeConsumptionContribution).toFixed(1));
    
    const monthlyKwh = Math.round(920 + todayKwh * 2.2);
    const estimatedBill = parseFloat((monthlyKwh * 8.00).toFixed(2)); // ₹8.00 per kWh flat rate

    // Efficiency calculation
    const totalRated = devices.reduce((sum, d) => sum + d.ratedPower, 0);
    const loadFactor = totalRated > 0 ? (totalWatts / totalRated) : 0;
    const efficiency = Math.max(65, Math.min(98, Math.round(95 - (loadFactor * 20))));

    setSummary({
      ...summary,
      currentPower: totalKw,
      todayUsage: todayKwh,
      monthlyUsage: monthlyKwh,
      estimatedBill: estimatedBill,
      activeDevices: activeCount,
      efficiencyScore: efficiency,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices]);

  const toggleDeviceStatus = (id: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === id) {
        const newStatus: DeviceStatus = device.status === 'on' ? 'off' : 'on';
        return {
          ...device,
          status: newStatus,
          currentConsumption: newStatus === 'on' ? device.ratedPower * (0.8 + Math.random() * 0.2) : 0,
          lastUpdated: new Date().toISOString(),
        };
      }
      return device;
    }));
    deviceService.toggleDeviceStatus(id, 'on'); // Simulate API call to backend
  };

  const addDevice = (deviceData: Omit<Device, 'id' | 'currentConsumption' | 'lastUpdated'>) => {
    const newDevice: Device = {
      ...deviceData,
      id: `dev_${Date.now()}`,
      currentConsumption: deviceData.status === 'on' ? deviceData.ratedPower : 0,
      lastUpdated: new Date().toISOString(),
    };
    setDevices(prev => [...prev, newDevice]);
  };

  const updateDevice = (id: string, updatedFields: Partial<Device>) => {
    setDevices(prev => prev.map(device => 
      device.id === id ? { ...device, ...updatedFields, lastUpdated: new Date().toISOString() } : device
    ));
  };

  const deleteDevice = (id: string) => {
    setDevices(prev => prev.filter(device => device.id !== id));
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAlertsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  return (
    <DeviceContext.Provider value={{
      devices,
      alerts,
      summary,
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
