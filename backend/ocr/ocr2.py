from google.cloud import vision
from google.cloud.vision import ImageAnnotatorClient
from google.cloud.vision_v1 import types
import io

def extract_text_from_image(image_path):
    # Create a client for the Vision API
    client = vision.ImageAnnotatorClient()

    # Load the image into memory
    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    # Construct the image object
    image = types.Image(content=content)

    # Perform text detection on the image
    response = client.text_detection(image=image)

    # Extract text from the response
    texts = response.text_annotations
    if texts:
        # The first annotation is the full text
        full_text = texts[0].description
        return full_text
    return "No text found"

# Path to the image file
image_path = 'image.jpg'

# Extract text from the image
text = extract_text_from_image(image_path)

import re

def extract_information(text):
    information = {
        'Name of the Supplier': None,
        'Address': None,
        'GST No': None,
        'Particulars': None,
        'Quantity': None,
        'GST Rate': None,
        'Amount': None,
        'Taxable Value': None,
        'GST': None
    }

    # Example regex patterns (these may need to be adjusted based on your specific text)
    information['Name of the Supplier'] = re.search(r'Supplier Name[:\s]*(.*)', text)
    information['Address'] = re.search(r'Address[:\s]*(.*)', text)
    information['GST No'] = re.search(r'GSTIN[:\s]*(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1})', text)
    information['Particulars'] = re.findall(r'Product Name[:\s]*(.*)', text)
    information['Quantity'] = re.findall(r'Quantity[:\s]*(\d+)', text)
    information['GST Rate'] = re.findall(r'Rate[:\s]*₹?([\d,]+\.\d{2})', text)
    information['Amount'] = re.findall(r'Amount[:\s]*₹?([\d,]+\.\d{2})', text)
    information['Taxable Value'] = re.search(r'Taxable Value[:\s]*₹?([\d,]+\.\d{2})', text)
    information['GST'] = re.search(r'GST[:\s]*₹?([\d,]+\.\d{2})', text)

    return {key: value.group(1) if value else 'Not Found' for key, value in information.items()}

# Extract information from the text
info = extract_information(text)

# Print the extracted information
for key, value in info.items():
    print(f"{key}: {value}")

