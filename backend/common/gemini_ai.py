"""
Google Gemini AI Integration for Document Summarization
"""
import os
import requests
from flask import current_app

def summarize_with_gemini(text, prompt_type="general"):
    """
    Generate summary of text using Google Gemini API
    
    Args:
        text: Text to summarize
        prompt_type: Type of summary - 'general', 'land_record', 'legal', 'bullet_points'
    
    Returns:
        dict with summary and metadata
    """
    api_key = current_app.config.get('GOOGLE_GEMINI_API_KEY') or os.environ.get('GOOGLE_GEMINI_API_KEY')
    
    if not api_key:
        return {
            "success": False,
            "error": "Google Gemini API key not configured",
            "summary": ""
        }
    
    # Gemini API endpoint
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    
    # Build prompt based on type
    prompts = {
        "general": f"Please provide a concise summary of the following document:\\n\\n{text}",
        "land_record": f"This is a land record document. Summarize the key information including owner name, land area, location, and any important details:\\n\\n{text}",
        "legal": f"Analyze this legal document and provide a summary highlighting key legal points, parties involved, and main clauses:\\n\\n{text}",
        "bullet_points": f"Summarize the following text in bullet points, highlighting the most important information:\\n\\n{text}",
        "extract_data": f"Extract structured data from this land record document. Identify: Owner Name, Khasra Number, Area (Kanal/Marla), Tehsil, District, and any other relevant fields:\\n\\n{text}"
    }
    
    prompt = prompts.get(prompt_type, prompts["general"])
    
    # Truncate text if too long (Gemini has token limits)
    max_chars = 15000
    if len(text) > max_chars:
        text = text[:max_chars] + "\\n\\n[Text truncated due to length...]"
        prompt = prompts.get(prompt_type, prompts["general"]).replace(text, text)
    
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "temperature": 0.4,
            "topK": 32,
            "topP": 1,
            "maxOutputTokens": 2048,
        }
    }
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            # Extract generated text
            if 'candidates' in data and len(data['candidates']) > 0:
                candidate = data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    summary_text = candidate['content']['parts'][0]['text']
                    
                    return {
                        "success": True,
                        "summary": summary_text,
                        "prompt_type": prompt_type,
                        "input_length": len(text),
                        "model": "gemini-pro"
                    }
            
            return {
                "success": False,
                "error": "Unexpected response format from Gemini API",
                "summary": ""
            }
        else:
            error_msg = response.json().get('error', {}).get('message', response.text)
            return {
                "success": False,
                "error": f"Gemini API error: {error_msg}",
                "summary": ""
            }
    
    except requests.exceptions.Timeout:
        return {
            "success": False,
            "error": "Request to Gemini API timed out",
            "summary": ""
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Error calling Gemini API: {str(e)}",
            "summary": ""
        }

def ask_question_about_document(text, question):
    """
    Ask a specific question about the document using Gemini
    
    Args:
        text: Document text
        question: User's question
    
    Returns:
        dict with answer and metadata
    """
    api_key = current_app.config.get('GOOGLE_GEMINI_API_KEY') or os.environ.get('GOOGLE_GEMINI_API_KEY')
    
    if not api_key:
        return {
            "success": False,
            "error": "Google Gemini API key not configured",
            "answer": ""
        }
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    
    # Truncate text if too long
    max_chars = 15000
    if len(text) > max_chars:
        text = text[:max_chars] + "\\n\\n[Text truncated...]"
    
    prompt = f"""Based on the following document, please answer this question: {question}

Document:
{text}

Answer:"""
    
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "temperature": 0.3,
            "topK": 32,
            "topP": 1,
            "maxOutputTokens": 1024,
        }
    }
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            if 'candidates' in data and len(data['candidates']) > 0:
                candidate = data['candidates'][0]
                if 'content' in candidate and 'parts' in candidate['content']:
                    answer_text = candidate['content']['parts'][0]['text']
                    
                    return {
                        "success": True,
                        "answer": answer_text,
                        "question": question,
                        "model": "gemini-pro"
                    }
            
            return {
                "success": False,
                "error": "Unexpected response format from Gemini API",
                "answer": ""
            }
        else:
            error_msg = response.json().get('error', {}).get('message', response.text)
            return {
                "success": False,
                "error": f"Gemini API error: {error_msg}",
                "answer": ""
            }
    
    except Exception as e:
        return {
            "success": False,
            "error": f"Error calling Gemini API: {str(e)}",
            "answer": ""
        }
