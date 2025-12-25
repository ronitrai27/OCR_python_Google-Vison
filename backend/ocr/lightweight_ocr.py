import os
from google.cloud import vision

def get_vision_client():
    """Get Google Cloud Vision client."""
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

def extract_text_with_details(image_bytes):
    """
    Extracts text from an image using Google Cloud Vision API with language detection.
    Returns text, detected language, and confidence score.
    """
    client = get_vision_client()
    image = vision.Image(content=image_bytes)
    response = client.document_text_detection(image=image)
    
    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))
    
    text = response.full_text_annotation.text if response.full_text_annotation else ''
    
    # Detect language from the response
    detected_language = 'unknown'
    confidence = 0.0
    
    if response.full_text_annotation and response.full_text_annotation.pages:
        page = response.full_text_annotation.pages[0]
        
        # Get detected languages
        if page.property and page.property.detected_languages:
            lang_info = page.property.detected_languages[0]
            detected_language = lang_info.language_code
            confidence = lang_info.confidence * 100 if lang_info.confidence else 0
        
        # Map language codes to standard names
        lang_map = {
            'ur': 'urdu',
            'hi': 'hindi', 
            'en': 'english',
            'pa': 'punjabi',
            'ks': 'kashmiri',
            'ar': 'arabic'
        }
        detected_language = lang_map.get(detected_language, detected_language)
    
    # Calculate confidence from blocks if not available
    if confidence == 0 and response.full_text_annotation and response.full_text_annotation.pages:
        total_confidence = 0
        block_count = 0
        for page in response.full_text_annotation.pages:
            for block in page.blocks:
                if block.confidence:
                    total_confidence += block.confidence
                    block_count += 1
        if block_count > 0:
            confidence = round((total_confidence / block_count) * 100, 1)
    
    return {
        'text': text,
        'detected_language': detected_language,
        'confidence': round(confidence, 1)
    }
