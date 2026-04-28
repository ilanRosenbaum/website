import fitz  # pip install pymupdf
import math

input_path = "./../public/content/blog/AIInequalityAndUs.pdf"
output_path = "./../public/content/blog/AIInequalityAndUsSplit.pdf"

# US Letter: 612 x 792 points (8.5 x 11 inches)
PAGE_W = 612
PAGE_H = 792
MARGIN_H = 30    # left/right margin (points)
MARGIN_V = 35   # top/bottom margin (points)
BG_COLOR = (30/255, 30/255, 30/255)  # #1e1e1e
BG_THRESHOLD = 10  # pixel tolerance for detecting background vs content

src = fitz.open(input_path)
page = src[0]

# Auto-detect content bounds by rendering at high DPI for accurate gap detection
SCAN_DPI = 300
pix = page.get_pixmap(dpi=SCAN_DPI)
bg_r, bg_g, bg_b = 0x1e, 0x1e, 0x1e
w, h = pix.width, pix.height
samples = pix.samples  # raw pixel bytes
n_channels = pix.n
print(f"Rendered at {SCAN_DPI} DPI: {w}x{h} pixels, {n_channels} channels")

def is_bg(r, g, b):
    return abs(r - bg_r) <= BG_THRESHOLD and abs(g - bg_g) <= BG_THRESHOLD and abs(b - bg_b) <= BG_THRESHOLD

# Step 1: Find leftmost and rightmost columns with non-background pixels
left_col = 0
for x in range(w):
    found = False
    for y in range(h):
        idx = (y * w + x) * n_channels
        r, g, b = samples[idx], samples[idx+1], samples[idx+2]
        if not is_bg(r, g, b):
            found = True
            break
    if found:
        left_col = x
        break

right_col = w - 1
for x in range(w - 1, -1, -1):
    found = False
    for y in range(h):
        idx = (y * w + x) * n_channels
        r, g, b = samples[idx], samples[idx+1], samples[idx+2]
        if not is_bg(r, g, b):
            found = True
            break
    if found:
        right_col = x
        break

print(f"Content columns: {left_col} to {right_col} ({right_col - left_col + 1} px wide)")

# Step 2: Precompute per-row bg ratio ONLY within the middle 50% of content columns
# (the left/right hex borders are continuous and would prevent gap detection)
content_col_width = right_col - left_col + 1
scan_left = left_col + content_col_width // 4
scan_right = right_col - content_col_width // 4
print(f"Gap scan columns: {scan_left} to {scan_right} (middle {scan_right - scan_left + 1} px of {content_col_width} px)")

row_bg_ratio = []
for y in range(h):
    bg_count = 0
    total = 0
    for x in range(scan_left, scan_right + 1):
        idx = (y * w + x) * n_channels
        r, g, b = samples[idx], samples[idx+1], samples[idx+2]
        if is_bg(r, g, b):
            bg_count += 1
        total += 1
    row_bg_ratio.append(bg_count / total if total > 0 else 1.0)

# Debug: show distribution of bg ratios
import collections
buckets = collections.Counter()
for ratio in row_bg_ratio:
    bucket = round(ratio, 2)
    buckets[bucket] += 1
print("Row bg ratio distribution (top values):")
for bucket, count in sorted(buckets.items(), key=lambda x: -x[1])[:10]:
    print(f"  {bucket:.2f}: {count} rows")

# Convert pixel columns back to PDF points
px_scale = page.rect.width / w
py_scale = page.rect.height / h
crop_left = left_col * px_scale
crop_right = (right_col + 1) * px_scale
content_w = crop_right - crop_left
content_h = page.rect.height
print(f"Detected content from x={crop_left:.1f} to x={crop_right:.1f} (width {content_w:.1f}pt, cropped from {page.rect.width:.1f}pt)")

# Find all horizontal rows that are mostly background (good split candidates)
ROW_BG_THRESHOLD = 0.98  # fraction of content-column pixels that must be BG to count as a gap

def is_row_gap(y):
    """Return True if the row y is almost entirely background."""
    return row_bg_ratio[y] >= ROW_BG_THRESHOLD

def find_best_gap(center_y, window):
    """Find a run of consecutive gap rows nearest to center_y, return the middle of that run."""
    search_start = max(0, center_y - window)
    search_end = min(h - 1, center_y + window)

    # Search outward from center for a gap row, then extend to find the full gap run
    for offset in range(0, window + 1):
        for candidate in [center_y - offset, center_y + offset]:
            if candidate < search_start or candidate > search_end:
                continue
            if is_row_gap(candidate):
                # Found a gap row — extend to find the full run
                run_start = candidate
                while run_start > 0 and is_row_gap(run_start - 1):
                    run_start -= 1
                run_end = candidate
                while run_end < h - 1 and is_row_gap(run_end + 1):
                    run_end += 1
                # Split at the middle of the gap for best visual result
                return (run_start + run_end) // 2, True
    return center_y, False

# Available area on each letter page
avail_w = PAGE_W - 2 * MARGIN_H
avail_h = PAGE_H - 2 * MARGIN_V

# Scale factor: how source content maps to page
render_scale = avail_w / content_w

# How much source height fits on one page (in source coordinates)
source_per_page = avail_h / render_scale

# Build smart split points by snapping to background rows
# Search within a window around the ideal split point for a background gap
SNAP_WINDOW = 200 # pixels above/below ideal split to search for a gap

split_points_px = [0]  # start of first page in pixel coords
ideal_y = 0.0

while True:
    ideal_y += source_per_page / py_scale  # ideal next split in pixel coords
    if ideal_y >= h - 10:
        break

    best_y, found_gap = find_best_gap(int(round(ideal_y)), SNAP_WINDOW)

    # Debug: show bg ratios near this split point
    center = int(round(ideal_y))
    nearby = row_bg_ratio[max(0,center-5):min(h,center+6)]
    max_ratio = max(row_bg_ratio[max(0,center-SNAP_WINDOW):min(h,center+SNAP_WINDOW+1)])
    print(f"  Split {len(split_points_px)}: ideal={center}, best={best_y}, found_gap={found_gap}, "
          f"max_ratio_in_window={max_ratio:.4f}, ratios_near_ideal={[f'{r:.3f}' for r in nearby]}")

    if not found_gap:
        print(f"  Warning: no clean gap found near pixel row {int(ideal_y)}, splitting at nearest row")

    split_points_px.append(best_y)

split_points_px.append(h)  # end of last page

# Convert split points from pixels to source PDF points
split_points_pt = [y * py_scale for y in split_points_px]

num_pages = len(split_points_pt) - 1
print(f"Scale: {render_scale:.3f}, pages: {num_pages}, split rows (px): {split_points_px}")

dst = fitz.open()

for i in range(num_pages):
    y_start = split_points_pt[i]
    y_end = split_points_pt[i + 1]
    slice_h = y_end - y_start
    dest_h = slice_h * render_scale  # actual rendered height on this page

    clip = fitz.Rect(crop_left, y_start, crop_right, y_end)
    new_page = dst.new_page(width=PAGE_W, height=PAGE_H)
    new_page.draw_rect(new_page.rect, color=None, fill=BG_COLOR)
    dest_rect = fitz.Rect(MARGIN_H, MARGIN_V, MARGIN_H + avail_w, MARGIN_V + dest_h)
    new_page.show_pdf_page(dest_rect, src, 0, clip=clip)

dst.save(output_path)
dst.close()
src.close()
print(f"Saved PDF to {output_path}")