from flask import jsonify

def success_response(data, message="Success"):
    return jsonify({
        "success": True,
        "message": message,
        "data": data
    })

def error_response(message, code=400):
    return jsonify({
        "success": False,
        "error": message
    }), code
