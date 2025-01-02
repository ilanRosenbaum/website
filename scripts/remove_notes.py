import re
import sys
import json

def remove_notes_column_from_codeblock(codeblock_content):
    """
    1) Removes 'Notes' from the headers array.
    2) Extracts the 'data' array, drops the last column from each row,
       and reinserts the updated array.
    """
    # 1) Remove "Notes" from the headers array.
    codeblock_content = re.sub(r'"Notes",?\s?', '', codeblock_content)

    # 2) Extract data array with a capturing group:  const data = [ ... ];
    data_pattern = r'const\s+data\s*=\s*(\[[\s\S]*?\]);'
    data_match = re.search(data_pattern, codeblock_content)

    if not data_match:
        # Could not find the data array; return unmodified content
        return codeblock_content

    data_string = data_match.group(1)  # The bracketed array text

    # Convert the array text to a Python object.
    # Warning: using eval can be unsafe if you don't trust the source!
    try:
        data_array = eval(data_string)
    except Exception as e:
        print("Error parsing data array with eval():", e)
        return codeblock_content

    # 3) Drop the last element (notes) from each row
    new_data = [row[:3] for row in data_array]

    # 4) Convert updated data array back to a string (in JSON format for simplicity)
    new_data_string = json.dumps(new_data, indent=2)

    # 5) Replace the old data array in the code block
    new_codeblock_content = re.sub(
        data_pattern,
        f'const data = {new_data_string};',
        codeblock_content
    )

    return new_codeblock_content

def remove_notes_column_in_md(md_content):
    """
    Finds the ```dataviewjs code block in the markdown,
    removes the 'Notes' column and the associated data,
    and returns updated markdown content.
    """
    # Regex to capture the code block including the triple backticks
    # with `dataviewjs`
    pattern = (
        r'```dataviewjs\s*([\s\S]*?)```'
    )

    def replacer(match):
        # match.group(1) is the content inside ```dataviewjs ... ```
        codeblock_content = match.group(1)
        updated_codeblock_content = remove_notes_column_from_codeblock(codeblock_content)
        return f'```dataviewjs\n{updated_codeblock_content}\n```'

    # Replace the code block content using our replacer function
    updated_md_content = re.sub(pattern, replacer, md_content)
    return updated_md_content

def main():
    # Usage: python remove_notes_in_place.py <your_markdown_file.md>
    if len(sys.argv) < 2:
        print("Usage: python remove_notes_in_place.py <markdown_file>")
        sys.exit(1)

    md_file = sys.argv[1]

    # 1. Read the markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # 2. Remove the Notes column inside the code block
    updated_md_content = remove_notes_column_in_md(md_content)

    # 3. Write the updated content back to the SAME file (in-place)
    with open(md_file, 'w', encoding='utf-8') as f:
        f.write(updated_md_content)

    print(f"Success! Notes column removed in: {md_file}")

if __name__ == "__main__":
    main()
