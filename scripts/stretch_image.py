# Ilan's Website
# Copyright (C) 2024-2026 ILAN ROSENBAUM
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.

from PIL import Image
import sys
import os
import math


def stretch_image(input_path, stretch_direction):
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Get original dimensions
            width, height = img.size

            # Calculate stretch factors
            if stretch_direction == 0:  # Horizontal
                horizontal_stretch = 1
                vertical_stretch = math.sqrt(3) / 2
                stretch_type = "Horizontal"
            else:  # Vertical
                horizontal_stretch = math.sqrt(3) / 2
                vertical_stretch = 1
                stretch_type = "Vertical"

            # Calculate new dimensions
            new_width = int(width * horizontal_stretch)
            new_height = int(height * vertical_stretch)

            # Resize the image
            resized_img = img.resize((new_width, new_height), Image.LANCZOS)

            # Generate output path
            file_name, file_extension = os.path.splitext(input_path)
            output_path = f"{file_name}{stretch_type}{file_extension}"

            # Save the resized image
            resized_img.save(output_path)

        print(f"Image successfully stretched and saved to {output_path}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python script.py <input_path> <stretch_direction>")
        print("stretch_direction: 0 for horizontal, 1 for vertical")
        sys.exit(1)

    input_path = sys.argv[1]
    stretch_direction = int(sys.argv[2])

    if stretch_direction not in [0, 1]:
        print("Invalid stretch direction. Use 0 for horizontal or 1 for vertical.")
        sys.exit(1)

    stretch_image(input_path, stretch_direction)
