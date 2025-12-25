from google.cloud import vision
import os

def get_vision_client():
    return vision.ImageAnnotatorClient()

def extract_text(image_bytes):
    """
    Extracts text from an image using Google Cloud Vision API.
    """
    client = get_vision_client()
    image = vision.Image(content=image_bytes)
    response = client.document_text_detection(image=image)
    
    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))
                
    return response.full_text_annotation.text
