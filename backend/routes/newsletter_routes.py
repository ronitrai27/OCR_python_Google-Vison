from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import re
from datetime import datetime

newsletter_bp = Blueprint('newsletter', __name__)

# Email configuration - should be set in environment variables
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
FROM_EMAIL = os.environ.get('FROM_EMAIL', 'noreply@agristack.com')

# In-memory subscriber storage (for demo - use database in production)
subscribers = []


def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def send_confirmation_email(to_email):
    """Send a confirmation email to the subscriber"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = '🌾 Welcome to AgriStack Newsletter!'
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email

        # HTML content
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #292929;
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }}
                .card {{
                    background: white;
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 30px;
                }}
                .logo {{
                    font-size: 28px;
                    font-weight: bold;
                    color: #292929;
                }}
                h1 {{
                    color: #292929;
                    font-size: 24px;
                    margin-bottom: 20px;
                }}
                .content {{
                    color: #555;
                    font-size: 16px;
                }}
                .features {{
                    background: #f9f9f9;
                    border-radius: 12px;
                    padding: 20px;
                    margin: 20px 0;
                }}
                .feature {{
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                }}
                .feature:last-child {{
                    margin-bottom: 0;
                }}
                .feature-icon {{
                    width: 24px;
                    height: 24px;
                    margin-right: 12px;
                    color: #292929;
                }}
                .cta-button {{
                    display: inline-block;
                    background: #292929;
                    color: white;
                    padding: 14px 28px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    margin-top: 20px;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 30px;
                    color: #999;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="card">
                    <div class="header">
                        <div class="logo">🌾 AgriStack OCR</div>
                    </div>
                    
                    <h1>Welcome to AgriStack Newsletter!</h1>
                    
                    <div class="content">
                        <p>Thank you for subscribing to our newsletter! You'll now receive updates about:</p>
                        
                        <div class="features">
                            <div class="feature">
                                <span>📄</span>
                                <span style="margin-left: 12px;">New OCR features and improvements</span>
                            </div>
                            <div class="feature">
                                <span>🌐</span>
                                <span style="margin-left: 12px;">Translation capabilities updates</span>
                            </div>
                            <div class="feature">
                                <span>🚀</span>
                                <span style="margin-left: 12px;">Product announcements and tips</span>
                            </div>
                            <div class="feature">
                                <span>📰</span>
                                <span style="margin-left: 12px;">Agricultural technology news</span>
                            </div>
                        </div>
                        
                        <p>We're excited to have you on board!</p>
                        
                        <a href="https://agristack.com" class="cta-button">
                            Visit AgriStack
                        </a>
                    </div>
                    
                    <div class="footer">
                        <p>© {datetime.now().year} AgriStack OCR. Made with ❤️ in India</p>
                        <p>You received this email because you subscribed to our newsletter.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

        # Plain text fallback
        text_content = f"""
        Welcome to AgriStack Newsletter!
        
        Thank you for subscribing! You'll now receive updates about:
        - New OCR features and improvements
        - Translation capabilities updates  
        - Product announcements and tips
        - Agricultural technology news
        
        We're excited to have you on board!
        
        Visit us at: https://agristack.com
        
        © {datetime.now().year} AgriStack OCR. Made with love in India.
        """

        msg.attach(MIMEText(text_content, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))

        # Only send if SMTP is configured
        if SMTP_USER and SMTP_PASSWORD:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
            return True
        else:
            # Log for demo purposes
            print(f"[Newsletter] Confirmation email would be sent to: {to_email}")
            return True
            
    except Exception as e:
        print(f"[Newsletter] Error sending email: {str(e)}")
        return False


@newsletter_bp.route('/subscribe', methods=['POST'])
def subscribe():
    """Subscribe to newsletter"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({
                'success': False,
                'error': 'Email is required'
            }), 400
        
        email = data['email'].strip().lower()
        
        # Validate email
        if not is_valid_email(email):
            return jsonify({
                'success': False,
                'error': 'Invalid email format'
            }), 400
        
        # Check if already subscribed (in-memory for demo)
        if any(sub['email'] == email for sub in subscribers):
            return jsonify({
                'success': False,
                'error': 'You are already subscribed!'
            }), 409
        
        # Add subscriber
        subscriber = {
            'email': email,
            'subscribed_at': datetime.now().isoformat(),
            'status': 'active'
        }
        subscribers.append(subscriber)
        
        # Send confirmation email
        email_sent = send_confirmation_email(email)
        
        return jsonify({
            'success': True,
            'message': 'Successfully subscribed to newsletter!',
            'email_sent': email_sent
        }), 201
        
    except Exception as e:
        print(f"[Newsletter] Subscribe error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred. Please try again.'
        }), 500


@newsletter_bp.route('/unsubscribe', methods=['POST'])
def unsubscribe():
    """Unsubscribe from newsletter"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({
                'success': False,
                'error': 'Email is required'
            }), 400
        
        email = data['email'].strip().lower()
        
        # Find and remove subscriber
        global subscribers
        original_count = len(subscribers)
        subscribers = [sub for sub in subscribers if sub['email'] != email]
        
        if len(subscribers) < original_count:
            return jsonify({
                'success': True,
                'message': 'Successfully unsubscribed from newsletter'
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': 'Email not found in subscriber list'
            }), 404
            
    except Exception as e:
        print(f"[Newsletter] Unsubscribe error: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred. Please try again.'
        }), 500
