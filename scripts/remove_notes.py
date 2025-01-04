import re
import sys

def process_table_line(line):
    """
    Process a single table line, removing the Notes column.
    """
    # Split the line by pipes, strip whitespace
    columns = [col.strip() for col in line.split('|')]
    
    # Remove empty strings from start/end if present
    if not columns[0]:
        columns = columns[1:]
    if not columns[-1]:
        columns = columns[:-1]
        
    # Remove the last column (Notes)
    columns = columns[:-1]
    
    # Rebuild the line with proper spacing
    return '| ' + ' | '.join(columns) + ' |'

def remove_notes_column_from_md_table(md_content):
    """
    Removes the 'Notes' column from a markdown table while preserving non-table content.
    """
    lines = md_content.split('\n')
    in_table = False
    updated_lines = []
    
    for line in lines:
        stripped_line = line.strip()
        
        # Check if we're entering a table
        if stripped_line.startswith('|') and not in_table:
            in_table = True
            updated_lines.append(process_table_line(line))
            continue
            
        # Check if we're exiting a table
        if in_table and not stripped_line.startswith('|'):
            in_table = False
            updated_lines.append(line)
            continue
            
        # Process table lines
        if in_table:
            updated_lines.append(process_table_line(line))
        else:
            # Keep non-table lines unchanged
            updated_lines.append(line)
    
    return '\n'.join(updated_lines)

def main():
    # Usage: python remove_notes_in_place.py <your_markdown_file.md>
    if len(sys.argv) < 2:
        print("Usage: python remove_notes_in_place.py <markdown_file>")
        sys.exit(1)

    md_file = sys.argv[1]

    # 1. Read the markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # 2. Remove the Notes column
    updated_md_content = remove_notes_column_from_md_table(md_content)

    # 3. Write the updated content back to the SAME file (in-place)
    with open(md_file, 'w', encoding='utf-8') as f:
        f.write(updated_md_content)

    print(f"Success! Notes column removed in: {md_file}")

if __name__ == "__main__":
    main()