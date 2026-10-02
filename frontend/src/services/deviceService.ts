import type { Device } from '../types';
import api from './api';
import { isLocalSession, mockAccountStore } from './mockAccountStore';
const map = (dto: any): Device => ({ id: String(dto.id), name: dto.name, type: dto.type,
  status: dto.status.toLowerCase(), powerDraw: dto.powerDraw ?? 0, roomId: dto.roomId });
const payload = (device: Device) => ({ name: device.name, type: device.type,
  status: device.status.toUpperCase(), powerDraw: device.powerDraw, roomId: device.roomId });
export const deviceService = {
  getDevices: async (): Promise<Device[]> => {
    if (isLocalSession()) return mockAccountStore.devices();
    const response = await api.get('/devices');
    if (!Array.isArray(response.data)) throw new Error('Invalid device response');
    return response.data.map(map);
  },
  updateDevices: async (devices: Device[]): Promise<Device[]> => {
    if (isLocalSession()) return mockAccountStore.update(devices);
    const updated: Device[] = [];
    for (const device of devices) {
      const response = device.id.startsWith('new_') ? await api.post('/devices', payload(device)) : await api.put(`/devices/${device.id}`, payload(device));
      updated.push(map(response.data));
    }
    return updated;
  },
  deleteDevice: async (id: string) => {
    if (isLocalSession()) { mockAccountStore.remove(id); return; }
    await api.delete(`/devices/${id}`);
  },
  toggleDeviceStatus: async (id: string, status: 'online' | 'offline'): Promise<boolean> => {
    const device = (await deviceService.getDevices()).find(d => d.id === id);
    if (!device) throw new Error('Device not found');
    await deviceService.updateDevices([{ ...device, status }]); return true;
  },
};
