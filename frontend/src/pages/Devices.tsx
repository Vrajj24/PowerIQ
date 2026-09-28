import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Search, 
  Plus, 
  Grid, 
  List, 
  Edit3, 
  Trash2, 
  Cpu,
  Power
} from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import type { Device } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

const DEVICE_PRESETS: Record<string, { label: string; watts: number; emoji: string }> = {
  'HVAC':          { label: 'HVAC / Air Conditioner', watts: 2000, emoji: '❄️' },
  'Heating':       { label: 'Heater / Heat Pump',     watts: 1500, emoji: '🔥' },
  'Appliance':     { label: 'Appliance (General)',    watts: 800,  emoji: '🍽️' },
  'Refrigerator':  { label: 'Refrigerator / Fridge',  watts: 150,  emoji: '🧊' },
  'WashingMachine':{ label: 'Washing Machine',        watts: 2200, emoji: '👕' },
  'Dishwasher':    { label: 'Dishwasher',             watts: 1800, emoji: '🫧' },
  'Microwave':     { label: 'Microwave Oven',         watts: 1100, emoji: '📡' },
  'Oven':          { label: 'Oven / Stove',           watts: 2400, emoji: '🍳' },
  'Entertainment': { label: 'TV / Entertainment',     watts: 150,  emoji: '📺' },
  'Lighting':      { label: 'Lighting (LED)',         watts: 15,   emoji: '💡' },
  'Lighting_CFL':  { label: 'Lighting (CFL/Tube)',    watts: 40,   emoji: '🔆' },
  'Climate':       { label: 'Fan / Ceiling Fan',      watts: 75,   emoji: '🌀' },
  'WaterHeater':   { label: 'Water Heater / Geyser',  watts: 2000, emoji: '🚿' },
  'EV_Charger':    { label: 'EV Charger',             watts: 7200, emoji: '⚡' },
  'Computer':      { label: 'Desktop / Gaming PC',   watts: 400,  emoji: '💻' },
  'Router':        { label: 'Router / Modem',         watts: 20,   emoji: '📶' },
  'Utility':       { label: 'Utility (Other)',        watts: 500,  emoji: '🔌' },
};

