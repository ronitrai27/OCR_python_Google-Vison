from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import time
from datetime import datetime, date
from document.upload_handler import save_file
from ocr.lightweight_pipeline import ocr_pipeline
from ocr.google_vision_ocr import process_with_vision_api
from extensions import db
from models import Document, Farmer, LandParcel, ProcessingStats
from sqlalchemy import func

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
        start_time = time.time()
        
        with open(filepath, 'rb') as f:
            image_bytes = f.read()
            
        result = ocr_pipeline.process(image_bytes)
        
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        # Detect language from result
        detected_lang = result.get('detected_language', 'unknown')
        
        # Create document record
        doc = Document(
            filename=os.path.basename(filepath),
            original_path=filepath,
            file_type=os.path.splitext(filepath)[1][1:].lower(),
            file_size_kb=len(image_bytes) // 1024,
            ocr_text=result.get('text', ''),
            detected_language=detected_lang,
            ocr_confidence=result.get('confidence', 0),
            processing_status='processed',
            processing_time_ms=processing_time_ms,
            processed_at=datetime.utcnow()
        )
        db.session.add(doc)
        
        # Update daily stats
        today = date.today()
        stats = ProcessingStats.query.filter_by(date=today).first()
        if not stats:
            stats = ProcessingStats(date=today)
            db.session.add(stats)
        
        stats.documents_processed += 1
        stats.total_processing_time_ms += processing_time_ms
        
        if detected_lang in ['ur', 'urd', 'urdu']:
            stats.urdu_count += 1
        elif detected_lang in ['hi', 'hin', 'hindi']:
            stats.hindi_count += 1
        else:
            stats.english_count += 1
            
        db.session.commit()
        
        return jsonify({
            "success": True, 
            "data": {
                **result,
                "document_id": doc.id,
                "processing_time_ms": processing_time_ms
            }
        })
    except Exception as e:
        # Log failed processing
        try:
            today = date.today()
            stats = ProcessingStats.query.filter_by(date=today).first()
            if not stats:
                stats = ProcessingStats(date=today)
                db.session.add(stats)
            stats.documents_failed += 1
            db.session.commit()
        except:
            pass
        return jsonify({"success": False, "error": str(e)}), 500

