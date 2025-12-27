# 🌾 AgriStack OCR: Digital Land Registry & Dispute Management System

A comprehensive platform for digitizing land records, managing disputed lands, and resolving partition-era ownership issues across India and Pakistan. Built with React, Flask, and powered by Google Vision AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)
![Flask](https://img.shields.io/badge/flask-3.1.2-green.svg)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation Guide](#-installation-guide-for-beginners)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**AgriStack OCR** addresses critical challenges in land administration:

- **70%+ of land records** exist only in paper format (Urdu, Hindi, Punjabi)
- **1947 Partition disputes**: 14.5 million displaced people with unresolved land claims
- **Multi-parcel farmers**: No centralized system to track ownership across districts
- **Language barriers**: Documents inaccessible to non-native speakers

### What This System Does

1. **Digitizes land records** using AI-powered OCR (Google Vision API)
2. **Translates documents** between Urdu, Hindi, Punjabi, and English
3. **Manages disputed lands** with interactive map visualization
4. **Tracks partition-era claims** (refugee/muhajireen land disputes)
5. **Generates formatted PDFs** with AI-powered summaries (Google Gemini)
6. **Provides centralized database** for farmers with multiple parcels

---

## ✨ Key Features

### 🔍 Intelligent OCR
- **Google Vision API** for handwritten & printed text
- **Multi-language support**: Urdu, Hindi, Punjabi, English
- **PDF generation** with formatted output
- **Batch processing** for large-scale digitization

### 🌐 Multi-Language Translation
- **AI4Bharat IndicTrans2** for Indic languages
- **Legal terminology preservation**
- **4 languages**: Urdu ↔ Hindi ↔ Punjabi ↔ English

### 🗺️ Disputed Lands Management
- **Interactive OpenStreetMap** visualization
- **Partition-era dispute tracking** (1947 refugee claims)
- **Multi-claimant support** with CNIC verification
- **Court case management** with hearing dates
- **Geographic filtering** by district/tehsil

### 🤖 AI-Powered Analysis
- **Document summarization** (5 types: brief, detailed, key points, legal, action items)
- **Q&A functionality** using Google Gemini
- **Smart data extraction** from complex documents

### 👨‍🌾 Farmer Dashboard
- **Centralized view** of all land parcels (multi-district)
- **Document repository** with search & filters
- **Real-time processing** status
- **Mobile-responsive** design

---

## 🛠️ Tech Stack

### Frontend
- **React 18.x** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Leaflet** - Map visualization
- **Framer Motion** - Animations

### Backend
- **Python 3.11** - Core language
- **Flask 3.1.2** - Web framework
- **SQLAlchemy 2.0** - Database ORM
- **PostgreSQL** (via Supabase) - Production database
- **SQLite** - Development database

### AI & APIs
- **Google Cloud Vision API** - OCR
- **Google Gemini AI** - Document analysis
- **AI4Bharat IndicTrans2** - Translation
- **OpenStreetMap** - Map tiles

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your computer:

### Required Software

| Software | Version | Download Link | Purpose |
|----------|---------|---------------|---------|
| **Python** | 3.11 or higher | [python.org](https://www.python.org/downloads/) | Backend runtime |
| **Node.js** | 18.0 or higher | [nodejs.org](https://nodejs.org/) | Frontend build tool |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) | Version control |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com/) | Code editor (recommended) |

### API Keys (Required)

1. **Google Vision API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select existing
   - Enable "Cloud Vision API"
   - Create API Key
   - Copy the key (format: `AIzaSy...`)

2. **Google Gemini API Key** (for AI features)
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Get API Key"
   - Copy the key

3. **Supabase Account** (optional - for production)
   - Sign up at [supabase.com](https://supabase.com)
   - Create a new project
   - Get URL and API key from Project Settings

---

## 🚀 Installation Guide (For Beginners)

Follow these steps **exactly** as written. Each command is explained.

### Step 1: Install Python

1. **Download Python 3.11+** from [python.org](https://www.python.org/downloads/)
2. **During installation**:
   - ✅ Check "Add Python to PATH" (VERY IMPORTANT!)
   - Click "Install Now"
3. **Verify installation**:
   ```powershell
   # Open PowerShell (Windows) or Terminal (Mac/Linux)
   python --version
   # Should show: Python 3.11.x
   ```

### Step 2: Install Node.js

1. **Download Node.js 18+** from [nodejs.org](https://nodejs.org/)
2. **Run the installer** (just click "Next" through all options)
3. **Verify installation**:
   ```powershell
   node --version
   # Should show: v18.x.x or higher
   
   npm --version
   # Should show: 9.x.x or higher
   ```

### Step 3: Install Git

1. **Download Git** from [git-scm.com](https://git-scm.com/)
2. **Install with default settings**
3. **Verify installation**:
   ```powershell
   git --version
   # Should show: git version 2.x.x
   ```

### Step 4: Download the Project

1. **Open PowerShell/Terminal**
2. **Navigate to where you want the project** (e.g., Desktop):
   ```powershell
   # Windows
   cd C:\Users\YourUsername\Desktop
   
   # Mac/Linux
   cd ~/Desktop
   ```

3. **Clone the repository**:
   ```powershell
   git clone https://github.com/ronitrai27/OCR_python_Google-Vison.git
   cd OCR_python_Google-Vison
   ```

   **OR if you downloaded a ZIP file**:
   - Extract the ZIP
   - Open PowerShell in that folder
   - Run: `cd OCR_python_Google-Vison`

### Step 5: Setup Backend

1. **Navigate to backend folder**:
   ```powershell
   cd backend
   ```

2. **Create a virtual environment** (isolated Python environment):
   ```powershell
   # Windows
   python -m venv venv
   
   # Mac/Linux
   python3 -m venv venv
   ```

3. **Activate the virtual environment**:
   ```powershell
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   
   # Windows CMD
   venv\Scripts\activate.bat
   
   # Mac/Linux
   source venv/bin/activate
   ```
   
   **You should see `(venv)` at the start of your command line**

4. **Install Python dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```
   
   ⏳ **This will take 2-5 minutes**. You'll see lots of packages being installed.

5. **Create `.env` file**:
   ```powershell
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

6. **Edit the `.env` file**:
   - Open `.env` in Notepad or VS Code
   - Add your API keys:
   ```env
   GOOGLE_VISION_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   GOOGLE_GEMINI_API_KEY=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
   
   # Optional (for production):
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=your-key-here
   DATABASE_URL=postgresql://...
   ```
   - **Save the file**

### Step 6: Setup Frontend

1. **Open a NEW PowerShell/Terminal window** (keep backend terminal open)

2. **Navigate to frontend folder**:
   ```powershell
   cd C:\Users\YourUsername\Desktop\OCR_python_Google-Vison\frontend
   # (Adjust path to match your location)
   ```

3. **Install Node dependencies**:
   ```powershell
   npm install
   ```
   
   ⏳ **This will take 3-7 minutes**. Lots of packages will be downloaded.

4. **Create frontend `.env` file**:
   ```powershell
   # Windows
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

---

## ⚙️ Configuration

### Enable Google Vision API

**IMPORTANT**: Your API key won't work until you enable the service!

1. Go to: https://console.cloud.google.com/apis/library/vision.googleapis.com
2. **Select your project** from the dropdown (top bar)
3. Click the blue **"ENABLE"** button
4. Wait 1-2 minutes for activation
5. **Enable billing** (required, but first 1000 requests/month are FREE)

### Generate Sample Data (Optional)

To test the system with realistic data:

```powershell
# In backend folder (with venv activated)
python generate_disputed_lands_data.py
```

This creates 50 sample disputed land records with map coordinates.

---

## ▶️ Running the Application

### Start Backend Server

1. **Open PowerShell in backend folder**
2. **Activate virtual environment**:
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```
3. **Run the server**:
   ```powershell
   python app.py
   ```
4. **You should see**:
   ```
   * Running on http://127.0.0.1:5000
   ✓ Google Vision API Key loaded
   ```

**Keep this terminal window open!**

### Start Frontend Server

1. **Open a NEW PowerShell in frontend folder**
2. **Run the dev server**:
   ```powershell
   npm run dev
   ```
3. **You should see**:
   ```
   ➜  Local:   http://localhost:5173/
   ```

4. **Open your browser** and go to: **http://localhost:5173**

🎉 **The application should now be running!**

---

## 📖 Usage Guide

### 1. OCR Document Processing

1. **Click "Dashboard"** in the navbar (or login first)
2. **Go to "OCR Scanner" tab**
3. **Upload a document**:
   - Drag & drop OR click "Browse Files"
   - Supported: PDF, JPG, PNG
4. **Toggle "Use Google Vision API"** (recommended for Urdu/Hindi)
5. **Click "Process Document"**
6. **Wait for processing** (10-30 seconds)
7. **View results**:
   - Extracted text
   - Confidence score
   - Detected language
8. **Actions**:
   - 📄 **Generate PDF** - Creates formatted document
   - 💾 **Save to Database** - Permanent storage
   - 🤖 **Get AI Summary** - Gemini-powered analysis
   - 💬 **Ask Question** - Q&A about document

### 2. Translation

1. **Go to "Translation" tab**
2. **Upload document** (Urdu, Hindi, Punjabi)
3. **Select languages**:
   - Source: Urdu (auto-detected)
   - Target: English
4. **Click "Translate"**
5. **View side-by-side comparison**
6. **Download translated PDF**

### 3. Disputed Lands Management

1. **Click "Disputed Lands"** in navbar
2. **Toggle between**:
   - 🗺️ **Map View** - Interactive OpenStreetMap
   - 📊 **List View** - Sortable table
3. **Filter by**:
   - District
   - Tehsil
   - Dispute Type (Refugee, Muhajireen, Overlapping, etc.)
   - Status (Pending, Court Hearing, Resolved)
4. **Click on marker/row** to view full details:
   - Location (Khasra, Mauza, Tehsil)
   - All claimants with CNIC
   - Historical ownership
   - Court case information
   - Hearing dates

### 4. Farmer Registration

1. **Go to "Farmer Registration"**
2. **Fill in details**:
   - CNIC (National ID)
   - Name, Father's Name
   - Contact (Phone, Address)
   - Land parcels (can add multiple)
3. **Submit**
4. **View registered farmers** in dashboard

---

## 📁 Project Structure

```
OCR_python_Google-Vison/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── config.py              # Configuration & environment variables
│   ├── models.py              # Database models (SQLAlchemy)
│   ├── extensions.py          # Flask extensions (CORS, DB)
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (API keys)
│   │
│   ├── ocr/                   # OCR processing modules
│   │   ├── google_vision_ocr.py    # Google Vision API integration
│   │   ├── lightweight_ocr.py      # Tesseract-based OCR
│   │   ├── image_processing.py     # Image preprocessing
│   │   └── confidence_scorer.py    # Accuracy calculation
│   │
│   ├── translation/           # Translation services
│   │   ├── ai4bharat_translator.py # Indic language translation
│   │   ├── language_detector.py    # Auto-detect language
│   │   └── transliterator.py       # Script conversion
│   │
│   ├── document/              # Document handling
│   │   ├── pdf_generator.py        # PDF creation
│   │   ├── upload_handler.py       # File uploads
│   │   └── rag_document_processor.py # RAG for Q&A
│   │
│   ├── common/                # Shared utilities
│   │   ├── gemini_ai.py            # Google Gemini integration
│   │   ├── text_cleaner.py         # Text normalization
│   │   └── supabase_client.py      # Database client
│   │
│   └── routes/                # API endpoints
│       ├── ocr_routes.py           # OCR endpoints
│       ├── translation_routes.py   # Translation endpoints
│       ├── disputed_lands_routes.py # Disputed lands API
│       ├── rag_routes.py           # RAG/Q&A endpoints
│       └── newsletter_routes.py    # Newsletter subscription
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx            # Main application component
│   │   ├── main.jsx           # Entry point
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── DashboardPage.jsx      # Main dashboard (OCR, Translation)
│   │   │   ├── DisputedLandsPage.jsx  # Disputed lands with map
│   │   │   ├── FarmerRegistrationPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   │
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ImageUpload.jsx
│   │   │   └── GuidedTour.jsx
│   │   │
│   │   └── services/          # API service layer
│   │       └── ocrService.js  # Backend API calls
│   │
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
│
├── PPT.md                     # Comprehensive project presentation
├── PROJECT_STATUS.md          # Current status & issues
├── OCR_ENHANCEMENT_GUIDE.md   # Implementation guide
└── README.md                  # This file
```

---

## 🐛 Troubleshooting

### Backend Issues

#### **Error: "ModuleNotFoundError: No module named 'flask'"**
**Solution**:
```powershell
# Make sure virtual environment is activated (you should see (venv))
pip install -r requirements.txt
```

#### **Error: "Vision API error: Requests to this API are blocked"**
**Solution**:
1. Go to https://console.cloud.google.com/apis/library/vision.googleapis.com
2. Click "ENABLE"
3. Enable billing (first 1000 requests are free)
4. Wait 2 minutes, then try again

#### **Error: "GOOGLE_VISION_API_KEY not found"**
**Solution**:
1. Open `backend/.env`
2. Add line: `GOOGLE_VISION_API_KEY=your-actual-key-here`
3. Save file
4. Restart backend server

#### **Error: "Port 5000 already in use"**
**Solution**:
```powershell
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Frontend Issues

#### **Error: "npm: command not found"**
**Solution**:
- Reinstall Node.js from [nodejs.org](https://nodejs.org/)
- Make sure to check "Add to PATH" during installation
- Restart PowerShell/Terminal

#### **Error: "Failed to fetch" when uploading documents**
**Solution**:
- Ensure backend is running (check http://127.0.0.1:5000 in browser)
- Check CORS configuration in `backend/app.py`
- Try restarting both servers

#### **Error: "Module not found" during npm install**
**Solution**:
```powershell
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

#### **Error: "No such table: disputed_land"**
**Solution**:
```powershell
# Recreate database
cd backend
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

#### **Generate sample data**:
```powershell
python generate_disputed_lands_data.py
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Commit with clear messages**:
   ```bash
   git commit -m "feat: Add PDF export functionality"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request** on GitHub

### Commit Message Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/ronitrai27/OCR_python_Google-Vison/issues)
- **Email**: your-email@example.com
- **Documentation**: See `PPT.md` for comprehensive project overview

---

## 🙏 Acknowledgments

- **Google Cloud Vision API** - OCR engine
- **Google Gemini AI** - Document analysis
- **AI4Bharat** - Indic language translation
- **OpenStreetMap** - Map data
- **React Community** - UI framework
- **Flask Team** - Backend framework

---

## 📊 Project Stats

- **Lines of Code**: ~15,000+
- **Languages**: Python, TypeScript, JavaScript
- **API Endpoints**: 25+
- **Database Tables**: 5
- **Supported Languages**: 4 (Urdu, Hindi, Punjabi, English)
- **Map Markers**: Unlimited with clustering

---

## 🗺️ Roadmap

### ✅ Completed (v1.0)
- OCR processing with Google Vision API
- Multi-language translation
- Disputed lands management with map
- Farmer registration & dashboard
- PDF generation
- AI-powered summarization

### 🚧 In Progress (v1.1)
- Mobile app (React Native)
- Offline OCR mode
- WhatsApp bot integration

### 📅 Planned (v2.0)
- Blockchain-based land registry
- Drone boundary mapping
- Carbon credit integration
- Multilingual voice commands

---

## 💡 Quick Tips

1. **Always activate the virtual environment** before running backend
2. **Use Google Vision API for Urdu/Hindi** documents (better accuracy)
3. **Generate sample data** to test disputed lands features
4. **Check backend logs** if frontend shows errors
5. **Keep API keys secret** - never commit `.env` files to Git
6. **Use VS Code** with Python & ESLint extensions for best experience

---

**Built with ❤️ for farmers and land administrators across South Asia**
