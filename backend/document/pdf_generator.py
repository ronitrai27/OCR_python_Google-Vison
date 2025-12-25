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
