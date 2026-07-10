import type { Device } from '../types';
import { INITIAL_DEVICES } from '../mock';
import { simulateDelay } from './api';

export const deviceService = {
  getDevices: async (): Promise<Device[]> => {
    const saved = localStorage.getItem('poweriq_devices');
    const devices = saved ? JSON.parse(saved) : INITIAL_DEVICES;
    return simulateDelay(devices);
  },

  updateDevices: async (devices: Device[]): Promise<Device[]> => {
    localStorage.setItem('poweriq_devices', JSON.stringify(devices));
    return simulateDelay(devices, 200);
  },

  toggleDeviceStatus: async (_deviceId: string, _status: 'on' | 'off'): Promise<boolean> => {
    // We can simulate an API call that toggles the status and returns success
    return simulateDelay(true, 300);
  }
};
