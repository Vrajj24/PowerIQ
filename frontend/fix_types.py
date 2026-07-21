import os

def fix_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

devices_replacements = [
    ("room: z.string().min(1, 'Room is required')", "roomId: z.string().min(1, 'Room is required')"),
    ("ratedPower: z.coerce.number().int().positive('Rated power must be a positive number')", "powerDraw: z.coerce.number().positive('Power draw must be positive')"),
    ("z.enum(['on', 'off', 'standby'])", "z.enum(['online', 'offline'])"),
    ("room: ''", "roomId: 'living-room'"),
    ("ratedPower: 100", "powerDraw: 0"),
    ("status: 'off'", "status: 'offline'"),
    ("room: device.room", "roomId: device.roomId"),
    ("ratedPower: device.ratedPower", "powerDraw: device.powerDraw"),
    ("device.room", "device.roomId"),
    ("d.room", "d.roomId"),
    ("device.ratedPower", "device.powerDraw"),
    ("device.currentConsumption", "device.powerDraw"),
    ("d.currentConsumption", "d.powerDraw"),
    ("status: 'on'", "status: 'online'"),
    ("d.status === 'on'", "d.status === 'online'"),
    ("=== 'on'", "=== 'online'"),
    ("=== 'off'", "=== 'offline'"),
    ("? 'on' : 'off'", "? 'online' : 'offline'"),
    ("d.status === 'standby'", "false")
]

fix_file(r'e:\PowerIQ\frontend\src\pages\Devices.tsx', devices_replacements)

dashboard_replacements = [
    ("d.status === 'on'", "d.status === 'online'"),
    ("d.currentConsumption", "d.powerDraw"),
    ("d.room", "d.roomId"),
    ("device.room", "device.roomId"),
    ("d.ratedPower", "d.powerDraw"),
    ("todayUsage: summary.todayUsage,", "dailyUsage: summary.dailyUsage,"),
    ("summary.todayUsage", "summary.dailyUsage"),
]

fix_file(r'e:\PowerIQ\frontend\src\pages\Dashboard.tsx', dashboard_replacements)
fix_file(r'e:\PowerIQ\frontend\src\layouts\DashboardLayout.tsx', dashboard_replacements)
fix_file(r'e:\PowerIQ\frontend\src\pages\Login.tsx', dashboard_replacements)

print("Replaced successfully")
