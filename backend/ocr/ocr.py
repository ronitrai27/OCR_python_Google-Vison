import cv2
import pytesseract
from pytesseract import Output
from PIL import Image
import re

# Configure tesseract executable path (required if not in PATH)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe'

# Function to preprocess the image
def preprocess_image(image_path):
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Applying a threshold to get a binary image
    _, binary_img = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    return binary_img

# Function to extract text using pytesseract
def extract_text(image):
    text = pytesseract.image_to_string(image, output_type=Output.STRING)
    return text

# Function to extract information from the text
def extract_information(text):
    information = {}

    # Regex patterns for extracting specific information
    information['Name of the Supplier'] = re.findall(r'Supplier Name[:\s]*(.*)', text)
    information['Address'] = re.findall(r'Address[:\s]*(.*)', text)
    information['GST No'] = re.findall(r'GSTIN[:\s]*(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1})', text)
    information['Particulars'] = re.findall(r'Product Name[:\s]*(.*)', text)
    information['Quantity'] = re.findall(r'Quantity[:\s]*(\d+)', text)
    information['GST Rate'] = re.findall(r'Rate[:\s]*₹?([\d,]+\.\d{2})', text)
    information['Amount'] = re.findall(r'Amount[:\s]*₹?([\d,]+\.\d{2})', text)
    information['Taxable Value'] = re.findall(r'Taxable Value[:\s]*₹?([\d,]+\.\d{2})', text)
    information['GST'] = re.findall(r'GST[:\s]*₹?([\d,]+\.\d{2})', text)

    return information

# Path to the image file
image_path = 'image2.jpg'

# Preprocess the image
processed_image = preprocess_image(image_path)

# Extract text from the image
extracted_text = extract_text(processed_image)

# Extract information from the text
bill_information = extract_information(extracted_text)

# Display the extracted information
for key, value in bill_information.items():
    print(f"{key}: {value[0] if value else 'Not Found'}")
