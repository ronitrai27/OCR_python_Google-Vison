from flask import Blueprint, request, jsonify
import os
import time
import fitz  # PyMuPDF for PDF parsing
from translation.ai4bharat_translator import translate_urdu_to_english
from translation.simple_translator import apply_domain_terms, LAND_RECORD_TERMS

translation_bp = Blueprint('translation', __name__)

@translation_bp.route('/text', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get('text')
    source_lang = data.get('source_lang')
    target_lang = data.get('target_lang')
    
    if not text:
        return jsonify({"success": False, "error": "No text provided"}), 400
        
    try:
        start_time = time.time()
        
        # Currently only supporting Urdu to English as per the implemented function
        # In a real app, we would switch based on source_lang
        translated_text = translate_urdu_to_english(text)
        
        # Apply domain-specific land record terms
        translated_text = apply_domain_terms(translated_text)
        
        # Find which domain terms were applied
        terms_applied = []
        for term in LAND_RECORD_TERMS.keys():
            if term in text:
                terms_applied.append(LAND_RECORD_TERMS[term])
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return jsonify({
            "success": True, 
            "data": {
                "translated": translated_text,
                "domain_terms_applied": terms_applied,
                "processing_time_ms": processing_time
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@translation_bp.route('/document', methods=['POST'])
def translate_document():
    """Translate PDF document with support for 100+ pages"""
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file provided"}), 400
    
    file = request.files['file']
    source_lang = request.form.get('source_lang', 'ur')
    target_lang = request.form.get('target_lang', 'en')
    
    if file.filename == '':
        return jsonify({"success": False, "error": "No file selected"}), 400
    
    if not file.filename.lower().endswith('.pdf'):
        return jsonify({"success": False, "error": "Only PDF files are supported"}), 400
    
    try:
        start_time = time.time()
        
        # Read PDF content
        pdf_bytes = file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        total_pages = len(doc)
        extracted_text = []
        
        # Extract text from each page
        for page_num in range(total_pages):
            page = doc.load_page(page_num)
            text = page.get_text("text")
            if text.strip():
                extracted_text.append(f"--- Page {page_num + 1} ---\n{text}")
        
        doc.close()
        
        # Combine all text
        full_text = "\n\n".join(extracted_text)
        
        if not full_text.strip():
            return jsonify({
                "success": False, 
                "error": "No text could be extracted from the PDF. The document may be scanned images. Please use OCR first."
            }), 400
        
        # Translate the text (handle large documents in chunks)
        MAX_CHUNK_SIZE = 5000  # Characters per chunk
        translated_chunks = []
        
        # Split text into manageable chunks
        text_chunks = [full_text[i:i+MAX_CHUNK_SIZE] for i in range(0, len(full_text), MAX_CHUNK_SIZE)]
        
        for chunk in text_chunks:
            if chunk.strip():
                translated_chunk = translate_urdu_to_english(chunk)
                translated_chunks.append(translated_chunk)
        
        # Combine translated text
        translated_text = " ".join(translated_chunks)
        
        # Apply domain-specific land record terms
        translated_text = apply_domain_terms(translated_text)
        
        # Find which domain terms were applied
        terms_applied = []
        for term, replacement in LAND_RECORD_TERMS.items():
            if term in full_text:
                terms_applied.append(replacement)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return jsonify({
            "success": True,
            "data": {
                "translated_text": translated_text,
                "original_text": full_text[:2000] + ("..." if len(full_text) > 2000 else ""),
                "pages_processed": total_pages,
                "total_characters": len(full_text),
                "domain_terms_applied": list(set(terms_applied)),
                "processing_time_ms": processing_time,
                "source_lang": source_lang,
                "target_lang": target_lang
            }
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500

@translation_bp.route('/terms', methods=['GET'])
def get_domain_terms():
    """Get list of supported domain-specific land record terms"""
    return jsonify({
        "success": True,
        "data": {
            "terms": LAND_RECORD_TERMS,
            "count": len(LAND_RECORD_TERMS)
        }
    })
