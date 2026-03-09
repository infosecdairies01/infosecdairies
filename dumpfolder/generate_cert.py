"""
Generate test certificate for Y.LOKESH
Course: Blue Team & SOC Fundamentals
Date: 9th March 2026
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Config
TEMPLATE_PATH = "certs/template11.jpg"
OUTPUT_PATH = "dumpfolder/certificate_Y_LOKESH.png"
STUDENT_NAME = "Y.LOKESH"
COURSE_TITLE = "Blue Team & SOC Fundamentals"
ISSUE_DATE = "9th March 2026"

# Load template
template = Image.open(TEMPLATE_PATH)
width, height = template.size

# Create drawing context
draw = ImageDraw.Draw(template)

# Try to load fonts (fallback to default if not available)
try:
    # Try to use Montserrat and Playfair Display if available
    font_course = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", int(height * 0.045))
    font_name = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", int(height * 0.075))
    font_date = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", int(height * 0.028))
except:
    font_course = ImageFont.load_default()
    font_name = ImageFont.load_default()
    font_date = ImageFont.load_default()

# Colors (matching the frontend)
COLOR_GREEN = (97, 255, 120)  # #61FF78
COLOR_WHITE = (255, 255, 255)
COLOR_WHITE_90 = (255, 255, 255)

# Positions (matching frontend ratios)
x_left = int(width * 0.075)

# Draw course title (green, near top-left)
bbox = draw.textbbox((0, 0), COURSE_TITLE, font=font_course)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

# Simple text wrapping for course title
max_width = int(width * 0.55)
words = COURSE_TITLE.split()
lines = []
current_line = ""
for word in words:
    test_line = current_line + " " + word if current_line else word
    bbox = draw.textbbox((0, 0), test_line, font=font_course)
    if bbox[2] - bbox[0] <= max_width:
        current_line = test_line
    else:
        if current_line:
            lines.append(current_line)
        current_line = word
if current_line:
    lines.append(current_line)

# Draw course title lines
line_height = int(height * 0.055)
y_pos = int(height * 0.22)
for line in lines:
    draw.text((x_left, y_pos), line, fill=COLOR_GREEN, font=font_course)
    y_pos += line_height

# Draw student name (big, white)
bbox = draw.textbbox((0, 0), STUDENT_NAME, font=font_name)
text_width = bbox[2] - bbox[0]
# Wrap name if too long
max_name_width = int(width * 0.55)
if text_width > max_name_width:
    # Split name if too long
    name_parts = STUDENT_NAME.split()
    if len(name_parts) > 1:
        line1 = " ".join(name_parts[:len(name_parts)//2])
        line2 = " ".join(name_parts[len(name_parts)//2:])
        y_name = int(height * 0.395)
        draw.text((x_left, y_name), line1, fill=COLOR_WHITE, font=font_name)
        draw.text((x_left, y_name + int(height * 0.085)), line2, fill=COLOR_WHITE, font=font_name)
    else:
        draw.text((x_left, int(height * 0.395)), STUDENT_NAME, fill=COLOR_WHITE, font=font_name)
else:
    draw.text((x_left, int(height * 0.395)), STUDENT_NAME, fill=COLOR_WHITE, font=font_name)

# Draw issue date
draw.text((x_left, int(height * 0.835)), ISSUE_DATE, fill=COLOR_WHITE_90, font=font_date)

# Save
template.save(OUTPUT_PATH)
print(f"✅ Certificate saved to: {OUTPUT_PATH}")
print(f"   Name: {STUDENT_NAME}")
print(f"   Course: {COURSE_TITLE}")
print(f"   Date: {ISSUE_DATE}")
