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

"""
remove_yaml_frontmatter.py - Removes YAML frontmatter blocks from Markdown files.

This script removes YAML frontmatter blocks (content between --- markers)
from Markdown files. It can be used to clean up Obsidian notes before using them
in other contexts.

Usage:
    python remove_yaml_frontmatter.py <markdown_file>
"""

import re
import sys
import os


def remove_yaml_frontmatter(md_content):
    """
    Remove YAML frontmatter blocks (enclosed between --- markers) from the Markdown content.

    Args:
        md_content (str): The markdown content possibly containing YAML frontmatter.

    Returns:
        str: The markdown content with YAML frontmatter removed.
    """
    # Pattern to match YAML blocks enclosed between --- markers at the start of the file
    yaml_pattern = re.compile(r"^\s*---\s*\n([\s\S]*?)\n---\s*\n", re.MULTILINE)

    # Remove the YAML block
    return yaml_pattern.sub("", md_content)


def main():
    # Check arguments
    if len(sys.argv) < 2:
        print("Usage: python remove_yaml_frontmatter.py <markdown_file>")
        sys.exit(1)

    md_file = sys.argv[1]

    # Check if file exists
    if not os.path.isfile(md_file):
        print(f"Error: The file '{md_file}' does not exist.")
        sys.exit(1)

    # Read the markdown file
    with open(md_file, "r", encoding="utf-8") as f:
        md_content = f.read()

    # Remove YAML frontmatter
    cleaned_content = remove_yaml_frontmatter(md_content)

    # Write the cleaned content back to the same file
    with open(md_file, "w", encoding="utf-8") as f:
        f.write(cleaned_content)

    print(f"Success! YAML frontmatter removed from: {md_file}")


if __name__ == "__main__":
    main()
