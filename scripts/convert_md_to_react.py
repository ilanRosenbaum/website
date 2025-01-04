import re
import os
import sys

def extract_code_blocks(md_content, languages=['jsx', 'javascript']):
    """
    Extract code blocks labeled with specified languages from the Markdown content.
    If no code blocks are found, treat the entire content as React code.
    
    Args:
        md_content (str): The content of the Markdown file.
        languages (list): List of language tags to extract code blocks from.
        
    Returns:
        list: A list of extracted code blocks as strings.
    """
    pattern = re.compile(r'```(?:' + '|'.join(languages) + r')\n([\s\S]*?)```', re.MULTILINE)
    code_blocks = pattern.findall(md_content)
    
    # If no code blocks found, check if content looks like React code
    if not code_blocks and ('return (' in md_content or 'const ' in md_content or 'import ' in md_content):
        # Remove any markdown headers (lines starting with #)
        content_without_headers = re.sub(r'^#.*$', '', md_content, flags=re.MULTILINE)
        return [content_without_headers.strip()]
        
    return code_blocks

def extract_imports(code_blocks):
    """
    Extract import statements from the list of code blocks.
    
    Args:
        code_blocks (list): List of code block strings.
        
    Returns:
        set: A set of unique import statements.
    """
    import_pattern = re.compile(r'^import\s.+(?:\sfrom\s.+)?;?$', re.MULTILINE)
    imports = set()
    for block in code_blocks:
        imports.update(import_pattern.findall(block))
    return imports

def contains_component_definition(code):
    """
    Check if the extracted code contains a React component definition.
    
    Args:
        code (str): The extracted code string.
        
    Returns:
        bool: True if a component definition is found, False otherwise.
    """
    component_patterns = [
        r'const\s+\w+\s*=\s*\(\s*\)\s*=>',
        r'function\s+\w+\s*\(',
        r'class\s+\w+\s+extends\s+React\.Component',
        r'return\s*\(',  # Check for JSX return statement
        r'<div[^>]*>'    # Check for JSX div element
    ]
    for pattern in component_patterns:
        if re.search(pattern, code):
            return True
    return False

def ensure_export_statement(code, component_name):
    """
    Ensure that the code contains an export statement. If not, add one.
    
    Args:
        code (str): The code string.
        component_name (str): The name of the component to export.
        
    Returns:
        str: The code string with an export statement.
    """
    export_pattern = re.compile(r'export\s+default\s+\w+;?')
    if not export_pattern.search(code):
        code += f'\n\nexport default {component_name};\n'
    return code

def wrap_in_component(code, component_name):
    """
    Wrap the extracted code in a React functional component if it's not already a component.
    Handles cases where there's a top-level return statement.
    
    Args:
        code (str): The extracted code string.
        component_name (str): The name of the component.
        
    Returns:
        str: The wrapped component code.
    """
    # If there's a standalone return statement, we need to handle it specially
    if re.search(r'^\s*return\s*\(', code, re.MULTILINE):
        # Find the position of the return statement
        parts = re.split(r'(^\s*return\s*\()', code, maxsplit=1, flags=re.MULTILINE)
        before_return = parts[0]
        return_statement = parts[1] if len(parts) > 1 else ''
        after_return = parts[2] if len(parts) > 2 else ''
        
        component_definition = f"""
const {component_name} = () => {{
{before_return.strip()}
{return_statement}{after_return}
}};

export default {component_name};
        """.strip()
    else:
        component_definition = f"""
const {component_name} = () => {{
{code}
}};

export default {component_name};
        """.strip()
    return component_definition

def get_component_name(file_path):
    """
    Extract and format the component name from the file path.
    
    Args:
        file_path (str): Path to the output component file.
        
    Returns:
        str: Formatted component name in PascalCase.
    """
    # Get the filename without extension
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    
    # Convert kebab-case or snake_case to PascalCase
    words = re.findall(r'[a-zA-Z0-9]+', base_name)
    component_name = ''.join(word.capitalize() for word in words)
    
    return component_name

def main():
    # Check if correct number of arguments is provided
    if len(sys.argv) != 3:
        print("Usage: python script.py <input_markdown_file> <output_component_file>")
        print("Example: python convert_md_to_react.py ./content/Post.md ./components/Post.tsx")
        sys.exit(1)

    # Get file paths from command line arguments
    md_file_path = sys.argv[1]
    output_component_path = sys.argv[2]

    # Generate component name from output file path
    component_name = get_component_name(output_component_path)

    # Check if MD file exists
    if not os.path.isfile(md_file_path):
        print(f"Error: The file '{md_file_path}' does not exist.")
        sys.exit(1)

    # Read the MD file
    with open(md_file_path, 'r', encoding='utf-8') as file:
        md_content = file.read()

    # Extract code blocks or treat entire content as React code
    code_blocks = extract_code_blocks(md_content)
    if not code_blocks:
        print("No React code found in the file.")
        sys.exit(1)

    # Extract import statements
    imports = extract_imports(code_blocks)

    # Combine all code blocks into a single string
    combined_code = '\n\n'.join(code_blocks)

    # Check if the code needs to be wrapped in a component
    needs_wrapping = not contains_component_definition(combined_code) or re.search(r'^\s*return\s*\(', combined_code, re.MULTILINE)
    
    if needs_wrapping:
        # Wrap the code in a React functional component
        combined_code = wrap_in_component(combined_code, component_name)
    else:
        # Ensure there's an export statement
        combined_code = ensure_export_statement(combined_code, component_name)

    # Prepare the final component code
    final_component = ''

    # Add imports
    if imports:
        final_component += '\n'.join(sorted(imports)) + '\n\n'
    else:
        # Add default React import if no imports are found
        final_component += "import React from 'react';\n\n"

    # Add the combined code
    final_component += combined_code

    # Create output directory if it doesn't exist
    os.makedirs(os.path.dirname(output_component_path), exist_ok=True)

    # Write to the output React component file
    with open(output_component_path, 'w', encoding='utf-8') as output_file:
        output_file.write(final_component)

    print(f"React component '{component_name}' successfully created at '{output_component_path}'.")

if __name__ == "__main__":
    main()