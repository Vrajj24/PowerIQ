import type { Device } from '../types';
import api from './api';

export const deviceService = {
  getDevices: async (): Promise<Device[]> => {
    const response = await api.get('/devices');
    const data = response.data.value || response.data;
    // Map DTOs to internal Device type
    return data.map((dto: any) => ({
      id: dto.id.toString(),
      name: dto.name,
      type: dto.type,
      status: dto.status.toLowerCase(),
      powerDraw: dto.powerDraw,
      roomId: dto.roomId || 'unassigned'
    }));
  },

  updateDevices: async (devices: Device[]): Promise<Device[]> => {
    // We update them one by one since the backend doesn't have a batch update endpoint
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
          id: response.data.id.toString()
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
  },

  toggleDeviceStatus: async (deviceId: string, status: 'online' | 'offline'): Promise<boolean> => {
    // We need to fetch the device first to put it back with the new status
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
      return false;
    }
  }
};
