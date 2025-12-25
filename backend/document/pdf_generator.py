from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
import textwrap

def generate_ocr_pdf(ocr_text, output_path, metadata=None):
    """
    Generate PDF from OCR extracted text with proper formatting
    
    Args:
        ocr_text: Extracted text from OCR
        output_path: Path to save the PDF
        metadata: Optional dict with filename, language, confidence, etc.
    
    Returns:
        Path to generated PDF
    """
    doc = SimpleDocTemplate(output_path, pagesize=A4,
                           topMargin=0.75*inch, bottomMargin=0.75*inch,
                           leftMargin=0.75*inch, rightMargin=0.75*inch)
    
    styles = getSampleStyleSheet()
    elements = []
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor='#292929',
        spaceAfter=12,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    metadata_style = ParagraphStyle(
        'Metadata',
        parent=styles['Normal'],
        fontSize=9,
        textColor='#666666',
        spaceAfter=6,
        alignment=TA_LEFT
    )
    
    content_style = ParagraphStyle(
        'Content',
        parent=styles['BodyText'],
        fontSize=11,
        leading=16,
        alignment=TA_JUSTIFY,
        spaceAfter=12
    )
    
    # Header
    elements.append(Paragraph("OCR Extracted Document", title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Metadata section
    if metadata:
        elements.append(Paragraph("<b>Document Information</b>", styles['Heading2']))
        elements.append(Spacer(1, 0.1*inch))
        
        if metadata.get('filename'):
            elements.append(Paragraph(f"<b>Original File:</b> {metadata['filename']}", metadata_style))
        if metadata.get('detected_language'):
            elements.append(Paragraph(f"<b>Detected Language:</b> {metadata['detected_language']}", metadata_style))
        if metadata.get('confidence'):
            elements.append(Paragraph(f"<b>OCR Confidence:</b> {metadata['confidence']:.1f}%", metadata_style))
        
        elements.append(Paragraph(f"<b>Processed Date:</b> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", metadata_style))
        elements.append(Spacer(1, 0.3*inch))
    
    # Content section
    elements.append(Paragraph("<b>Extracted Text</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.1*inch))
    
    # Add extracted text with line breaks preserved
    if ocr_text:
        # Split text into paragraphs and add each
        paragraphs = ocr_text.split('\n')
        for para in paragraphs:
            if para.strip():  # Skip empty lines
                # Escape special characters for reportlab
                para = para.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                elements.append(Paragraph(para, content_style))
    else:
        elements.append(Paragraph("<i>No text extracted</i>", metadata_style))
    
    # Build PDF
    doc.build(elements)
    return output_path

def generate_land_record_pdf(record_data, output_path):
    """
    Generate PDF report for a land record (legacy function)
    """
    from reportlab.platypus import Table
    
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
