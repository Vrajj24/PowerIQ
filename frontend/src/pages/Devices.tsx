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
  X, 
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { useDevices } from '../context/DeviceContext';
import type { Device, DeviceStatus } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

// Zod schema for Add/Edit Device forms
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
  
  // Grid vs Table layout state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'power' | 'consumption'>('name');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDeviceId, setDeletingDeviceId] = useState<string | null>(null);

  // Form setups (cast resolver to any to fix TS conflict with coercion schema)
  const {
    register: regAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: errorsAdd }
  } = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema) as any,
    defaultValues: { name: '', roomId: 'living-room', type: 'Appliance', powerDraw: 0, status: 'offline' }
  });

  const {
    register: regEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: errorsEdit }
  } = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema) as any
  });

  // Handle Add Device
  const onAddDeviceSubmit = (data: DeviceFormValues) => {
    addDevice(data);
    setIsAddOpen(false);
    resetAdd();
  };

  // Trigger Edit modal and preload data
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

  // Handle Save Edit
  const onEditDeviceSubmit = (data: DeviceFormValues) => {
    if (editingDevice) {
      updateDevice(editingDevice.id, data);
      setEditingDevice(null);
    }
  };

  // Handle Confirm Delete
  const handleDeleteConfirm = () => {
    if (deletingDeviceId) {
      deleteDevice(deletingDeviceId);
      setDeletingDeviceId(null);
    }
  };

  // Get distinct list of rooms for filter select
  const rooms = ['all', ...Array.from(new Set(devices.map(d => d.roomId)))];

  // Filter and Sort devices
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
      if (sortBy === 'consumption') return b.powerDraw - a.powerDraw;
      return a.name.localeCompare(b.name);
    });

  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-50 border-2 border-emerald-950 text-emerald-950 font-bold';
      case 'offline':
        return 'bg-amber-50 border-2 border-amber-950 text-amber-950 font-bold';
      default:
        return 'bg-slate-50 border-2 border-slate-400 text-slate-500 font-bold';
    }
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-serif text-slate-900 tracking-tight">Devices</h1>
          <p className="text-slate-600 text-xs font-medium mt-1">Manage and toggle status of all connected appliances on the smart grid.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add Device</span>
        </Button>
      </div>

      {/* Control Bar: Filters, Search, Sort & Toggle layout */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between bg-[#faf9f5] p-4 border-2 border-slate-900 rounded-2xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex flex-col md:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2 h-4 w-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search appliances, rooms, types..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2.5">
            <select 
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="bg-white border-2 border-slate-900 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold uppercase tracking-wider outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <option value="all">All Rooms</option>
              {rooms.filter(r => r !== 'all').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border-2 border-slate-900 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold uppercase tracking-wider outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <option value="all">All Statuses</option>
              <option value="online">On</option>
              <option value="offline">Off</option>
              <option value="offline">Standby</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-white border-2 border-slate-900 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-bold uppercase tracking-wider outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
            >
              <option value="name">Sort by Name</option>
              <option value="power">Sort by Rated Power</option>
              <option value="consumption">Sort by Consumption</option>
            </select>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 self-end xl:self-center border-2 border-slate-900 rounded-lg p-1 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#1a2a3a] text-white border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Grid size={14} />
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`p-1 rounded transition-colors ${viewMode === 'table' ? 'bg-[#1a2a3a] text-white border border-slate-950 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Empty State */}
      {processedDevices.length === 0 && (
        <Card className="text-center py-16">
          <Cpu className="mx-auto text-slate-400 w-12 h-12 mb-3" />
          <h3 className="text-lg font-bold font-serif text-slate-900">No devices found</h3>
          <p className="text-slate-500 text-xs mt-1">Try adjusting your search criteria or register a new appliance.</p>
        </Card>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && processedDevices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processedDevices.map((device) => {
            const isRunning = device.status === 'online';
            return (
              <Card key={device.id} hoverEffect={true} className="flex flex-col justify-between h-56 relative group">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 tracking-wide text-sm font-serif line-clamp-1">{device.name}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">{device.roomId}</p>
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold border-2 rounded-md px-1.5 py-0.5 ${getStatusBadge(device.status as DeviceStatus)}`}>
                      {device.status}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center bg-slate-50 border-2 border-slate-900 rounded-lg p-2.5">
                    <div>
                      <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">Active Load</span>
                      <span className="text-base font-bold text-slate-900 font-serif">
                        {Number(device.powerDraw).toFixed(1)} <span className="text-[10px] font-normal text-slate-500 font-sans">W</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-bold">Capacity</span>
                      <span className="text-xs font-bold text-slate-700 font-serif">
                        {Number(device.powerDraw).toFixed(1)}W
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-center gap-2 mt-4">
                  <button 
                    onClick={() => toggleDeviceStatus(device.id)}
                    className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md border-2 transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]
                      ${isRunning 
                        ? 'bg-[#1a2a3a] border-slate-900 text-white shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] hover:bg-[#25394e]' 
                        : device.status === 'offline'
                          ? 'bg-amber-100 border-slate-900 text-amber-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] hover:bg-amber-200'
                          : 'bg-white border-slate-900 text-slate-700 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-50'
                      }
                    `}
                  >
                    Quick Switch
                  </button>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleStartEdit(device)}
                      className="p-1.5 rounded-lg border-2 border-slate-900 bg-white text-slate-800 hover:bg-[#faf9f5] shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none"
                      title="Edit"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button 
                      onClick={() => setDeletingDeviceId(device.id)}
                      className="p-1.5 rounded-lg border-2 border-slate-900 bg-white text-slate-800 hover:bg-rose-50 hover:text-rose-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-none"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && processedDevices.length > 0 && (
        <div className="editorial-card rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-[#faf9f5] text-slate-900 font-bold uppercase tracking-wider">
                <th className="p-4">Device</th>
                <th className="p-4">Room</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Rated Power</th>
                <th className="p-4 text-right">Active Draw</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-900">
              {processedDevices.map((device) => (
                <tr key={device.id} className="hover:bg-slate-50 transition-colors text-slate-700">
                  <td className="p-4 font-bold text-slate-900 font-serif text-sm">{device.name}</td>
                  <td className="p-4 font-semibold">{device.roomId}</td>
                  <td className="p-4">
                    <span className="bg-slate-50 border-2 border-slate-900 px-2 py-0.5 rounded-md text-[8px] uppercase font-bold tracking-wider text-slate-700">
                      {device.type}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold">{Number(device.powerDraw).toFixed(1)} W</td>
                  <td className="p-4 text-right font-bold text-slate-900 font-serif">{Number(device.powerDraw).toFixed(1)} W</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleDeviceStatus(device.id)}
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-extrabold rounded-md border-2 transition-all active:scale-[0.97] ${getStatusBadge(device.status as DeviceStatus)}`}
                    >
                      {device.status}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1.5">
                      <button 
                        onClick={() => handleStartEdit(device)}
                        className="p-1 rounded-md border border-transparent hover:border-slate-900 hover:bg-slate-50 text-slate-700 hover:text-slate-950 transition-colors"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button 
                        onClick={() => setDeletingDeviceId(device.id)}
                        className="p-1 rounded-md border border-transparent hover:border-slate-900 hover:bg-rose-50 text-slate-700 hover:text-rose-900 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADD MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2a3a]/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
              <h3 className="text-base font-bold font-serif text-slate-900 uppercase tracking-wide">Register Appliance</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit(onAddDeviceSubmit as any)} className="space-y-4 text-left">
              <Input 
                id="name"
                label="Device Name"
                placeholder="e.g. Master Bedroom AC"
                error={errorsAdd.name?.message}
                {...regAdd('name')}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  id="room"
                  label="Room Location"
                  placeholder="e.g. Master Bedroom"
                  error={errorsAdd.roomId?.message}
                  {...regAdd('roomId')}
                />
                <Input 
                  id="type"
                  label="Device Type"
                  placeholder="e.g. HVAC"
                  error={errorsAdd.type?.message}
                  {...regAdd('type')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  id="powerDraw"
                  label="Rated Wattage (Watts)"
                  type="number"
                  placeholder="1500"
                  error={errorsAdd.powerDraw?.message}
                  {...regAdd('powerDraw')}
                />

                 <div className="flex flex-col gap-1.5">
                  <label htmlFor="status" className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    Initial Status
                  </label>
                  <select 
                    id="status"
                    className="w-full bg-white border-2 border-slate-900 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    {...regAdd('status')}
                  >
                    <option value="offline">Off</option>
                    <option value="online">On</option>
                    <option value="offline">Standby</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-slate-900 flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Register Device
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2a3a]/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b-2 border-slate-900 pb-3">
              <h3 className="text-base font-bold font-serif text-slate-900 uppercase tracking-wide">Adjust Appliance</h3>
              <button onClick={() => setEditingDevice(null)} className="text-slate-400 hover:text-slate-900">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit(onEditDeviceSubmit as any)} className="space-y-4 text-left">
              <Input 
                id="name-edit"
                label="Device Name"
                error={errorsEdit.name?.message}
                {...regEdit('name')}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  id="room-edit"
                  label="Room Location"
                  error={errorsEdit.roomId?.message}
                  {...regEdit('roomId')}
                />
                <Input 
                  id="type-edit"
                  label="Device Type"
                  error={errorsEdit.type?.message}
                  {...regEdit('type')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  id="powerDraw-edit"
                  label="Rated Power (W)"
                  type="number"
                  error={errorsEdit.powerDraw?.message}
                  {...regEdit('powerDraw')}
                />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="status-edit" className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    Status
                  </label>
                  <select 
                    id="status-edit"
                    className="w-full bg-white border-2 border-slate-900 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                    {...regEdit('status')}
                  >
                    <option value="offline">Off</option>
                    <option value="online">On</option>
                    <option value="offline">Standby</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-slate-900 flex justify-end gap-2.5">
                <Button type="button" variant="outline" onClick={() => setEditingDevice(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deletingDeviceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2a3a]/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 border-2 border-rose-900 flex items-center justify-center text-rose-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif text-slate-900 uppercase tracking-wide">Deregister Appliance?</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                This action is irreversible. The historical telemetry metrics associated with this appliance will be disconnected.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setDeletingDeviceId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
                Remove Device
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
