from PIL import Image
import sys

def stretch_image(input_path, output_path, horizontal_stretch, vertical_stretch):
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Get original dimensions
            width, height = img.size
            
            # Calculate new dimensions
            new_width = int(width * horizontal_stretch)
            new_height = int(height * vertical_stretch)
            
            # Resize the image
            resized_img = img.resize((new_width, new_height), Image.LANCZOS)
            
            # Save the resized image
            resized_img.save(output_path)
            
        print(f"Image successfully stretched and saved to {output_path}")
    
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python script.py <input_path> <output_path> <horizontal_stretch> <vertical_stretch>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    horizontal_stretch = float(sys.argv[3])
    vertical_stretch = float(sys.argv[4])
    
    stretch_image(input_path, output_path, horizontal_stretch, vertical_stretch)