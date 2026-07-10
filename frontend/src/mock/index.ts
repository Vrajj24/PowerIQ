import type { Device, Alert, TelemetryPoint, UsageSummary } from '../types';

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'dev_ac',
    name: 'Air Conditioner',
    room: 'Living Room',
    type: 'HVAC',
    ratedPower: 1800,
    currentConsumption: 1450,
    status: 'on',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'dev_fridge',
    name: 'Smart Refrigerator',
    room: 'Kitchen',
    type: 'Appliance',
    ratedPower: 300,
    currentConsumption: 120,
    status: 'on',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'dev_fan',
    name: 'Ceiling Fan',
    room: 'Master Bedroom',
    type: 'Climate',
    ratedPower: 75,
    currentConsumption: 65,
    status: 'on',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'dev_tv',
    name: 'OLED Television',
    room: 'Living Room',
    type: 'Entertainment',
    ratedPower: 150,
    currentConsumption: 0,
    status: 'off',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'dev_wm',
    name: 'Washing Machine',
    room: 'Laundry Room',
    type: 'Appliance',
    ratedPower: 650,
    currentConsumption: 0,
    status: 'standby',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'dev_lights',
    name: 'LED Ceiling Lights',
    room: 'Kitchen',
    type: 'Lighting',
    ratedPower: 120,
    currentConsumption: 95,
    status: 'on',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'dev_microwave',
    name: 'Microwave Oven',
    room: 'Kitchen',
    type: 'Appliance',
    ratedPower: 1200,
    currentConsumption: 0,
    status: 'off',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'dev_heater',
    name: 'Water Heater',
    room: 'Bathroom',
    type: 'Utility',
    ratedPower: 2500,
    currentConsumption: 2200,
    status: 'on',
    lastUpdated: new Date().toISOString(),
  },
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt_1',
    title: 'High Energy Consumption',
    message: 'Overall energy usage has increased by 15% compared to yesterday.',
    category: 'energy',
    severity: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
  },
  {
    id: 'alt_2',
    title: 'Device Left ON Too Long',
    message: 'Air Conditioner in Living Room has been running continuously for 12 hours.',
    category: 'device',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    deviceId: 'dev_ac',
    read: false,
  },
  {
    id: 'alt_3',
    title: 'Abnormal Energy Spike',
    message: 'Grid telemetry registered a temporary voltage surge of 252V.',
    category: 'system',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    read: true,
  },
  {
    id: 'alt_4',
    title: 'Estimated Bill Exceeded Limit',
    message: 'Your estimated bill has crossed the ₹7500 threshold.',
    category: 'billing',
    severity: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    read: true,
  },
  {
    id: 'alt_5',
    title: 'Scheduled Maintenance Reminder',
    message: 'HVAC system is due for filter replacement next week.',
    category: 'device',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    deviceId: 'dev_ac',
    read: true,
  },
  {
    id: 'alt_6',
    title: 'Device Offline',
    message: 'Smart Bulb in Kitchen has lost connection to the network.',
    category: 'system',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 2880).toISOString(),
    read: false,
  },
];

// Live Consumption: Hourly points for today
export const HOURLY_TELEMETRY: TelemetryPoint[] = [
  { timestamp: '00:00', activePower: 1.2 },
  { timestamp: '02:00', activePower: 0.8 },
  { timestamp: '04:00', activePower: 0.7 },
  { timestamp: '06:00', activePower: 1.1 },
  { timestamp: '08:00', activePower: 2.3 },
  { timestamp: '10:00', activePower: 3.1 },
  { timestamp: '12:00', activePower: 2.8 },
  { timestamp: '14:00', activePower: 3.5 },
  { timestamp: '16:00', activePower: 4.2 },
  { timestamp: '18:00', activePower: 4.8 },
  { timestamp: '20:00', activePower: 3.9 },
  { timestamp: '22:00', activePower: 2.1 },
];

// Weekly consumption in kWh
export const WEEKLY_USAGE = [
  { day: 'Mon', usage: 22.4, solar: 8.5 },
  { day: 'Tue', usage: 24.1, solar: 9.0 },
  { day: 'Wed', usage: 19.8, solar: 7.2 },
  { day: 'Thu', usage: 28.5, solar: 6.8 },
  { day: 'Fri', usage: 21.3, solar: 10.1 },
  { day: 'Sat', usage: 32.6, solar: 12.0 },
  { day: 'Sun', usage: 26.4, solar: 11.5 },
];

// Monthly consumption in kWh
export const MONTHLY_USAGE = [
  { month: 'Jan', usage: 680, bill: 115 },
  { month: 'Feb', usage: 620, bill: 105 },
  { month: 'Mar', usage: 590, bill: 98 },
  { month: 'Apr', usage: 720, bill: 124 },
  { month: 'May', usage: 840, bill: 148 },
  { month: 'Jun', usage: 910, bill: 165 },
  { month: 'Jul', usage: 980, bill: 178 },
  { month: 'Aug', usage: 950, bill: 172 },
  { month: 'Sep', usage: 810, bill: 140 },
  { month: 'Oct', usage: 710, bill: 122 },
  { month: 'Nov', usage: 640, bill: 108 },
  { month: 'Dec', usage: 730, bill: 126 },
];

// Peak Usage hourly average (0-23)
export const PEAK_HOURS_DATA = [
  { hour: '12 AM', load: 1.1 },
  { hour: '3 AM', load: 0.7 },
  { hour: '6 AM', load: 1.2 },
  { hour: '9 AM', load: 2.8 },
  { hour: '12 PM', load: 3.4 },
  { hour: '3 PM', load: 3.9 },
  { hour: '6 PM', load: 4.8 },
  { hour: '9 PM', load: 3.2 },
];

// Room-wise Energy Distribution
export const ROOM_DISTRIBUTION = [
  { name: 'Living Room', value: 38, color: '#06b6d4' }, // Cyan
  { name: 'Kitchen', value: 24, color: '#6366f1' },      // Indigo
  { name: 'Bathroom', value: 20, color: '#a855f7' },     // Purple
  { name: 'Master Bedroom', value: 12, color: '#10b981' }, // Emerald
  { name: 'Laundry Room', value: 6, color: '#f59e0b' },    // Amber
];

export const MOCK_SUMMARY: UsageSummary = {
  currentPower: 3.93, // kW sum of all active devices (1450 + 120 + 65 + 95 + 2200 = 3930W = 3.93kW)
  todayUsage: 26.4, // kWh
  monthlyUsage: 980, // kWh for July
  estimatedBill: 7840.00, // INR
  activeDevices: 5,
  efficiencyScore: 88, // A grade
};
