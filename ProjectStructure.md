# 🏛️ Land Record OCR & Translation System for Jammu & Kashmir

> **AgriStack Implementation - Digitizing Legacy Land Records**  
> A comprehensive system for digitizing, transliterating, and managing land records in Jammu & Kashmir to enable farmer identification and farm linkage for government agricultural schemes.

---

## 📋 Table of Contents

1. [Problem Statement & Key Challenges](#-problem-statement--key-challenges)
2. [Solution Overview](#-solution-overview)
3. [Complete Tech Stack](#-complete-tech-stack)
4. [System Architecture](#-system-architecture)
5. [Feature Implementation Guide](#-feature-implementation-guide)
6. [Database Design](#-database-design)
7. [Cloud Infrastructure](#-cloud-infrastructure)
8. [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
9. [API Reference](#-api-reference)
10. [Deployment Guide](#-deployment-guide)
11. [Troubleshooting](#-troubleshooting)

---

## 🎯 Problem Statement & Key Challenges

### Background
Land records in Jammu & Kashmir need to be digitized to build a reliable AgriStack pipeline that connects **Farmer ID + Farm ID + Government Schemes + AgriPlatform Services**.

### Key Challenges We Address

| Challenge | Description | Our Solution |
|-----------|-------------|--------------|
| **📜 Physical & Scanned Records** | Land records are largely physical, scanned, in inconsistent formats, often in Urdu script requiring transliteration and manual correction | Google Vision API + AI4Bharat IndicTrans2 for OCR and translation |
| **⏱️ Manual Digitization Bottleneck** | Manual digitization is time-consuming, error-prone, and cannot scale across thousands of parcels and multiple districts | Automated OCR pipeline with batch processing support |
| **🗺️ Multi-Parcel Ownership** | Farmers may hold multiple land parcels across different tehsils/districts, complicating unique-farmer vs unique-farm distinction | Unique ID system linking farmers to multiple parcels with relationship mapping |
| **⚠️ Unsettled Land Ambiguity** | Refugee/muhajireen claim land, redistributed land creates ambiguity in ownership/possession, raising questions in registry formation | Status flags and ownership history tracking in database |
| **🔗 AgriStack Foundation** | Without clean digitized land-record base, subsequent steps (farmer ID + farm ID + scheme linkage + agriplatform services) cannot be reliably built | Structured data output ready for AgriStack integration |

---

## 💡 Solution Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LAND RECORD DIGITIZATION PIPELINE                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    │                               │                               │
    ▼                               ▼                               ▼
┌─────────┐                   ┌─────────┐                     ┌─────────┐
│ SCANNED │                   │   PDF   │                     │  IMAGE  │
│  DOCS   │                   │  FILES  │                     │  FILES  │
└────┬────┘                   └────┬────┘                     └────┬────┘
     │                              │                               │
     └──────────────────────────────┼───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   GOOGLE VISION API (OCR)     │
                    │   - Text extraction           │
                    │   - Urdu/Hindi/English        │
                    │   - Handwritten recognition   │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   AI4BHARAT INDICTRANS2       │
                    │   - Urdu → English            │
                    │   - Hindi → English           │
                    │   - Domain-specific terms     │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   STRUCTURED DATA OUTPUT      │
                    │   - Owner name                │
                    │   - Parcel ID (Khasra No.)    │
                    │   - Area, Location            │
                    │   - Ownership history         │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │   DATABASE (PostgreSQL)       │
                    │   - Farmer registry           │
                    │   - Farm/parcel registry      │
                    │   - Scheme linkage ready      │
                    └───────────────────────────────┘
```

---

## 🛠️ Complete Tech Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.x | UI framework for building interactive interfaces |
| **Vite** | 7.x | Fast build tool and dev server |
| **Tailwind CSS** | 4.x | Utility-first CSS framework for styling |
| **Axios** | 1.x | HTTP client for API calls |
| **React Router** | 7.x | Client-side routing |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.9+ | Primary backend language |
| **Flask** | 3.0 | Lightweight web framework for REST API |
| **Flask-CORS** | 4.0 | Cross-origin resource sharing |
| **Gunicorn** | 21.x | Production WSGI server |

### OCR & Translation Stack

| Technology | Purpose | Cost |
|------------|---------|------|
| **Google Cloud Vision API** | OCR for scanned documents, handwritten text | 1,000 free/month, then $1.50/1000 |
| **AI4Bharat IndicTrans2** | Urdu/Hindi → English translation | FREE (self-hosted) |
| **IndicXlit** | Script transliteration | FREE (self-hosted) |
| **PyMuPDF** | PDF processing and text extraction | FREE |
| **Pillow + OpenCV** | Image preprocessing | FREE |

### Database Stack

| Technology | Purpose | Recommendation |
|------------|---------|----------------|
| **PostgreSQL** | Primary database for structured land records | RECOMMENDED for production |
| **SQLite** | Development/testing | Use for local development |
| **Redis** | Caching OCR results, session management | OPTIONAL but recommended |

### Cloud Infrastructure

| Service | Purpose | Provider Options |
|---------|---------|------------------|
| **Compute** | Host backend API | AWS EC2 / GCP Compute / Azure VM / DigitalOcean |
| **Storage** | Store scanned documents, PDFs | AWS S3 / GCP Cloud Storage / Azure Blob |
| **CDN** | Serve frontend assets | CloudFlare / AWS CloudFront |
| **Container** | Docker deployment | Docker Hub / AWS ECR / GCP Container Registry |

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React + Vite)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ File Upload │  │ OCR Results │  │ Translation │  │ Admin Dashboard     │ │
│  │ Component   │  │ Display     │  │ View        │  │ (Analytics/Reports) │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ REST API (HTTP/HTTPS)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (Flask Python)                            │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         API ROUTES (/api/*)                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │  │
│  │  │ /ocr/*      │  │/translate/* │  │ /rag/*      │  │ /health     │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         CORE SERVICES                               │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │    │
│  │  │ OCR Engine  │  │ Translation │  │ Document    │  │ Language   │  │    │
│  │  │ (Google     │  │ Service     │  │ Handler     │  │ Detector   │  │    │
│  │  │  Vision)    │  │(AI4Bharat)  │  │ (PDF Gen)   │  │            │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│   Google Cloud    │   │   AI4Bharat       │   │   PostgreSQL      │
│   Vision API      │   │   (Local Models)  │   │   Database        │
│   (OCR)           │   │   (Translation)   │   │   (Storage)       │
└───────────────────┘   └───────────────────┘   └───────────────────┘
```

### Backend Module Structure

```
backend/
├── app.py                      # Flask application factory
├── config.py                   # Configuration management
├── requirements.txt            # Python dependencies
│
├── routes/                     # API Endpoints
│   ├── ocr_routes.py          # /api/ocr/* - OCR operations
│   ├── translation_routes.py  # /api/translate/* - Translation
│   └── rag_routes.py          # /api/rag/* - Document processing
│
├── ocr/                        # OCR Module
│   ├── lightweight_ocr.py     # Google Vision API integration
│   ├── lightweight_pipeline.py # OCR processing pipeline
│   ├── image_processing.py    # Image preprocessing (OpenCV)
│   └── confidence_scorer.py   # OCR confidence scoring
│
├── translation/                # Translation Module
│   ├── ai4bharat_translator.py # IndicTrans2 integration
│   ├── language_detector.py    # Auto language detection
│   ├── transliterator.py       # Script transliteration
│   └── simple_translator.py    # Dictionary-based fallback
│
├── document/                   # Document Module
│   ├── upload_handler.py      # File upload management
│   ├── pdf_generator.py       # PDF report generation
│   └── rag_document_processor.py # RAG processing
│
└── common/                     # Shared Utilities
    ├── text_cleaner.py        # Text normalization
    ├── response_formatter.py  # API response formatting
    └── performance.py         # Caching & optimization
```

### Frontend Structure

```
frontend/
├── src/
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # Entry point
│   │
│   ├── components/            # UI Components
│   │   ├── ImageUpload.jsx    # Drag-drop file upload
│   │   ├── ProcessingStatus.jsx # Real-time status
│   │   ├── ResultsDisplay.jsx # OCR results viewer
│   │   ├── ComparisonView.jsx # Side-by-side view
│   │   ├── Dashboard.jsx      # Admin analytics
│   │   └── ErrorBoundary.jsx  # Error handling
│   │
│   ├── services/              # API Integration
│   │   └── ocrService.js      # Backend API calls
│   │
│   └── utils/                 # Utilities
│       └── exportUtils.js     # Export to PDF/JSON/CSV
│
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
└── tailwind.config.js         # Tailwind CSS config
```

---

## 📚 Feature Implementation Guide

### Feature 1: Document Upload & Preprocessing

**Purpose**: Accept scanned documents (PDF, images) and prepare them for OCR.

#### Frontend Implementation

```jsx
// components/ImageUpload.jsx
// - Drag-and-drop interface using HTML5 Drag API
// - File validation (type, size)
// - Preview before upload
// - Progress indicator during upload
```

**Key Points:**
- Accept formats: PDF, PNG, JPG, JPEG
- Max file size: 16MB (configurable)
- Client-side validation before upload
- Show upload progress

#### Backend Implementation

```python
# document/upload_handler.py
# - Validate file type and size
# - Generate secure filename
# - Store in uploads/ directory
# - Return file metadata

# Endpoint: POST /api/ocr/upload
```

**Key Points:**
- Use `werkzeug.secure_filename()` for security
- Create unique filenames to prevent conflicts
- Store file metadata for tracking

---

### Feature 2: OCR Text Extraction (Google Vision API)

**Purpose**: Extract text from scanned Urdu/Hindi/English documents.

#### Backend Implementation

```python
# ocr/lightweight_ocr.py

# Step 1: Configure Google Vision
from google.cloud import vision
client = vision.ImageAnnotatorClient()

# Step 2: Send image for OCR
def extract_text(image_bytes):
    image = vision.Image(content=image_bytes)
    response = client.document_text_detection(image=image)
    return response.full_text_annotation.text

# Step 3: Handle multi-language detection
# Google Vision auto-detects Urdu, Hindi, English
```

**Google Vision Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: `land-records-ocr`
3. Enable **Cloud Vision API**
4. Create service account & download JSON key
5. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json"
   ```

**Endpoint**: `POST /api/ocr/process`

**Request:**
```json
{
  "filepath": "/uploads/document.pdf",
  "options": {
    "preprocess": true,
    "detect_language": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "extracted_text": "جموں و کشمیر...",
    "detected_language": "ur",
    "confidence": 0.92,
    "word_count": 150
  }
}
```

---

### Feature 3: Translation (AI4Bharat IndicTrans2)

**Purpose**: Translate Urdu/Hindi text to English for accessibility.

#### Backend Implementation

```python
# translation/ai4bharat_translator.py

from transformers import AutoModelForSeq2SeqLM
from IndicTransToolkit import IndicProcessor, IndicTransTokenizer

# Load model (downloads ~800MB on first run)
model = AutoModelForSeq2SeqLM.from_pretrained(
    "ai4bharat/indictrans2-indic-en-dist-200M"
)
processor = IndicProcessor(inference=True)
tokenizer = IndicTransTokenizer(direction="indic-en")

def translate_urdu_to_english(text):
    # Preprocess
    batch = processor.preprocess_batch([text], src_lang="urd_Arab", tgt_lang="eng_Latn")
    
    # Tokenize
    inputs = tokenizer(batch, return_tensors="pt", padding=True)
    
    # Generate translation
    outputs = model.generate(**inputs, max_length=256)
    
    # Decode
    translated = tokenizer.batch_decode(outputs, skip_special_tokens=True)
    return processor.postprocess_batch(translated)[0]
```

**Supported Languages:**
| Source | Code | Target |
|--------|------|--------|
| Urdu | `urd_Arab` | English |
| Hindi | `hin_Deva` | English |
| Punjabi | `pan_Guru` | English |
| Kashmiri | `kas_Arab` | English |

**Endpoint**: `POST /api/translate/text`

**Request:**
```json
{
  "text": "جموں و کشمیر کی زمین کا ریکارڈ",
  "source_lang": "ur",
  "target_lang": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "original": "جموں و کشمیر کی زمین کا ریکارڈ",
    "translated": "Land record of Jammu and Kashmir",
    "source_lang": "urd_Arab",
    "target_lang": "eng_Latn"
  }
}
```

---

### Feature 4: Land Record Terminology Handling

**Purpose**: Handle domain-specific land record terms correctly.

#### Backend Implementation

```python
# translation/simple_translator.py

LAND_RECORD_TERMS = {
    # Urdu → English
    "جمع بندی": "Jamabandi (Land Revenue Record)",
    "خسرہ نمبر": "Khasra Number (Plot ID)",
    "مالک": "Owner",
    "قابض": "Possessor",
    "رقبہ": "Area",
    "کنال": "Kanal (Unit: 505.857 sq meters)",
    "مرلہ": "Marla (Unit: 25.29 sq meters)",
    "تحصیل": "Tehsil",
    "ضلع": "District",
    "موضع": "Mauza (Village)",
    "مہاجرین": "Muhajir (Refugee) Land",
    
    # Hindi → English
    "जमाबंदी": "Jamabandi (Land Revenue Record)",
    "खसरा": "Khasra Number (Plot ID)",
    "मालिक": "Owner",
}

def apply_domain_terms(translated_text):
    """Post-process to ensure land terms are correctly translated"""
    for term, replacement in LAND_RECORD_TERMS.items():
        translated_text = translated_text.replace(term, replacement)
    return translated_text
```

---

### Feature 5: Structured Data Extraction

**Purpose**: Parse OCR text into structured fields for database storage.

#### Backend Implementation

```python
# document/rag_document_processor.py

import re

def extract_land_record_fields(ocr_text, translated_text):
    """
    Extract structured data from land record text
    """
    record = {
        "khasra_number": None,
        "owner_name": None,
        "owner_name_english": None,
        "area_kanal": None,
        "area_marla": None,
        "tehsil": None,
        "district": None,
        "mauza": None,
        "ownership_type": None,  # Private, Government, Refugee
        "possession_status": None,
        "raw_text": ocr_text,
        "translated_text": translated_text
    }
    
    # Pattern matching for Khasra Number
    khasra_pattern = r'خسرہ\s*نمبر[:\s]*(\d+)'
    match = re.search(khasra_pattern, ocr_text)
    if match:
        record["khasra_number"] = match.group(1)
    
    # Pattern matching for Area
    area_pattern = r'(\d+)\s*کنال\s*(\d+)\s*مرلہ'
    match = re.search(area_pattern, ocr_text)
    if match:
        record["area_kanal"] = int(match.group(1))
        record["area_marla"] = int(match.group(2))
    
    return record
```

---

### Feature 6: PDF Report Generation

**Purpose**: Generate professional PDF reports of translated records.

#### Backend Implementation

```python
# document/pdf_generator.py

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table
from reportlab.lib.styles import getSampleStyleSheet

def generate_land_record_pdf(record_data, output_path):
    """
    Generate PDF report for a land record
    """
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []
    
    # Title
    elements.append(Paragraph("Land Record - Digitized", styles['Title']))
    
    # Data table
    data = [
        ["Field", "Value (Original)", "Value (English)"],
        ["Khasra No.", record_data.get("khasra_number", "N/A"), ""],
        ["Owner", record_data.get("owner_name", ""), record_data.get("owner_name_english", "")],
        ["Area", f"{record_data.get('area_kanal', 0)} Kanal {record_data.get('area_marla', 0)} Marla", ""],
        ["Tehsil", record_data.get("tehsil", ""), ""],
        ["District", record_data.get("district", ""), ""],
    ]
    
    table = Table(data)
    elements.append(table)
    
    doc.build(elements)
    return output_path
```

---

### Feature 7: Batch Processing

**Purpose**: Process multiple documents in a single request.

#### Backend Implementation

```python
# routes/ocr_routes.py

@ocr_bp.route('/batch', methods=['POST'])
def batch_process():
    """Process multiple files in batch"""
    files = request.files.getlist('files')
    results = []
    
    for file in files:
        # Save file
        filepath = save_file(file)
        
        # Process OCR
        ocr_result = ocr_pipeline.process(filepath)
        
        # Translate
        translated = translate(ocr_result['text'])
        
        results.append({
            "filename": file.filename,
            "ocr_text": ocr_result['text'],
            "translated": translated,
            "confidence": ocr_result['confidence']
        })
    
    return jsonify({"success": True, "results": results})
```

**Endpoint**: `POST /api/ocr/batch`

---

### Feature 8: Admin Dashboard & Analytics

**Purpose**: Track processing statistics and system health.

#### Frontend Implementation

```jsx
// components/Dashboard.jsx
// Displays:
// - Total documents processed
// - Success rate
// - Average processing time
// - Language distribution
// - Recent activity log
```

#### Backend Implementation

```python
# Add to routes/ocr_routes.py

@ocr_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get processing statistics"""
    return jsonify({
        "total_processed": get_total_count(),
        "success_rate": calculate_success_rate(),
        "avg_processing_time": get_avg_time(),
        "language_distribution": {
            "urdu": 45,
            "hindi": 30,
            "english": 25
        }
    })
```

---

## 🗄️ Database Design

### PostgreSQL Schema

```sql
-- Farmers Table (Unique Farmer Registry)
CREATE TABLE farmers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aadhaar_hash VARCHAR(64) UNIQUE,  -- Hashed for privacy
    name_local VARCHAR(255),           -- Name in original script
    name_english VARCHAR(255),         -- Transliterated name
    father_name VARCHAR(255),
    address TEXT,
    tehsil VARCHAR(100),
    district VARCHAR(100),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Land Parcels Table (Unique Farm Registry)
CREATE TABLE land_parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    khasra_number VARCHAR(50) NOT NULL,
    mauza VARCHAR(100),               -- Village name
    tehsil VARCHAR(100),
    district VARCHAR(100),
    area_kanal DECIMAL(10,2),
    area_marla DECIMAL(10,2),
    area_sqm DECIMAL(15,2),           -- Calculated
    land_type VARCHAR(50),            -- Agricultural, Residential, etc.
    ownership_status VARCHAR(50),     -- Clear, Disputed, Refugee, etc.
    geo_coordinates POINT,            -- For GIS integration
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(khasra_number, mauza, tehsil, district)
);

-- Farmer-Parcel Relationship (Many-to-Many)
CREATE TABLE farmer_parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES farmers(id),
    parcel_id UUID REFERENCES land_parcels(id),
    ownership_type VARCHAR(50),       -- Owner, Tenant, Lessee
    ownership_share DECIMAL(5,2),     -- Percentage (for shared ownership)
    possession_status VARCHAR(50),    -- In possession, Leased out
    start_date DATE,
    end_date DATE,                    -- NULL if current
    source_document_id UUID,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(farmer_id, parcel_id, ownership_type)
);

-- Scanned Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255),
    original_path TEXT,
    file_type VARCHAR(10),
    file_size_kb INTEGER,
    ocr_text TEXT,
    translated_text TEXT,
    detected_language VARCHAR(10),
    ocr_confidence DECIMAL(5,2),
    processing_status VARCHAR(20),    -- Pending, Processed, Failed
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log for Tracking Changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(50),
    record_id UUID,
    action VARCHAR(10),               -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    user_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_parcels_khasra ON land_parcels(khasra_number);
CREATE INDEX idx_parcels_tehsil ON land_parcels(tehsil, district);
CREATE INDEX idx_farmer_parcels_farmer ON farmer_parcels(farmer_id);
CREATE INDEX idx_documents_status ON documents(processing_status);
```

### Database Connection (Python)

```python
# Add to backend/config.py

# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://user:pass@localhost/landrecords')

# Add to requirements.txt
# psycopg2-binary==2.9.9
# sqlalchemy==2.0.23
```

---

## ☁️ Cloud Infrastructure

### Option 1: Google Cloud Platform (Recommended)

| Service | Purpose | Estimated Cost |
|---------|---------|----------------|
| **Compute Engine** (e2-medium) | Backend API | ~$25/month |
| **Cloud Vision API** | OCR | 1000 free, then $1.50/1000 |
| **Cloud SQL (PostgreSQL)** | Database | ~$15/month (db-f1-micro) |
| **Cloud Storage** | Document storage | ~$0.02/GB/month |
| **Cloud Run** | Serverless option | Pay per request |

**Recommended Setup:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                         │
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐ │
│  │ Cloud Run    │   │ Cloud SQL    │   │ Cloud Storage        │ │
│  │ (Backend)    │◄──┤ (PostgreSQL) │   │ (Documents)          │ │
│  └──────┬───────┘   └──────────────┘   └──────────────────────┘ │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────┐                                               │
│  │ Cloud Vision │                                               │
│  │ API          │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Option 2: AWS

| Service | Purpose | Estimated Cost |
|---------|---------|----------------|
| **EC2** (t3.medium) | Backend API | ~$30/month |
| **RDS** (PostgreSQL) | Database | ~$15/month |
| **S3** | Document storage | ~$0.023/GB/month |
| **CloudFront** | CDN for frontend | ~$0.085/GB |

### Option 3: Self-Hosted (Development)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Local Development                             │
│                                                                  │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────────┐ │
│  │ Docker       │   │ PostgreSQL   │   │ Local Storage        │ │
│  │ (Backend +   │   │ (Container)  │   │ (./uploads)          │ │
│  │  Frontend)   │   │              │   │                      │ │
│  └──────────────┘   └──────────────┘   └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Environment Variables

Create `.env` file in backend/:

```bash
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this

# Google Cloud (Required for OCR)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
GOOGLE_CLOUD_API_KEY=your-api-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/landrecords

# AI4Bharat (Optional - auto-downloads models)
AI4BHARAT_CACHE_DIR=./models/ai4bharat
AI4BHARAT_DEVICE=auto  # auto, cpu, cuda

# File Upload
MAX_CONTENT_LENGTH=16777216  # 16MB
UPLOAD_FOLDER=./uploads
```

---

## 🚀 Step-by-Step Setup Guide

### Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 18.0 or higher
- **PostgreSQL**: 14+ (optional for production)
- **Google Cloud Account**: For Vision API

### Step 1: Clone Repository

```bash
git clone https://github.com/Bhanu-partap-13/LandOwners.git
cd LandOwners
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install AI4Bharat toolkit
pip install git+https://github.com/VarunGumma/IndicTransToolkit.git
```

### Step 3: Configure Google Vision API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: `land-records-ocr`
3. Enable **Cloud Vision API**
4. Go to **APIs & Services** → **Credentials**
5. Create **Service Account** → Download JSON key
6. Set environment variable:
   ```bash
   # Windows
   set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account.json
   
   # Linux/Mac
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
   ```

### Step 4: Create Environment File

```bash
# In backend/ directory, create .env file:

FLASK_ENV=development
SECRET_KEY=dev-secret-key-change-in-production
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
AI4BHARAT_DEVICE=auto
```

### Step 5: Start Backend

```bash
# In backend/ directory
python app.py

# Server runs at http://127.0.0.1:5000
```

### Step 6: Frontend Setup

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs at http://localhost:5173
```

### Step 7: Verify Installation

1. Open http://localhost:5173 in browser
2. Check API health: http://localhost:5000/api/health
3. Upload a test document
4. Verify OCR and translation work

---

## 📡 API Reference

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "OCR Backend (AI4Bharat)",
  "mode": "lightweight",
  "ai4bharat_available": true,
  "google_vision_configured": true,
  "backends_available": ["ai4bharat", "google_vision", "dictionary"]
}
```

### Upload File

```
POST /api/ocr/upload
Content-Type: multipart/form-data

file: <binary>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "document_123.pdf",
    "filepath": "/uploads/document_123.pdf",
    "file_info": {
      "size": 1024000,
      "type": "pdf",
      "pages": 3
    }
  }
}
```

### Process OCR

```
POST /api/ocr/process
Content-Type: application/json

{
  "filepath": "/uploads/document_123.pdf",
  "options": {
    "preprocess": true,
    "detect_language": true
  }
}
```

### Translate Text

```
POST /api/translate/text
Content-Type: application/json

{
  "text": "جموں و کشمیر",
  "source_lang": "ur",
  "target_lang": "en"
}
```

### Translate Document

```
POST /api/translate/document
Content-Type: multipart/form-data

file: <binary>
```

---

## 🐳 Deployment Guide

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access:
# Frontend: http://localhost
# Backend: http://localhost:5000
```

### Production Checklist

- [ ] Set `FLASK_ENV=production`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure PostgreSQL database
- [ ] Set up SSL/HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up logging and monitoring
- [ ] Configure backup for uploaded files
- [ ] Set up rate limiting

---

## 🔧 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Google Vision not configured" | Missing API credentials | Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable |
| "AI4Bharat model not found" | First-time model download | Wait for ~800MB model download, ensure internet connection |
| "OCR returned empty text" | Poor image quality | Preprocess image, ensure minimum 300 DPI |
| "Translation failed" | Unsupported language | Check if language code is in supported list |
| "File too large" | Exceeds 16MB limit | Compress file or adjust `MAX_CONTENT_LENGTH` |
| "CORS error" | Frontend-backend mismatch | Add frontend URL to `CORS_ORIGINS` in config |

---

## 📞 Support & Contributing

- **Issues**: [GitHub Issues](https://github.com/Bhanu-partap-13/LandOwners/issues)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)
- **Documentation**: See `/docs` folder

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **AI4Bharat** - IndicTrans2 translation models
- **Google Cloud** - Vision API for OCR
- **Government of India** - AgriStack initiative
- **Open Source Community** - Flask, React, and all dependencies

---

*Built for the AgriStack Implementation Initiative - Digitizing Land Records in Jammu & Kashmir*
