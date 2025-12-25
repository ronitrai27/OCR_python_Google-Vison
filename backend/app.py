from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import db
from routes.ocr_routes import ocr_bp
from routes.translation_routes import translation_bp
from routes.rag_routes import rag_bp
from routes.disputed_lands_routes import disputed_lands_bp
import os

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize Extensions
    db.init_app(app)
    
    # Create database tables
    with app.app_context():
        from models import Document, Farmer, LandParcel, ProcessingStats, DisputedLand
        db.create_all()
    
    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})

    
    # Register Blueprints
    app.register_blueprint(ocr_bp, url_prefix='/api/ocr')
    app.register_blueprint(translation_bp, url_prefix='/api/translate')
    app.register_blueprint(rag_bp, url_prefix='/api/rag')
    app.register_blueprint(disputed_lands_bp, url_prefix='/api')
    
    @app.route('/api/health')
    def health_check():
        google_vision = bool(os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'))
        
        return jsonify({
            "status": "healthy",
            "service": "OCR Backend",
            "google_vision_configured": google_vision,
            "ocr_engine": "google_vision" if google_vision else "not_configured"
        })
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)

