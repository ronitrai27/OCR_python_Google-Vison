from .lightweight_ocr import extract_text_with_details
from .image_processing import preprocess_image
from .confidence_scorer import calculate_confidence

class OCRPipeline:
    def process(self, image_bytes):
        processed_image = preprocess_image(image_bytes)
        result = extract_text_with_details(processed_image)
        
        text = result.get('text', '')
        detected_language = result.get('detected_language', 'unknown')
        confidence = result.get('confidence', calculate_confidence(text))
        
        return {
            "text": text,
            "confidence": confidence,
            "detected_language": detected_language
        }

ocr_pipeline = OCRPipeline()
