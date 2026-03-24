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
copy_glazes.py - Copies glaze files from the Obsidian vault into the website's
public directory, rewriting Obsidian-style links and embedding references
to be web-compatible, and copying only the images that are actually referenced.

Usage:
    python copy_glazes.py <notes_location>

Transformations applied to every .md file in <notes_location>/Glazes/:
  - YAML frontmatter (--- ... ---) is stripped
  - ![[image.ext]]  →  ![image](/glazeAssets/image.ext)
  - [[Note]]        →  [Note](/trades/ceramics/glazes/Note)   (URL-encoded)
  - [[Note|Alias]]  →  [Alias](/trades/ceramics/glazes/Note)  (URL-encoded)
  - %xx-encoded image filenames are decoded before the copy attempt
Only images that are actually referenced are copied from
<notes_location>/Assets/ → public/glazeAssets/.
"""

import os
import re
import sys
import shutil
from pathlib import Path
from urllib.parse import quote, unquote

GLAZE_ROUTE_BASE = "/trades/ceramics/glazes"
OUTPUT_MD_DIR = "public/content/glazes"
OUTPUT_ASSETS_DIR = "public/glazeAssets"


def remove_frontmatter(content: str) -> str:
    """Strip YAML frontmatter enclosed in --- markers."""
    return re.sub(r"^\s*---\s*\n[\s\S]*?\n---\s*\n", "", content, count=1)


def transform_content(content: str) -> tuple[str, set[str]]:
    """
    Transform Obsidian-flavoured markdown to web-compatible markdown.
    Returns (transformed_content, set_of_referenced_image_filenames).
    """
    referenced_images: set[str] = set()

    # 1. Image embeds: ![[filename.ext]] or ![[filename.ext|width]] or
    #    ![[filename.ext\|width]] (Obsidian table-escaped form)
    #    → <img src="/glazeAssets/filename.ext" width="NNN" />
    #    (rehypeRaw is enabled in MarkdownPage so HTML renders fine)
    def replace_image(m: re.Match) -> str:
        file_part = m.group(1).strip()
        width_part = (m.group(2) or "").strip()
        # Obsidian may include a sub-path; keep basename only
        basename = Path(file_part).name
        referenced_images.add(basename)
        src = f"/glazeAssets/{quote(basename)}"
        if width_part and width_part.isdigit():
            return f'<img src="{src}" width="{width_part}" />'
        return f'<img src="{src}" />'

    # Capture filename and optional \|NNN or |NNN width hint separately
    content = re.sub(r"!\[\[([^\]|\\]+(?:\.[^\]|\\]+)?)(?:\\?\|(\d+))?\]\]", replace_image, content)

    # 2. Wiki links with alias: [[Note|Alias]] → [Alias](/trades/ceramics/glazes/Note)
    def replace_aliased_link(m: re.Match) -> str:
        note = m.group(1).strip()
        alias = m.group(2).strip()
        # Strip .md extension if present
        note = re.sub(r"\.md$", "", note, flags=re.IGNORECASE)
        return f"[{alias}]({GLAZE_ROUTE_BASE}/{quote(note)})"

    content = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", replace_aliased_link, content)

    # 3. Plain wiki links: [[Note]] → [Note](/trades/ceramics/glazes/Note)
    def replace_plain_link(m: re.Match) -> str:
        note = m.group(1).strip()
        note = re.sub(r"\.md$", "", note, flags=re.IGNORECASE)
        return f"[{note}]({GLAZE_ROUTE_BASE}/{quote(note)})"

    content = re.sub(r"\[\[([^\]]+)\]\]", replace_plain_link, content)

    return content, referenced_images


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: python copy_glazes.py <notes_location>")
        sys.exit(1)

    notes_location = sys.argv[1]
    glazes_dir = Path(notes_location) / "Glazes"
    assets_dir = Path(notes_location) / "Assets"

    if not glazes_dir.is_dir():
        print(f"Error: Glazes directory not found: {glazes_dir}")
        sys.exit(1)

    Path(OUTPUT_MD_DIR).mkdir(parents=True, exist_ok=True)
    Path(OUTPUT_ASSETS_DIR).mkdir(parents=True, exist_ok=True)

    all_referenced_images: set[str] = set()

    for md_file in sorted(glazes_dir.glob("*.md")):
        content = md_file.read_text(encoding="utf-8")
        content = remove_frontmatter(content)
        content, refs = transform_content(content)
        all_referenced_images |= refs

        is_spreadsheet = md_file.stem.lower() == "spreadsheet"

        if not is_spreadsheet:
            # Prepend the filename stem as a page title
            content = f"# {md_file.stem}\n\n{content}"
            # Markdown collapses single newlines into spaces.
            # Append two trailing spaces to any non-empty line that is immediately
            # followed by another non-empty line — this produces a <br> without
            # creating a new paragraph, preserving the original grouping.
            lines = content.split("\n")
            result = []
            for i, line in enumerate(lines):
                if line.strip() and i + 1 < len(lines) and lines[i + 1].strip():
                    result.append(line.rstrip() + "  ")
                else:
                    result.append(line)
            content = "\n".join(result)

        out_path = Path(OUTPUT_MD_DIR) / md_file.name
        out_path.write_text(content, encoding="utf-8")
        print(f"  copied md: {md_file.name}")

    # Copy only the images that are referenced
    missing: list[str] = []
    for img in sorted(all_referenced_images):
        decoded_img = unquote(img)
        src = assets_dir / decoded_img
        dst = Path(OUTPUT_ASSETS_DIR) / decoded_img
        if src.exists():
            shutil.copy2(src, dst)
            print(f"  copied image: {decoded_img}")
        else:
            missing.append(decoded_img)

    if missing:
        print("\nWarning – the following referenced images were not found in Assets/:")
        for m in missing:
            print(f"  {m}")


if __name__ == "__main__":
    main()
