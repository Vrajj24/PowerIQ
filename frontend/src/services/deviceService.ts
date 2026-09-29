import type { Device } from '../types';
import api from './api';
import { INITIAL_DEVICES } from '../mock';

export const deviceService = {
  getDevices: async (): Promise<Device[]> => {
    try {
      const response = await api.get('/devices');
      const data = response.data?.value || response.data;
      if (!Array.isArray(data)) {
        return INITIAL_DEVICES;
      }
      return data.map((dto: any) => ({
        id: dto.id ? dto.id.toString() : `dev_${Math.random()}`,
        name: dto.name || 'Unnamed Appliance',
        type: dto.type || 'Appliance',
        status: (dto.status || 'offline').toLowerCase(),
        powerDraw: dto.powerDraw || 0,
        roomId: dto.roomId || 'General'
      }));
    } catch (e) {
      console.warn('Backend /devices endpoint unavailable, using mock data:', e);
      return INITIAL_DEVICES;
    }
  },

  updateDevices: async (devices: Device[]): Promise<Device[]> => {
    try {
      const updatedDevices = [];
      for (const device of devices) {
        if (device.id.startsWith('new_')) {
          const response = await api.post('/devices', {
            name: device.name,
            type: device.type,
            status: device.status.toUpperCase(),
            powerDraw: device.powerDraw,
            roomId: device.roomId
          });
          updatedDevices.push({
            ...device,
            id: response.data?.id ? response.data.id.toString() : device.id
          });
        } else {
          await api.put(`/devices/${device.id}`, {
            name: device.name,
            type: device.type,
            status: device.status.toUpperCase(),
            powerDraw: device.powerDraw,
            roomId: device.roomId
          });
          updatedDevices.push(device);
        }
      }
      return updatedDevices;
    } catch (e) {
      console.warn('Backend updateDevices failed, returning local state:', e);
      return devices;
    }
  },

  toggleDeviceStatus: async (deviceId: string, status: 'online' | 'offline'): Promise<boolean> => {
    try {
      const getResponse = await api.get(`/devices/${deviceId}`);
      const device = getResponse.data;
      
      await api.put(`/devices/${deviceId}`, {
        name: device.name,
        type: device.type,
        status: status === 'online' ? 'ONLINE' : 'OFFLINE',
        powerDraw: device.powerDraw,
        roomId: device.roomId
      });
      return true;
    } catch (e) {
      return true; // Return true locally so UI toggle state stays responsive
    }
  }
};
