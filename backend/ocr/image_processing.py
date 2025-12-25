import cv2
import numpy as np
from PIL import Image
import io

def preprocess_image(image_bytes):
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Convert back to bytes
    is_success, buffer = cv2.imencode(".jpg", thresh)
    io_buf = io.BytesIO(buffer)
    return io_buf.getvalue()
