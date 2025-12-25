import requests
import base64
import json

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
    except (IndexError, KeyError):
        print("Error: Unexpected response format or no text annotations found.")
        text_annotations = []

    return text_annotations

# Path to the image file
image_path = 'image.jpg'
api_key = 'AIzaSyDzGSBIG3dX6oyKVgsUmAzH0s597EWPAQg'

# Extract text from the image
text_annotations = extract_text_from_image(api_key, image_path)

# Print the extracted text
for annotation in text_annotations:
    print(annotation.get('description', ''))
