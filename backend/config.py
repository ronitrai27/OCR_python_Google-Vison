import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Debug: Print if API key is loaded (first few chars only for security)
if os.environ.get('GOOGLE_VISION_API_KEY'):
    api_key = os.environ.get('GOOGLE_VISION_API_KEY')
    print(f"✓ Google Vision API Key loaded: {api_key[:20]}...")
else:
    print("✗ Warning: GOOGLE_VISION_API_KEY not found in environment")

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    
    # Database (Supabase PostgreSQL)
    # Format: postgresql://USER:PASSWORD@HOST:PORT/DBNAME
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///landrecords.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Supabase Client Configuration (Optional for Auth/Storage)
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
    
    # Google Cloud
    GOOGLE_APPLICATION_CREDENTIALS = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    GOOGLE_VISION_API_KEY = os.environ.get('GOOGLE_VISION_API_KEY')
    GOOGLE_GEMINI_API_KEY = os.environ.get('GOOGLE_GEMINI_API_KEY')
    
    # AI4Bharat
    AI4BHARAT_CACHE_DIR = os.environ.get('AI4BHARAT_CACHE_DIR', './models/ai4bharat')
    AI4BHARAT_DEVICE = os.environ.get('AI4BHARAT_DEVICE', 'auto')
    
    # File Upload
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', './uploads')
    
    # CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
