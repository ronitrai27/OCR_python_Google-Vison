from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import db
from routes.ocr_routes import ocr_bp
from routes.translation_routes import translation_bp
from routes.rag_routes import rag_bp
from routes.disputed_lands_routes import disputed_lands_bp
import os
import logging

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Configure logging
    logging.basicConfig(
        level=getattr(logging, app.config['LOG_LEVEL']),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    logger = logging.getLogger(__name__)
    
    # Initialize Extensions
    db.init_app(app)
    
    # Create database tables
    with app.app_context():
        try:
            from models import Document, Farmer, LandParcel, ProcessingStats, DisputedLand
            db.create_all()
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating database tables: {e}")
    
    # Initialize CORS with proper configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Register Blueprints
    app.register_blueprint(ocr_bp, url_prefix='/api/ocr')
    app.register_blueprint(translation_bp, url_prefix='/api/translate')
    app.register_blueprint(rag_bp, url_prefix='/api/rag')
    app.register_blueprint(disputed_lands_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        google_vision = bool(os.environ.get('GOOGLE_VISION_API_KEY'))
        
        return jsonify({
            "status": "healthy",
            "service": "OCR Backend",
            "environment": app.config['ENV'],
            "google_vision_configured": google_vision,
            "database": "connected" if db.engine else "not_connected"
        })
    
    # Root endpoint
    @app.route('/')
    def root():
        return jsonify({
            "message": "AgriStack OCR API",
            "version": "1.0.0",
            "endpoints": {
                "health": "/api/health",
                "ocr": "/api/ocr",
                "translation": "/api/translate",
                "rag": "/api/rag",
                "disputed_lands": "/api/disputed-lands"
            }
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"success": False, "error": "Endpoint not found"}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        logger.error(f"Internal server error: {error}")
        return jsonify({"success": False, "error": "Internal server error"}), 500
    
    @app.errorhandler(413)
    def request_entity_too_large(error):
        return jsonify({
            "success": False, 
            "error": "File too large. Maximum size is 16MB"
        }), 413
        
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=app.config['DEBUG'], host='0.0.0.0', port=port)

