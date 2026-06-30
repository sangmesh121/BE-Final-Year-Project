from PIL import Image, ImageDraw, ImageFont
import os

def create_fake_image():
    # Create a simple yellow background (like Parle-G)
    img = Image.new('RGB', (600, 400), color = (255, 223, 0))
    d = ImageDraw.Draw(img)
    
    # Try to load a font, otherwise use default
    try:
        font = ImageFont.truetype("arial.ttf", 60)
        sub_font = ImageFont.truetype("arial.ttf", 30)
    except:
        font = ImageFont.load_default()
        sub_font = ImageFont.load_default()

    # Draw "Parle-J" text (Red color, simulating the brand)
    d.text((150, 150), "Parle-J", fill=(255, 0, 0), font=font)
    
    # Add "Biscuits" text
    d.text((200, 230), "Gluco Biscuits", fill=(255, 0, 0), font=sub_font)
    
    # Add a fake logo circle
    d.ellipse([50, 50, 120, 120], outline=(255, 0, 0), width=5)
    d.text((65, 75), "P-J", fill=(255, 0, 0), font=sub_font)
    
    output_path = "parle_j_counterfeit.jpg"
    img.save(output_path)
    print(f"Generated {output_path}")

if __name__ == "__main__":
    create_fake_image()
