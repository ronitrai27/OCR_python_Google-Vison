"""
Google Vision API OCR Implementation
Supports both API Key and Service Account authentication
"""
import os
import base64
import requests
from typing import Dict, Optional, List
import logging

logger = logging.getLogger(__name__)


class GoogleVisionOCR:
    """Google Cloud Vision API OCR processor"""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Google Vision OCR
        Args:
            api_key: Google Cloud API Key (optional, can be set via environment)
        """
        self.api_key = api_key or os.environ.get('GOOGLE_VISION_API_KEY')
        self.vision_api_url = 'https://vision.googleapis.com/v1/images:annotate'
        
        if not self.api_key:
            logger.warning("No Google Vision API Key provided. Set GOOGLE_VISION_API_KEY environment variable.")
    
    def process(self, image_bytes: bytes, language_hints: Optional[List[str]] = None) -> Dict:
        """
        Process image with Google Vision API
        
        Args:
            image_bytes: Raw image bytes
            language_hints: List of language codes (e.g., ['ur', 'hi', 'en'])
            
        Returns:
            Dictionary with OCR results:
            {
                'text': str,
                'confidence': float,
                'detected_language': str,
                'blocks': List[Dict]
            }
        """
        if not self.api_key:
            raise ValueError("Google Vision API Key is required. Set GOOGLE_VISION_API_KEY environment variable.")
        
        try:
            # Encode image to base64
            encoded_image = base64.b64encode(image_bytes).decode('utf-8')
            
            # Build request payload
            request_payload = {
                "requests": [
                    {
                        "image": {
                            "content": encoded_image
                        },
                        "features": [
                            {
                                "type": "DOCUMENT_TEXT_DETECTION",
                                "maxResults": 1
                            }
                        ],
                        "imageContext": {
                            "languageHints": language_hints or ['ur', 'hi', 'en', 'pa']
                        }
                    }
                ]
            }
            
            # Make API request
            response = requests.post(
                f"{self.vision_api_url}?key={self.api_key}",
                json=request_payload,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code != 200:
                error_msg = response.json().get('error', {}).get('message', 'Unknown error')
                raise Exception(f"Vision API error: {error_msg}")
            
            result = response.json()
            
            # Parse response
            return self._parse_response(result)
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error calling Vision API: {str(e)}")
            raise Exception(f"Failed to connect to Google Vision API: {str(e)}")
        except Exception as e:
            logger.error(f"Error processing with Vision API: {str(e)}")
            raise
    
    def _parse_response(self, api_response: Dict) -> Dict:
        """Parse Google Vision API response into standardized format"""
        
        if 'responses' not in api_response or not api_response['responses']:
            return {
                'text': '',
                'confidence': 0.0,
                'detected_language': 'unknown',
                'blocks': []
            }
        
        response_data = api_response['responses'][0]
        
        # Check for errors
        if 'error' in response_data:
            error = response_data['error']
            raise Exception(f"Vision API error: {error.get('message', 'Unknown error')}")
        
        # Extract full text
        full_text = ''
        if 'fullTextAnnotation' in response_data:
            full_text = response_data['fullTextAnnotation'].get('text', '')
        
        # Calculate confidence and detect language
        confidence = 0.0
        detected_language = 'unknown'
        blocks_info = []
        
        if 'fullTextAnnotation' in response_data and 'pages' in response_data['fullTextAnnotation']:
            pages = response_data['fullTextAnnotation']['pages']
            
            total_confidence = 0
            block_count = 0
            language_counts = {}
            
            for page in pages:
                for block in page.get('blocks', []):
                    # Get block confidence
                    if 'confidence' in block:
                        total_confidence += block['confidence']
                        block_count += 1
                    
                    # Get block text
                    block_text = self._extract_block_text(block)
                    
                    # Get detected languages
                    if 'property' in block and 'detectedLanguages' in block['property']:
                        for lang_info in block['property']['detectedLanguages']:
                            lang_code = lang_info.get('languageCode', 'unknown')
                            language_counts[lang_code] = language_counts.get(lang_code, 0) + 1
                    
                    blocks_info.append({
                        'text': block_text,
                        'confidence': block.get('confidence', 0) * 100
                    })
            
            # Calculate average confidence
            if block_count > 0:
                confidence = (total_confidence / block_count) * 100
            
            # Determine primary language
            if language_counts:
                detected_language = max(language_counts, key=language_counts.get)
        
        return {
            'text': full_text.strip(),
            'confidence': round(confidence, 2),
            'detected_language': detected_language,
            'blocks': blocks_info
        }
    
    def _extract_block_text(self, block: Dict) -> str:
        """Extract text from a block"""
        text_parts = []
        for paragraph in block.get('paragraphs', []):
            for word in paragraph.get('words', []):
                word_text = ''.join(
                    symbol.get('text', '') 
                    for symbol in word.get('symbols', [])
                )
                text_parts.append(word_text)
        return ' '.join(text_parts)


# Global instance
_vision_ocr_instance = None


def get_vision_ocr() -> GoogleVisionOCR:
    """Get or create GoogleVisionOCR instance (singleton pattern)"""
    global _vision_ocr_instance
    if _vision_ocr_instance is None:
        _vision_ocr_instance = GoogleVisionOCR()
    return _vision_ocr_instance


# Main processing function for easy import
def process_with_vision_api(image_bytes: bytes, language_hints: Optional[List[str]] = None) -> Dict:
    """
    Process image with Google Vision API
    
    Args:
        image_bytes: Raw image bytes
        language_hints: Optional language hints (e.g., ['ur', 'hi', 'en'])
        
    Returns:
        OCR result dictionary
    """
    ocr = get_vision_ocr()
    return ocr.process(image_bytes, language_hints)
