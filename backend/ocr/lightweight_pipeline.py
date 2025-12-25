from .lightweight_ocr import extract_text
from .image_processing import preprocess_image
from .confidence_scorer import calculate_confidence

class OCRPipeline:
    def process(self, image_bytes):
        processed_image = preprocess_image(image_bytes)
        text = extract_text(processed_image)
        confidence = calculate_confidence(text)
        
        return {
            "text": text,
            "confidence": confidence
        }

ocr_pipeline = OCRPipeline()
