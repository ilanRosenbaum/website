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

import os
import sys
from PIL import Image
from PIL.ExifTags import TAGS
from datetime import datetime


def get_content_creation_time(file_path):
    """Get the content creation time of a file."""
    try:
        image = Image.open(file_path)
        exif = image._getexif()
        if exif:
            for tag_id, value in exif.items():
                tag = TAGS.get(tag_id, tag_id)
                if tag == "DateTimeOriginal":
                    return datetime.strptime(value, "%Y:%m:%d %H:%M:%S")
    except Exception:
        pass

    # If EXIF data is not available, try to parse from filename
    try:
        filename = os.path.basename(file_path)
        date_part = filename.split("_")[0]
        return datetime.strptime(date_part, "%Y%m%d")
    except Exception:
        pass

    # As a last resort, use file modification time
    return datetime.fromtimestamp(os.path.getmtime(file_path))


def generate_file_list(root_path, prefix_path, reverse=False):
    result = {}

    for root, dirs, files in os.walk(root_path):
        relative_path = os.path.relpath(root, root_path)
        if relative_path == ".":
            relative_path = ""

        path_key = relative_path.replace(os.path.sep, "_")
        if path_key:
            prefix = os.path.join(prefix_path, relative_path)
        else:
            prefix = prefix_path

        image_files = [
            file
            for file in files
            if file.lower().endswith((".jpg", ".jpeg", ".png", ".gif", ".webp"))
        ]

        if image_files:
            image_files.sort(
                key=lambda x: get_content_creation_time(os.path.join(root, x)),
                reverse=reverse,
            )

            result[path_key] = [
                '"{0}"'.format(os.path.join(prefix, file)) for file in image_files
            ]

    return result


def generate_typescript_code(file_dict):
    exports = []
    for key, files in file_dict.items():
        variable_name = "".join(part.capitalize() for part in key.split("_") if part)
        variable_name = "photoFiles{0}".format(variable_name)

        array_declaration = "export const {0} = [\n  {1}\n];".format(
            variable_name, ",\n  ".join(files)
        )
        exports.append(array_declaration)

    return "\n\n".join(exports)


# Check if the correct number of arguments is provided
if len(sys.argv) != 3 and len(sys.argv) != 4:
    print("Usage: python script.py <folder-path> <prefix-path> [reverse]")
    sys.exit(1)

# Get command line arguments
folder_path = sys.argv[1]
prefix_path = sys.argv[2]
reverse = len(sys.argv) == 4 and sys.argv[3].lower() == "true"

# Generate the file list
file_dict = generate_file_list(folder_path, prefix_path, reverse)

# Generate and print the TypeScript code
typescript_code = generate_typescript_code(file_dict)
print(typescript_code)
