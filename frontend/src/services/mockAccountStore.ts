import type { Device, Alert, AnalyticsData, DashboardSummary } from '../types';
import { INITIAL_DEVICES } from '../mock';

type AccountData = { devices: Device[]; alerts: Alert[]; history: AnalyticsData[] };
const key = (email: string) => `poweriq_mock_account_v1:${email.trim().toLowerCase()}`;
const account = () => JSON.parse(localStorage.getItem('poweriq_user') || '{}').email as string;
export const isLocalSession = () => (localStorage.getItem('poweriq_token') || '').startsWith('jwt_token_');
const save = (email: string, data: AccountData) => localStorage.setItem(key(email), JSON.stringify(data));
export function initializeMockAccount(email: string, existing: boolean) {
  if (localStorage.getItem(key(email))) return;
  const devices = existing ? structuredClone(INITIAL_DEVICES) : [];
  const power = devices.filter(d => d.status === 'online').reduce((sum, d) => sum + d.powerDraw, 0) / 1000;
  const history = existing ? Array.from({ length: 721 }, (_, i) => ({
    timestamp: new Date(Date.now() - (720 - i) * 3600000).toISOString(),
    powerDraw: power * (0.6 + 0.4 * Math.sin(i * 0.3) ** 2),
    activeDevices: devices.filter(d => d.status === 'online').length,
  })) : [];
  save(email, { devices, alerts: [], history });
}
function read(): AccountData {
  const email = account();
  if (!email) throw new Error('No active account');
  initializeMockAccount(email, true);
  return JSON.parse(localStorage.getItem(key(email))!);
}
export const mockAccountStore = {
  devices: () => read().devices,
  alerts: () => read().alerts,
  summary: (): DashboardSummary => {
    const devices = read().devices;
    const active = devices.filter(d => d.status === 'online');
    const currentPower = active.reduce((sum, d) => sum + d.powerDraw, 0) / 1000;
    const dailyUsage = currentPower * 24 * 0.6;
    return { currentPower, dailyUsage, monthlyUsage: dailyUsage * 30, estimatedBill: dailyUsage * 30 * 8, activeDevices: active.length, totalDevices: devices.length };
  },
  history: (days: number) => read().history.filter(r => Date.parse(r.timestamp) >= Date.now() - days * 86400000),
  capture: () => {
    const data = read();
    if (!data.devices.length) return;
    const summary = mockAccountStore.summary();
    data.history.push({ timestamp: new Date().toISOString(), powerDraw: summary.currentPower, activeDevices: summary.activeDevices });
    data.history = data.history.filter(r => Date.parse(r.timestamp) >= Date.now() - 30 * 86400000);
    save(account(), data);
  },
  update: (devices: Device[]) => {
    const data = read();
    const updated = devices.map(d => ({ ...d, id: d.id.startsWith('new_') ? crypto.randomUUID() : d.id }));
    updated.forEach(device => {
      const index = data.devices.findIndex(d => d.id === device.id);
      if (index < 0) data.devices.push(device); else data.devices[index] = device;
    });
    save(account(), data); mockAccountStore.capture(); return updated;
  },
  remove: (id: string) => {
    const data = read(); data.devices = data.devices.filter(d => d.id !== id);
    save(account(), data); mockAccountStore.capture();
  },
};
