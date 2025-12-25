from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from document.upload_handler import save_file
from ocr.lightweight_pipeline import ocr_pipeline

ocr_bp = Blueprint('ocr', __name__)

@ocr_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
    
    try:
        filepath = save_file(file, current_app.config['UPLOAD_FOLDER'])
        return jsonify({
            "success": True, 
            "message": "File uploaded successfully",
            "data": {
                "filepath": filepath,
                "filename": file.filename
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@ocr_bp.route('/process', methods=['POST'])
def process_ocr():
    data = request.get_json()
    filepath = data.get('filepath')
    if not filepath:
        return jsonify({"success": False, "error": "No filepath provided"}), 400
        
    try:
        with open(filepath, 'rb') as f:
            image_bytes = f.read()
            
        result = ocr_pipeline.process(image_bytes)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@ocr_bp.route('/batch', methods=['POST'])
def batch_process():
    # TODO: Implement batch processing
    return jsonify({"success": True, "message": "Batch processing started"})

@ocr_bp.route('/stats', methods=['GET'])
def get_stats():
    # TODO: Implement stats
    return jsonify({
        "total_processed": 0,
        "success_rate": 0,
        "avg_processing_time": 0,
        "language_distribution": {
            "urdu": 0,
            "hindi": 0,
            "english": 0
        }
    })
