from extensions import db
from datetime import datetime
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    filename = db.Column(db.String(255))
    original_path = db.Column(db.Text)
    pdf_path = db.Column(db.Text)  # Generated PDF path
    file_type = db.Column(db.String(10))
    file_size_kb = db.Column(db.Integer)
    ocr_text = db.Column(db.Text)
    translated_text = db.Column(db.Text)
    detected_language = db.Column(db.String(10))
    ocr_confidence = db.Column(db.Float)
    ai_summary = db.Column(db.Text)  # Gemini AI summary
    processing_status = db.Column(db.String(20), default='pending')  # pending, processed, failed
    processing_time_ms = db.Column(db.Integer)  # Processing time in milliseconds
    khasra_number = db.Column(db.String(50))
    farmer_name = db.Column(db.String(255))
    district = db.Column(db.String(100))
    tehsil = db.Column(db.String(100))
    is_saved = db.Column(db.Boolean, default=False)  # Permanently saved flag
    notes = db.Column(db.Text)
    tags = db.Column(db.String(500))
    processed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_path': self.original_path,
            'pdf_path': self.pdf_path,
            'file_type': self.file_type,
            'detected_language': self.detected_language,
            'ocr_text': self.ocr_text,
            'translated_text': self.translated_text,
            'ai_summary': self.ai_summary,
            'ocr_confidence': self.ocr_confidence,
            'processing_status': self.processing_status,
            'processing_time_ms': self.processing_time_ms,
            'khasra_number': self.khasra_number,
            'farmer_name': self.farmer_name,
            'district': self.district,
            'tehsil': self.tehsil,
            'is_saved': self.is_saved,
            'notes': self.notes,
            'tags': self.tags,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Farmer(db.Model):
    __tablename__ = 'farmers'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    name_local = db.Column(db.String(255))
    name_english = db.Column(db.String(255))
    father_name = db.Column(db.String(255))
    address = db.Column(db.Text)
    tehsil = db.Column(db.String(100))
    district = db.Column(db.String(100))
    phone = db.Column(db.String(15))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name_local': self.name_local,
            'name_english': self.name_english,
            'father_name': self.father_name,
            'address': self.address,
            'tehsil': self.tehsil,
            'district': self.district,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class LandParcel(db.Model):
    __tablename__ = 'land_parcels'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    khasra_number = db.Column(db.String(50), nullable=False)
    mauza = db.Column(db.String(100))
    tehsil = db.Column(db.String(100))
    district = db.Column(db.String(100))
    area_kanal = db.Column(db.Float)
    area_marla = db.Column(db.Float)
    land_type = db.Column(db.String(50))
    ownership_status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'khasra_number': self.khasra_number,
            'mauza': self.mauza,
            'tehsil': self.tehsil,
            'district': self.district,
            'area_kanal': self.area_kanal,
            'area_marla': self.area_marla,
            'land_type': self.land_type,
            'ownership_status': self.ownership_status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class DisputedLand(db.Model):
    __tablename__ = 'disputed_lands'
    
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    khasra_number = db.Column(db.String(50), nullable=False)
    mauza = db.Column(db.String(100))
    tehsil = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    
    # Dispute Details
    dispute_type = db.Column(db.String(50))  # refugee_claim, muhajireen_claim, redistributed, overlapping_ownership, inheritance
    dispute_status = db.Column(db.String(30), default='under_review')  # under_review, resolved, pending_court, closed
    dispute_description = db.Column(db.Text)
    
    # Multiple Claimants (stored as JSON)
    claimants = db.Column(db.JSON)  # [{"name": "...", "father_name": "...", "claim_type": "..."}]
    
    # Location Data
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    
    # Land Details
    area_kanal = db.Column(db.Float)
    area_marla = db.Column(db.Float)
    land_type = db.Column(db.String(50))
    
    # Historical Context
    historical_owner = db.Column(db.String(255))  # Pre-partition owner
    partition_impact = db.Column(db.Boolean, default=False)  # True if affected by 1947 partition
    redistribution_year = db.Column(db.Integer)  # Year of land redistribution if applicable
    
    # Case Management
    case_number = db.Column(db.String(100))
    filed_date = db.Column(db.Date)
    last_hearing_date = db.Column(db.Date)
    next_hearing_date = db.Column(db.Date)
    court_jurisdiction = db.Column(db.String(100))
    
    # Supporting Documents
    supporting_docs = db.Column(db.JSON)  # [{"type": "...", "url": "..."}]
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'khasra_number': self.khasra_number,
            'mauza': self.mauza,
            'tehsil': self.tehsil,
            'district': self.district,
            'dispute_type': self.dispute_type,
            'dispute_status': self.dispute_status,
            'dispute_description': self.dispute_description,
            'claimants': self.claimants or [],
            'latitude': self.latitude,
            'longitude': self.longitude,
            'area_kanal': self.area_kanal,
            'area_marla': self.area_marla,
            'land_type': self.land_type,
            'historical_owner': self.historical_owner,
            'partition_impact': self.partition_impact,
            'redistribution_year': self.redistribution_year,
            'case_number': self.case_number,
            'filed_date': self.filed_date.isoformat() if self.filed_date else None,
            'last_hearing_date': self.last_hearing_date.isoformat() if self.last_hearing_date else None,
            'next_hearing_date': self.next_hearing_date.isoformat() if self.next_hearing_date else None,
            'court_jurisdiction': self.court_jurisdiction,
            'supporting_docs': self.supporting_docs or [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'resolved_at': self.resolved_at.isoformat() if self.resolved_at else None
        }

class ProcessingStats(db.Model):
    __tablename__ = 'processing_stats'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, default=datetime.utcnow().date, unique=True)
    documents_processed = db.Column(db.Integer, default=0)
    documents_failed = db.Column(db.Integer, default=0)
    total_processing_time_ms = db.Column(db.Integer, default=0)
    urdu_count = db.Column(db.Integer, default=0)
    hindi_count = db.Column(db.Integer, default=0)
    english_count = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            'date': self.date.isoformat() if self.date else None,
            'documents_processed': self.documents_processed,
            'documents_failed': self.documents_failed,
            'total_processing_time_ms': self.total_processing_time_ms,
            'urdu_count': self.urdu_count,
            'hindi_count': self.hindi_count,
            'english_count': self.english_count
        }
