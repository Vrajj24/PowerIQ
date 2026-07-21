import os
import glob

def fix_files():
    base_dir = r"e:\PowerIQ\frontend\src"
    
    replacements = [
        ("currentConsumption", "powerDraw"),
        ("ratedPower", "powerDraw"),
        ("device.room", "device.roomId"),
        ("d.room", "d.roomId"),
        ("room:", "roomId:"),
        ('roomId: z.string().min(1, \'Room is required\')', 'roomId: z.string().min(1, \'Room is required\')'), # Ensure no double replace
        ('roomIdId', 'roomId'),
        ("'on'", "'online'"),
        ('"on"', '"online"'),
        ("'off'", "'offline'"),
        ('"off"', '"offline"'),
        ("'standby'", "'offline'"),
        ('"standby"', '"offline"'),
        ("summary.todayUsage", "summary.dailyUsage"),
        ("alert.title", "alert.message"),
        ("totalDevices", "totalDevices"),
    ]
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts"):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original = content
                for old, new in replacements:
                    content = content.replace(old, new)
                    
                if content != original:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated {path}")

fix_files()
