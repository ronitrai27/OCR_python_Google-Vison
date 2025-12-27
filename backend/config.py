import os
from dotenv import load_dotenv
import secrets

# Load environment variables from .env file
load_dotenv()

class Config:
    # Security - Generate random key for development if not set
    SECRET_KEY = os.environ.get('SECRET_KEY')
    if not SECRET_KEY:
        SECRET_KEY = secrets.token_hex(32)
        print("⚠️  Warning: SECRET_KEY not set. Using auto-generated key (set SECRET_KEY in production!)")
    
    # Database (Supabase PostgreSQL)
    # Format: postgresql://USER:PASSWORD@HOST:PORT/DBNAME
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///landrecords.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True,
    }
    
    # Supabase Client Configuration (Optional for Auth/Storage)
    SUPABASE_URL = os.environ.get('SUPABASE_URL')
    SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
    
    # Google Cloud APIs
    GOOGLE_APPLICATION_CREDENTIALS = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    GOOGLE_VISION_API_KEY = os.environ.get('GOOGLE_VISION_API_KEY')
    GOOGLE_GEMINI_API_KEY = os.environ.get('GOOGLE_GEMINI_API_KEY')
    
    # Validate required API keys
    if not GOOGLE_VISION_API_KEY:
        print("⚠️  Warning: GOOGLE_VISION_API_KEY not configured. OCR features may not work.")
    
    # AI4Bharat (Optional for translation)
    AI4BHARAT_CACHE_DIR = os.environ.get('AI4BHARAT_CACHE_DIR', './models/ai4bharat')
    AI4BHARAT_DEVICE = os.environ.get('AI4BHARAT_DEVICE', 'auto')
    
    # File Upload
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))  # 16MB default
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', './uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'tiff', 'bmp'}
    
    # CORS - Production should use specific origins
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Environment
    ENV = os.environ.get('FLASK_ENV', 'production')
    DEBUG = ENV == 'development'
    TESTING = False
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