@ocr_bp.route('/process-vision', methods=['POST'])
def process_ocr_vision():
    """Process OCR using Google Vision API"""
    import logging
    logger = logging.getLogger(__name__)
    
    data = request.get_json()
    filepath = data.get('filepath')
    language_hints = data.get('language_hints', ['ur', 'hi', 'en', 'pa'])
    
    logger.info(f"Google Vision OCR request - filepath: {filepath}")
    
    if not filepath:
        logger.error("No filepath provided in request")
        return jsonify({"success": False, "error": "No filepath provided"}), 400
    
    # Check if API key is configured
    api_key = current_app.config.get('GOOGLE_VISION_API_KEY')
    if not api_key:
        logger.error("GOOGLE_VISION_API_KEY not configured")
        return jsonify({
            "success": False, 
            "error": "Google Vision API Key not configured",
            "hint": "Add GOOGLE_VISION_API_KEY to your .env file and restart the server"
        }), 400
    
    logger.info(f"API Key found: {api_key[:20]}...") 
        
    try:
        start_time = time.time()
        
        # Read image file
        if not os.path.exists(filepath):
            logger.error(f"File not found: {filepath}")
            return jsonify({"success": False, "error": f"File not found: {filepath}"}), 400
            
        with open(filepath, 'rb') as f:
            image_bytes = f.read()
        
        logger.info(f"Processing image with Vision API - size: {len(image_bytes)} bytes")
        
        # Process with Google Vision API
        result = process_with_vision_api(image_bytes, language_hints)
        
        processing_time_ms = int((time.time() - start_time) * 1000)
        
        # Detect language from result
        detected_lang = result.get('detected_language', 'unknown')
        
        # Create document record
        doc = Document(
            filename=os.path.basename(filepath),
            original_path=filepath,
            file_type=os.path.splitext(filepath)[1][1:].lower(),
            file_size_kb=len(image_bytes) // 1024,
            ocr_text=result.get('text', ''),
            detected_language=detected_lang,
            ocr_confidence=result.get('confidence', 0),
            processing_status='processed',
            processing_time_ms=processing_time_ms,
            processed_at=datetime.utcnow()
        )
        db.session.add(doc)
        
        # Update daily stats
        today = date.today()
        stats = ProcessingStats.query.filter_by(date=today).first()
        if not stats:
            stats = ProcessingStats(date=today)
            db.session.add(stats)
        
        stats.documents_processed += 1
        stats.total_processing_time_ms += processing_time_ms
        
        if detected_lang in ['ur', 'urd', 'urdu']:
            stats.urdu_count += 1
        elif detected_lang in ['hi', 'hin', 'hindi']:
            stats.hindi_count += 1
        else:
            stats.english_count += 1
            
        db.session.commit()
        
        return jsonify({
            "success": True,
            "data": {
                **result,
                "document_id": doc.id,
                "processing_time_ms": processing_time_ms,
                "ocr_engine": "google_vision"
            }
        })
    except ValueError as e:
        # API key not configured
        return jsonify({
            "success": False, 
            "error": str(e),
            "hint": "Set GOOGLE_VISION_API_KEY in your .env file"
        }), 400
    except Exception as e:
        # Log failed processing
        try:
            today = date.today()
            stats = ProcessingStats.query.filter_by(date=today).first()
            if not stats:
                stats = ProcessingStats(date=today)
                db.session.add(stats)
            stats.documents_failed += 1
            db.session.commit()
        except:
            pass
        return jsonify({"success": False, "error": str(e)}), 500


@ocr_bp.route('/batch', methods=['POST'])
def batch_process():
    # TODO: Implement batch processing
    return jsonify({"success": True, "message": "Batch processing started"})

