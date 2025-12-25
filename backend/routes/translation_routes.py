from flask import Blueprint, request, jsonify
from translation.ai4bharat_translator import translate_urdu_to_english

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
        # Currently only supporting Urdu to English as per the implemented function
        # In a real app, we would switch based on source_lang
        translated_text = translate_urdu_to_english(text)
        return jsonify({"success": True, "data": {"translated": translated_text}})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@translation_bp.route('/document', methods=['POST'])
def translate_document():
    # TODO: Implement document translation
    return jsonify({"success": True, "message": "Document translation started"})
