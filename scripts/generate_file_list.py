import os
import sys

def generate_file_list(root_path, prefix_path):
    result = {}
    
    for root, dirs, files in os.walk(root_path):
        relative_path = os.path.relpath(root, root_path)
        if relative_path == '.':
            relative_path = ''
        
        path_key = relative_path.replace(os.path.sep, '_')
        if path_key:
            prefix = os.path.join(prefix_path, relative_path)
        else:
            prefix = prefix_path

        image_files = [
            '"{0}"'.format(os.path.join(prefix, file))
            for file in files
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))
        ]
        
        if image_files:
            result[path_key] = image_files

    return result

def generate_typescript_code(file_dict):
    exports = []
    for key, files in file_dict.items():
        # Capitalize each part of the path
        variable_name = ''.join(part.capitalize() for part in key.split('_') if part)
        variable_name = "photoFiles{0}".format(variable_name)
        
        array_declaration = "export const {0} = [\n  {1}\n];".format(
            variable_name, 
            ',\n  '.join(files)
        )
        exports.append(array_declaration)
    
    return "\n\n".join(exports)

# Check if the correct number of arguments is provided
if len(sys.argv) != 3:
    print("Usage: python script.py <folder-path> <prefix-path>")
    sys.exit(1)

# Get command line arguments
folder_path = sys.argv[1]
prefix_path = sys.argv[2]

# Generate the file list
file_dict = generate_file_list(folder_path, prefix_path)

# Generate and print the TypeScript code
typescript_code = generate_typescript_code(file_dict)
print(typescript_code)
