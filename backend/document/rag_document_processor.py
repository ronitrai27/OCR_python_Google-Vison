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
