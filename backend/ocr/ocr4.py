import requests
import base64
import json
import re

def extract_text_from_image(api_key, image_path):
    # Read image file and encode it to base64
    with open(image_path, 'rb') as image_file:
        base64_image = base64.b64encode(image_file.read()).decode('utf-8')

    # Prepare the request payload
    payload = {
        "requests": [
            {
                "image": {
                    "content": base64_image
                },
                "features": [
                    {
                        "type": "TEXT_DETECTION"
                    }
                ]
            }
        ]
    }

    # Send the request to Google Vision API
    url = f'https://vision.googleapis.com/v1/images:annotate?key={api_key}'
    response = requests.post(url, headers={'Content-Type': 'application/json'}, data=json.dumps(payload))

    # Print the full response for debugging
    response_json = response.json()
    print(json.dumps(response_json, indent=2))

    # Handle response
    try:
        text_annotations = response_json.get('responses', [])[0].get('textAnnotations', [])
        text = text_annotations[0].get('description', '')  # All text in the image
    except (IndexError, KeyError):
        print("Error: Unexpected response format or no text annotations found.")
        text = ''

    return text

def format_extracted_text(text):
    # Replace common abbreviations and symbols with spaces
    formatted_text = re.sub(r'\n+', '\n', text)  # Ensure single newlines
    formatted_text = re.sub(r'\\u[0-9a-fA-F]{4}', '', formatted_text)  # Remove any unicode characters
    formatted_text = re.sub(r'\s{2,}', ' ', formatted_text)  # Replace multiple spaces with a single space

    # Add newlines for better readability
    formatted_text = re.sub(r'(Buyer.*|Bill to.*)', r'\n\1\n', formatted_text)
    formatted_text = re.sub(r'(Consignee.*|Ship to.*)', r'\n\1\n', formatted_text)
    formatted_text = re.sub(r'(Invoice No.*|Invoice Date.*)', r'\n\1\n', formatted_text)
    formatted_text = re.sub(r'(Total.*|Amount.*|GSTIN.*)', r'\n\1\n', formatted_text)
    formatted_text = re.sub(r'(Description of Goods.*|Contact.*|Transport.*)', r'\n\1\n', formatted_text)
    
    # Additional formatting as needed
    formatted_text = formatted_text.strip()  # Remove leading and trailing whitespace

    return formatted_text

def save_to_text_file(formatted_text, output_text_path):
    # Save the formatted text to a text file with UTF-8 encoding
    with open(output_text_path, 'w', encoding='utf-8') as text_file:
        text_file.write(formatted_text)

# Path to the image file
image_path = 'image.jpg'
api_key = 'AIzaSyDzGSBIG3dX6oyKVgsUmAzH0s597EWPAQg'

# Extract text from the image
text = extract_text_from_image(api_key, image_path)

# Format the extracted text for better readability
formatted_text = format_extracted_text(text)
print("Formatted Text:\n", formatted_text)

# Save the formatted text to a text file
output_text_path = 'extracted_bill_info.txt'
save_to_text_file(formatted_text, output_text_path)

print(f"Formatted text saved to {output_text_path}")
