# AgriStack OCR Backend

Production-ready Flask backend for OCR, translation, and document processing.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL (for production) or SQLite (for development)
- Google Cloud Vision API key

### Local Development

1. **Clone and navigate to backend**
```bash
cd OCR_python/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your API keys
```

5. **Run development server**
```bash
python app.py
```

Server will start at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── app.py                 # Application factory
├── config.py              # Configuration management
├── extensions.py          # Flask extensions
├── models.py              # Database models
├── requirements.txt       # Python dependencies
│
├── common/                # Shared utilities
│   ├── gemini_ai.py      # Gemini AI integration
│   ├── performance.py    # Performance monitoring
│   ├── response_formatter.py
│   ├── supabase_client.py
│   └── text_cleaner.py
│
├── document/              # Document processing
│   ├── pdf_generator.py
│   ├── rag_document_processor.py
│   └── upload_handler.py
│
├── ocr/                   # OCR engines
│   ├── confidence_scorer.py
│   ├── google_vision_ocr.py
│   ├── image_processing.py
│   ├── lightweight_ocr.py
│   └── lightweight_pipeline.py
│
├── routes/                # API endpoints
│   ├── disputed_lands_routes.py
│   ├── ocr_routes.py
│   ├── rag_routes.py
│   └── translation_routes.py
│
└── translation/           # Translation services
    ├── ai4bharat_translator.py
    ├── language_detector.py
    ├── simple_translator.py
    └── transliterator.py
```

## 🔧 Configuration

### Required Environment Variables

```env
# Security
SECRET_KEY=your-secret-key-here

# OCR - Required
GOOGLE_VISION_API_KEY=your-api-key

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# CORS
CORS_ORIGINS=https://your-frontend.vercel.app
```

### Optional Environment Variables

```env
# Gemini AI for summarization
GOOGLE_GEMINI_API_KEY=your-gemini-key

# Supabase for auth/storage
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# Environment
FLASK_ENV=production
LOG_LEVEL=INFO
PORT=5000
```

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```

### OCR
```
POST /api/ocr/upload        - Upload document
POST /api/ocr/process       - Process OCR
GET  /api/ocr/documents     - List documents
```

### Translation
```
POST /api/translate/text    - Translate text
POST /api/translate/pdf     - Translate PDF
```

### RAG (Document Q&A)
```
POST /api/rag/upload        - Upload document for RAG
POST /api/rag/query         - Query document
```

### Disputed Lands
```
GET  /api/disputed-lands    - List disputed lands
POST /api/disputed-lands    - Add disputed land
```

## 🐳 Production Deployment

### Vercel

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Set environment variables in Vercel dashboard**
   - `SECRET_KEY`
   - `GOOGLE_VISION_API_KEY`
   - `DATABASE_URL`
   - `CORS_ORIGINS`

### Railway

1. **Create new project on Railway**
2. **Connect GitHub repository**
3. **Add environment variables**
4. **Deploy automatically on push**

### Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_ENV=production
EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:create_app()"]
```

## 🔒 Security Best Practices

1. **Never commit `.env` file**
2. **Use strong `SECRET_KEY`**
3. **Set specific `CORS_ORIGINS` in production**
4. **Use PostgreSQL in production (not SQLite)**
5. **Enable HTTPS in production**
6. **Regularly update dependencies**

## 📊 Database Schema

The application uses SQLAlchemy ORM with the following models:

- **Document**: OCR processed documents
- **Farmer**: Farmer registry
- **LandParcel**: Land ownership records
- **ProcessingStats**: OCR processing statistics
- **DisputedLand**: Disputed land records

## 🧪 Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=.
```

## 🐛 Troubleshooting

### Issue: "GOOGLE_VISION_API_KEY not found"
**Solution**: Add the API key to your `.env` file

### Issue: "Database connection error"
**Solution**: Verify `DATABASE_URL` format and credentials

### Issue: "CORS error from frontend"
**Solution**: Add frontend URL to `CORS_ORIGINS`

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request