const deviceSchema = z.object({
  name: z.string().min(2, 'Device name must be at least 2 characters'),
  roomId: z.string().min(1, 'Room is required'),
  type: z.string().min(1, 'Device type is required'),
  powerDraw: z.coerce.number().positive('Power draw must be positive'),
  status: z.enum(['online', 'offline']),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

export default function Devices() {
  const { devices, toggleDeviceStatus, addDevice, updateDevice, deleteDevice } = useDevices();
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'power'>('name');

  const [selectedTypeKey, setSelectedTypeKey] = useState('HVAC');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDeviceId, setDeletingDeviceId] = useState<string | null>(null);

  const {
    register: regAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    setValue: setAddValue,
    formState: { errors: errorsAdd }
  } = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema) as any,
    defaultValues: { name: '', roomId: 'Living Room', type: 'HVAC', powerDraw: 2000, status: 'offline' }
  });

  const {
    register: regEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: errorsEdit }
  } = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema) as any
  });

  const handleTypeChange = (typeKey: string) => {
    setSelectedTypeKey(typeKey);
    const preset = DEVICE_PRESETS[typeKey];
    if (preset) {
      setAddValue('type', typeKey);
      setAddValue('powerDraw', preset.watts);
    }
  };

  const onAddDeviceSubmit = (data: DeviceFormValues) => {
    addDevice(data);
    setIsAddOpen(false);
    resetAdd({ name: '', roomId: 'Living Room', type: 'HVAC', powerDraw: 2000, status: 'offline' });
    setSelectedTypeKey('HVAC');
  };

  const handleStartEdit = (device: Device) => {
    setEditingDevice(device);
    resetEdit({
      name: device.name,
      roomId: device.roomId || '',
      type: device.type,
      powerDraw: device.powerDraw,
      status: device.status as 'online' | 'offline'
    });
  };

  const onEditDeviceSubmit = (data: DeviceFormValues) => {
    if (editingDevice) {
      updateDevice(editingDevice.id, data);
      setEditingDevice(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingDeviceId) {
      deleteDevice(deletingDeviceId);
      setDeletingDeviceId(null);
    }
  };

  const rooms = ['all', ...Array.from(new Set(devices.map(d => d.roomId)))];

  const processedDevices = devices
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (d.roomId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            d.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRoom = selectedRoom === 'all' || d.roomId === selectedRoom;
      const matchesStatus = selectedStatus === 'all' || d.status === selectedStatus;
      return matchesSearch && matchesRoom && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'power') return b.powerDraw - a.powerDraw;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Appliance Directory</h1>
          <p className="text-slate-400 text-xs mt-0.5">Manage connected smart devices, monitor live draws, and configure telemetry parameters.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Add Appliance</span>
        </Button>
      </div>

      {/* Control Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between bg-[#121824] p-3 border border-[#1e293b] rounded-xl">
        <div className="flex flex-col md:flex-row gap-2.5 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search appliances, rooms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d121d] border border-[#1e293b] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-slate-400 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select 
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="bg-[#0d121d] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-slate-400"
            >
              <option value="all">All Rooms</option>
              {rooms.filter(r => r !== 'all').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0d121d] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-slate-400"
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#0d121d] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-slate-400"
            >
              <option value="name">Sort by Name</option>
              <option value="power">Sort by Wattage</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#0d121d] border border-[#1e293b] rounded-lg p-1">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#1e293b] text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Grid size={14} />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-[#1e293b] text-slate-100' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {processedDevices.length === 0 && (
        <Card className="text-center py-12">
          <Cpu className="mx-auto text-slate-500 w-10 h-10 mb-2" />
          <h3 className="text-sm font-semibold text-slate-200">No matching appliances</h3>
          <p className="text-slate-400 text-xs mt-0.5">Try clearing filters or adding a new device.</p>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && processedDevices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {processedDevices.map((device) => {
            const isOnline = device.status === 'online';
            return (
              <Card key={device.id} hoverEffect={true} className="flex flex-col justify-between p-4 bg-[#121824]">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-100 text-xs line-clamp-1">{device.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{device.roomId} • {device.type}</p>
                    </div>
                    <span className={`text-[10px] font-medium rounded px-2 py-0.5 border ${
                      isOnline 
                        ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300' 
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}>
                      {device.status}
                    </span>
                  </div>

                  <div className="bg-[#0d121d] border border-[#1e293b] rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rated Draw</span>
                      <span className="text-base font-bold font-mono text-slate-100">{Number(device.powerDraw).toFixed(0)} <span className="text-xs font-sans text-slate-400">W</span></span>
                    </div>
                    <button 
                      onClick={() => toggleDeviceStatus(device.id)}
                      className={`p-2 rounded-lg border transition-all ${
                        isOnline 
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/80' 
                          : 'bg-[#182236] border-[#2b3a5a] text-slate-300 hover:text-slate-100'
                      }`}
                      title="Toggle Power"
                    >
                      <Power size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-[#1e293b]">
                  <button 
                    onClick={() => handleStartEdit(device)}
                    className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] transition-colors"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button 
                    onClick={() => setDeletingDeviceId(device.id)}
                    className="p-1.5 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && processedDevices.length > 0 && (
        <div className="border border-[#1e293b] rounded-xl overflow-hidden bg-[#121824]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d121d] border-b border-[#1e293b] text-slate-400 uppercase font-medium">
                <tr>
                  <th className="p-3">Device Name</th>
                  <th className="p-3">Room</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Power Draw</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b] text-slate-200">
                {processedDevices.map(d => (
                  <tr key={d.id} className="hover:bg-[#182236] transition-colors">
                    <td className="p-3 font-semibold text-slate-100">{d.name}</td>
                    <td className="p-3 text-slate-300">{d.roomId}</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{d.type}</td>
                    <td className="p-3 font-mono font-bold text-slate-100">{d.powerDraw} W</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-medium rounded px-2 py-0.5 border ${
                        d.status === 'online' 
                          ? 'bg-emerald-950/40 border-emerald-900/60 text-emerald-300' 
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleDeviceStatus(d.id)} className="p-1 rounded text-slate-400 hover:text-slate-100">
                          <Power size={13} />
                        </button>
                        <button onClick={() => handleStartEdit(d)} className="p-1 rounded text-slate-400 hover:text-slate-100">
                          <Edit3 size={13} />
                        </button>
                        <button onClick={() => setDeletingDeviceId(d.id)} className="p-1 rounded text-rose-400 hover:text-rose-200">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Device Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Appliance">
        <form onSubmit={handleAddSubmit(onAddDeviceSubmit)} className="space-y-4">
          <Input 
            id="name" 
            label="Appliance Name" 
            placeholder="e.g. Living Room AC"
            error={errorsAdd.name?.message}
            {...regAdd('name')} 
          />

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-medium text-slate-300">Room Location</label>
            <select 
              {...regAdd('roomId')}
              className="bg-[#0d121d] border border-[#1e293b] rounded-lg p-2 text-xs text-slate-100 outline-none"
            >
              {['Living Room', 'Master Bedroom', 'Bedroom 2', 'Kitchen', 'Bathroom', 'Laundry', 'Garage', 'Office'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-medium text-slate-300">Preset Category</label>
            <select 
              value={selectedTypeKey}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="bg-[#0d121d] border border-[#1e293b] rounded-lg p-2 text-xs text-slate-100 outline-none"
            >
              {Object.entries(DEVICE_PRESETS).map(([key, val]) => (
                <option key={key} value={key}>{val.label} ({val.watts}W)</option>
              ))}
            </select>
          </div>

          <Input 
            id="powerDraw" 
            label="Rated Power (Watts)" 
            type="number"
            error={errorsAdd.powerDraw?.message}
            {...regAdd('powerDraw')} 
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Device</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Device Modal */}
      <Modal isOpen={Boolean(editingDevice)} onClose={() => setEditingDevice(null)} title="Edit Appliance">
        <form onSubmit={handleEditSubmit(onEditDeviceSubmit)} className="space-y-4">
          <Input 
            id="editName" 
            label="Appliance Name" 
            error={errorsEdit.name?.message}
            {...regEdit('name')} 
          />

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-medium text-slate-300">Room Location</label>
            <select 
              {...regEdit('roomId')}
              className="bg-[#0d121d] border border-[#1e293b] rounded-lg p-2 text-xs text-slate-100 outline-none"
            >
              {['Living Room', 'Master Bedroom', 'Bedroom 2', 'Kitchen', 'Bathroom', 'Laundry', 'Garage', 'Office'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <Input 
            id="editPowerDraw" 
            label="Rated Power (Watts)" 
            type="number"
            error={errorsEdit.powerDraw?.message}
            {...regEdit('powerDraw')} 
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditingDevice(null)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={Boolean(deletingDeviceId)} 
        onClose={() => setDeletingDeviceId(null)} 
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to remove this appliance from your telemetry scope?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeletingDeviceId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>Delete Appliance</Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
