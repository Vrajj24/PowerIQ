export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export type DeviceStatus = 'online' | 'offline';

export interface Device {
  id: string;
  name: string;
  roomId?: string;
  type: string;
  powerDraw: number;
  status: string; // "online" | "offline"
  lastUpdated?: string; 
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: string;
  type?: string; 
  title?: string; // Keep for UI compat
  message: string;
  category?: 'energy' | 'device' | 'system' | 'billing';
  severity?: AlertSeverity;
  timestamp: string;
  deviceId?: string;
  read: boolean;
}

export interface TelemetryPoint {
  timestamp: string;
  activePower: number;
  solarGeneration?: number;
  batteryLevel?: number;
}

export interface DashboardSummary {
  currentPower: number;
  dailyUsage: number;
  monthlyUsage: number;
  estimatedBill: number;
  activeDevices: number;
  totalDevices: number;
}

export interface UsageSummary extends DashboardSummary {
  todayUsage?: number;
  efficiencyScore?: number;
}

export interface AnalyticsData {
  timestamp: string;
  powerDraw: number;
  activeDevices: number;
}
