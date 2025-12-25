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