@ocr_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get real processing statistics from database"""
    try:
        # Total documents processed
        total_processed = db.session.query(func.count(Document.id)).filter(
            Document.processing_status == 'processed'
        ).scalar() or 0
        
        # Total failed
        total_failed = db.session.query(func.count(Document.id)).filter(
            Document.processing_status == 'failed'
        ).scalar() or 0
        
        # Success rate
        total_attempts = total_processed + total_failed
        success_rate = (total_processed / total_attempts * 100) if total_attempts > 0 else 0
        
        # Average processing time
        avg_time_result = db.session.query(func.avg(Document.processing_time_ms)).filter(
            Document.processing_status == 'processed'
        ).scalar()
        avg_processing_time = round(avg_time_result / 1000, 2) if avg_time_result else 0
        
        # Language distribution
        urdu_count = db.session.query(func.count(Document.id)).filter(
            Document.detected_language.in_(['ur', 'urd', 'urdu'])
        ).scalar() or 0
        
        hindi_count = db.session.query(func.count(Document.id)).filter(
            Document.detected_language.in_(['hi', 'hin', 'hindi'])
        ).scalar() or 0
        
        english_count = db.session.query(func.count(Document.id)).filter(
            Document.detected_language.in_(['en', 'eng', 'english'])
        ).scalar() or 0
        
        # Unique farmers (from farmer table)
        farmers_registered = db.session.query(func.count(Farmer.id)).scalar() or 0
        
        # Unique parcels
        parcels_linked = db.session.query(func.count(LandParcel.id)).scalar() or 0
        
        # Pending documents
        pending_records = db.session.query(func.count(Document.id)).filter(
            Document.processing_status == 'pending'
        ).scalar() or 0
        
        # Accuracy rate (based on confidence scores)
        avg_confidence = db.session.query(func.avg(Document.ocr_confidence)).filter(
            Document.processing_status == 'processed'
        ).scalar()
        accuracy_rate = round(avg_confidence, 1) if avg_confidence else 0
        
        return jsonify({
            "success": True,
            "data": {
                "total_processed": total_processed,
                "success_rate": round(success_rate, 1),
                "avg_processing_time": avg_processing_time,
                "accuracy_rate": accuracy_rate,
                "farmers_registered": farmers_registered,
                "parcels_linked": parcels_linked,
                "pending_records": pending_records,
                "language_distribution": {
                    "urdu": urdu_count,
                    "hindi": hindi_count,
                    "english": english_count
                }
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "data": {
                "total_processed": 0,
                "success_rate": 0,
                "avg_processing_time": 0,
                "accuracy_rate": 0,
                "farmers_registered": 0,
                "parcels_linked": 0,
                "pending_records": 0,
                "language_distribution": {"urdu": 0, "hindi": 0, "english": 0}
            }
        })

@ocr_bp.route('/documents', methods=['GET'])
def get_documents():
    """Get list of processed documents"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status')
        
        query = Document.query.order_by(Document.created_at.desc())
        
        if status:
            query = query.filter(Document.processing_status == status)
        
        documents = query.limit(per_page).offset((page - 1) * per_page).all()
        total = query.count()
        
        return jsonify({
            "success": True,
            "data": {
                "documents": [doc.to_dict() for doc in documents],
                "total": total,
                "page": page,
                "per_page": per_page
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@ocr_bp.route('/documents/<doc_id>', methods=['GET'])
def get_document(doc_id):
    """Get single document details"""
    try:
        doc = Document.query.get(doc_id)
        if not doc:
            return jsonify({"success": False, "error": "Document not found"}), 404
        
        return jsonify({
            "success": True,
            "data": {
                **doc.to_dict(),
                "ocr_text": doc.ocr_text,
                "translated_text": doc.translated_text
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@ocr_bp.route('/district-progress', methods=['GET'])
def get_district_progress():
    """Get progress by district"""
    try:
        # Group documents by district
        district_stats = db.session.query(
            Document.district,
            func.count(Document.id).label('completed')
        ).filter(
            Document.processing_status == 'processed',
            Document.district.isnot(None)
        ).group_by(Document.district).all()
        
        # Estimated totals per district (you can adjust these)
        district_targets = {
            'Srinagar': 5000,
            'Jammu': 4500,
            'Anantnag': 3000,
            'Baramulla': 2500,
            'Udhampur': 2000,
            'Pulwama': 1500,
            'Budgam': 1500,
            'Kupwara': 1500
        }
        
        progress = []
        for dist, completed in district_stats:
            total = district_targets.get(dist, 1000)
            progress.append({
                'name': dist,
                'total': total,
                'completed': completed,
                'percentage': round((completed / total) * 100, 1) if total > 0 else 0
            })
        
        # Add districts with no processed documents yet
        processed_districts = {p['name'] for p in progress}
        for dist, total in district_targets.items():
            if dist not in processed_districts:
                progress.append({
                    'name': dist,
                    'total': total,
                    'completed': 0,
                    'percentage': 0
                })
        
        # Sort by percentage descending
        progress.sort(key=lambda x: x['percentage'], reverse=True)
        
        return jsonify({
            "success": True,
            "data": progress
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []})


# New endpoints for PDF generation and AI features

@ocr_bp.route('/generate-pdf/<int:doc_id>', methods=['POST'])
def generate_pdf_from_ocr(doc_id):
    """Generate PDF from OCR processed document"""
    from document.pdf_generator import generate_ocr_pdf
    
    try:
        # Get document from database
        doc = Document.query.get(doc_id)
        if not doc:
            return jsonify({"success": False, "error": "Document not found"}), 404
        
        # Generate PDF filename
        original_filename = os.path.splitext(doc.filename)[0]
        pdf_filename = f"{original_filename}_ocr.pdf"
        pdf_path = os.path.join(current_app.config['UPLOAD_FOLDER'], pdf_filename)
        
        # Prepare metadata
        metadata = {
            'filename': doc.filename,
            'detected_language': doc.detected_language,
            'confidence': doc.ocr_confidence * 100 if doc.ocr_confidence else 0
        }
        
        # Generate PDF
        generate_ocr_pdf(doc.ocr_text, pdf_path, metadata)
        
        # Update document record with PDF path
        doc.pdf_path = pdf_path
        db.session.commit()
        
        return jsonify({
            "success": True,
            "data": {
                "pdf_path": pdf_path,
                "pdf_filename": pdf_filename,
                "document_id": doc_id
            }
        })
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@ocr_bp.route('/download-pdf/<int:doc_id>', methods=['GET'])
def download_pdf(doc_id):
    """Download generated PDF"""
    from flask import send_file
    
    try:
        doc = Document.query.get(doc_id)
        if not doc:
            return jsonify({"success": False, "error": "Document not found"}), 404
        
        if not doc.pdf_path or not os.path.exists(doc.pdf_path):
            return jsonify({"success": False, "error": "PDF not generated yet"}), 404
        
        return send_file(
            doc.pdf_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=os.path.basename(doc.pdf_path)
        )
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@ocr_bp.route('/summarize/<int:doc_id>', methods=['POST'])
def summarize_document(doc_id):
    """Generate AI summary using Google Gemini"""
    from common.gemini_ai import summarize_with_gemini
    
    try:
        # Get document
        doc = Document.query.get(doc_id)
        if not doc:
            return jsonify({"success": False, "error": "Document not found"}), 404
        
        if not doc.ocr_text:
            return jsonify({"success": False, "error": "No text to summarize"}), 400
        
        # Get summary type from request (optional)
        data = request.get_json() or {}
        summary_type = data.get('type', 'general')
        
        # Generate summary
        result = summarize_with_gemini(doc.ocr_text, summary_type)
        
        if result['success']:
            # Store summary in document
            doc.ai_summary = result['summary']
            db.session.commit()
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@ocr_bp.route('/ask-question/<int:doc_id>', methods=['POST'])
def ask_document_question(doc_id):
    """Ask a question about the document using AI"""
    from common.gemini_ai import ask_question_about_document
    
    try:
        # Get document
        doc = Document.query.get(doc_id)
        if not doc:
            return jsonify({"success": False, "error": "Document not found"}), 404
        
        if not doc.ocr_text:
            return jsonify({"success": False, "error": "No text available"}), 400
        
        # Get question from request
        data = request.get_json()
        question = data.get('question')
        
        if not question:
            return jsonify({"success": False, "error": "No question provided"}), 400
        
        # Ask question
        result = ask_question_about_document(doc.ocr_text, question)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@ocr_bp.route('/save-to-database/<int:doc_id>', methods=['POST'])
def save_document_permanent(doc_id):
    """Mark document as permanently saved with additional metadata"""
    try:
        doc = Document.query.get(doc_id)
        if not doc:
            return jsonify({"success": False, "error": "Document not found"}), 404
        
        # Get additional metadata from request
        data = request.get_json() or {}
        
        # Update document fields
        doc.is_saved = True
        doc.notes = data.get('notes', doc.notes)
        doc.tags = data.get('tags', doc.tags)
        
        # If user provides structured data extraction
        if data.get('extracted_data'):
            extracted = data['extracted_data']
            doc.owner_name = extracted.get('owner_name')
            doc.khasra_number = extracted.get('khasra_number')
            doc.area_kanal = extracted.get('area_kanal')
            doc.area_marla = extracted.get('area_marla')
            doc.tehsil = extracted.get('tehsil')
            doc.district = extracted.get('district')
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Document saved to database",
            "data": doc.to_dict() if hasattr(doc, 'to_dict') else {"id": doc.id}
        })
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
