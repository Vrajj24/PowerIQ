export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export type DeviceStatus = 'on' | 'off' | 'standby';

export interface Device {
  id: string;
  name: string;
  room: string;
  type: string;
  ratedPower: number; // in Watts
  currentConsumption: number; // in Watts (active consumption)
  status: DeviceStatus;
  lastUpdated: string; // ISO String
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  title: string;
  message: string;
  category: 'energy' | 'device' | 'system' | 'billing';
  severity: AlertSeverity;
  timestamp: string;
  deviceId?: string;
  read: boolean;
}

export interface TelemetryPoint {
  timestamp: string; // e.g. "14:00"
  activePower: number; // in kW
  solarGeneration?: number; // in kW
  batteryLevel?: number; // percentage
}

export interface UsageSummary {
  currentPower: number; // in kW
  todayUsage: number; // in kWh
  monthlyUsage: number; // in kWh
  estimatedBill: number; // in INR
  activeDevices: number;
  efficiencyScore: number; // 0-100 or grade
}
