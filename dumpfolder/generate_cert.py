"""
Generate certificate for RAKESH JIMMIDI
Course: Blue Team & SOC Fundamentals
Date: 5th October 2025
Cert ID: INFOD-SOC-2025-001
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Config for RAKESH JIMMIDI
TEMPLATE_PATH = "certs/live_training_tempjpg.jpeg"
OUTPUT_PATH = "dumpfolder/certificate_RAKESH_JIMMIDI.png"
STUDENT_NAME = "RAKESH JIMMIDI"
ISSUE_DATE = "5th October 2025"
CERT_ID = "INFOD-SOC-2025-001"

# Load template
template = Image.open(TEMPLATE_PATH)
width, height = template.size

draw = ImageDraw.Draw(template)

# Fonts
try:
    font_name    = ImageFont.truetype("C:/Windows/Fonts/timesbd.ttf", int(height * 0.065))
    font_details = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", int(height * 0.022))
except:
    font_name    = ImageFont.load_default()
    font_details = ImageFont.load_default()

COLOR_OLIVE = (193, 200, 135)  # #C1C887 — date & cert-id
COLOR_GREEN = (97, 255, 120)   # green  — student name

# ── 1. STUDENT NAME ──────────────────────────────────────────────────────────
name_y = int(height * 0.265)
bbox   = draw.textbbox((0, 0), STUDENT_NAME, font=font_name)
text_w = bbox[2] - bbox[0]
name_x = (width - text_w) // 2 - int(width * 0.10)  # ← shifted left by 4% of width
draw.text((name_x, name_y), STUDENT_NAME, fill=COLOR_GREEN, font=font_name)

# ── 2. DATE OF ISSUE ─────────────────────────────────────────────────────────
date_x = int(width * 0.150)
date_y = int(height * 0.772)
draw.text((date_x, date_y), ISSUE_DATE, fill=COLOR_OLIVE, font=font_details)

# ── 3. CERTIFICATION ID ───────────────────────────────────────────────────────
cert_x = int(width * 0.350)
cert_y = int(height * 0.772)
draw.text((cert_x, cert_y), CERT_ID, fill=COLOR_OLIVE, font=font_details)

# ── Save ──────────────────────────────────────────────────────────────────────
os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
template.save(OUTPUT_PATH)
print(f"✅ Certificate saved to: {OUTPUT_PATH}")
print(f"   Name:    {STUDENT_NAME}")
print(f"   Date:    {ISSUE_DATE}")
print(f"   Cert ID: {CERT_ID}")