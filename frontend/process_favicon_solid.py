from PIL import Image

def process_favicon(input_path, favicon_out):
    img = Image.open(input_path).convert("RGBA")
    
    # We want a white background for the favicon, not transparent
    # Let's crop the original image which already has a white background,
    # or just find the bounding box of the shield and pad with white.
    
    # Find bounding box of non-white (or non-transparent) pixels
    bbox_img = img.convert("L")
    bg = Image.new("L", bbox_img.size, 255)
    diff = Image.composite(bbox_img, bg, bbox_img)
    
    data = img.getdata()
    # Mask to find bounding box: anything that is not close to white (brightness > 240)
    mask = [255 if ((item[0] + item[1] + item[2]) / 3) < 240 else 0 for item in data]
    mask_img = Image.new("L", img.size)
    mask_img.putdata(mask)
    bbox = mask_img.getbbox()
    
    if bbox:
        img = img.crop(bbox)
        
    w, h = img.size
    side = max(w, h) + 20
    # Create white background
    fav = Image.new('RGB', (side, side), (255, 255, 255))
    x = (side - w) // 2
    y = (side - h) // 2
    fav.paste(img, (x, y), img) # use img as mask if it has alpha, else it just pastes
    fav.save(favicon_out)
    print("Saved solid white favicon to", favicon_out)

input_file = r"C:\Users\vraj soni\.gemini\antigravity-ide\brain\a1d427ae-b314-4c07-96f9-9220f8d0d34c\media__1783678951607.png"
process_favicon(input_file, 'src/assets/favicon.png')
