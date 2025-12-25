# Comprehensive Land Record Terminology Dictionary for Jammu & Kashmir
# Covers Urdu, Hindi, and regional terms used in land records

LAND_RECORD_TERMS = {
    # ===========================================
    # URDU → ENGLISH (Primary Land Record Terms)
    # ===========================================
    
    # Document Types
    "جمع بندی": "Jamabandi (Land Revenue Record)",
    "فرد": "Fard (Land Extract Document)",
    "انتقال": "Intiqal (Mutation/Transfer Record)",
    "گردوری": "Girdawari (Crop Inspection Record)",
    "سجرہ": "Shajra (Village Map)",
    "خطونی": "Khatoni (Ownership Record)",
    "لال کتاب": "Lal Kitab (Red Book/Village Register)",
    
    # Land Identification
    "خسرہ نمبر": "Khasra Number (Plot ID)",
    "خسرہ": "Khasra (Plot)",
    "کھاتہ نمبر": "Khata Number (Account Number)",
    "موضع": "Mauza (Village)",
    "پٹواری حلقہ": "Patwari Halqa (Revenue Circle)",
    "تحصیل": "Tehsil (Sub-district)",
    "ضلع": "District",
    "صوبہ": "Province/State",
    
    # Ownership & Possession
    "مالک": "Owner (Malik)",
    "قابض": "Possessor (Qabiz)",
    "مالکان": "Owners (Plural)",
    "حقدار": "Rightful Claimant",
    "وارث": "Heir/Inheritor",
    "وراثت": "Inheritance",
    "ہبہ": "Gift (Hiba)",
    "بیع": "Sale (Bai)",
    "رہن": "Mortgage (Rahn)",
    "پٹہ": "Lease (Patta)",
    "کرایہ دار": "Tenant",
    "مستاجر": "Lessee",
    "مجرا": "Lessor",
    
    # Land Measurement Units (J&K Specific)
    "کنال": "Kanal (505.857 sq meters)",
    "مرلہ": "Marla (25.29 sq meters)",
    "رقبہ": "Area (Raqba)",
    "بیگھہ": "Bigha (Land Unit)",
    "بسوانسی": "Biswansi (1/20 Biswa)",
    "بسوا": "Biswa (1/20 Bigha)",
    "ایکڑ": "Acre",
    "ہیکٹر": "Hectare",
    "گز": "Gaz/Yard",
    "فٹ": "Foot/Feet",
    
    # Land Types
    "زرعی زمین": "Agricultural Land",
    "بنجر": "Barren Land",
    "آباد": "Cultivated/Inhabited",
    "غیر آباد": "Uncultivated",
    "چراگاہ": "Grazing Land",
    "باغ": "Orchard",
    "کھلیان": "Threshing Floor",
    "گھر": "House/Dwelling",
    "رہائشی": "Residential",
    "تجارتی": "Commercial",
    "صنعتی": "Industrial",
    "شاملات": "Common Land",
    "سرکاری زمین": "Government Land",
    
    # Administrative Terms
    "مہاجرین": "Muhajir (Refugee) Land",
    "پناہ گزین": "Refugee",
    "کسٹوڈین": "Custodian Property",
    "منتقلی": "Transfer",
    "تقسیم": "Partition",
    "اکتشا": "Consolidation",
    "آباد کار": "Settler/Cultivator",
    "نمبردار": "Numberdar (Village Head)",
    "لمبردار": "Lambardar (Revenue Collector)",
    "پٹواری": "Patwari (Village Record Keeper)",
    "تحصیلدار": "Tehsildar (Revenue Officer)",
    "ڈی سی": "DC (Deputy Commissioner)",
    
    # Revenue Terms
    "مالیہ": "Land Revenue",
    "لگان": "Rent/Tax",
    "واجب الارض": "Land Dues",
    "بقایا": "Arrears",
    "چھوٹ": "Exemption",
    "معافی": "Remission",
    
    # Legal Terms
    "دعویٰ": "Claim/Case",
    "اعتراض": "Objection",
    "فیصلہ": "Decision/Order",
    "حکم نامہ": "Decree",
    "عدالت": "Court",
    "ریونیو کورٹ": "Revenue Court",
    "اپیل": "Appeal",
    
    # Dates and Time
    "سنہ": "Year",
    "ماہ": "Month",
    "تاریخ": "Date",
    "فصل خریف": "Kharif Season (Autumn Harvest)",
    "فصل ربیع": "Rabi Season (Spring Harvest)",
    
    # ===========================================
    # HINDI → ENGLISH (Additional Terms)
    # ===========================================
    
    "जमाबंदी": "Jamabandi (Land Revenue Record)",
    "खसरा": "Khasra Number (Plot ID)",
    "मालिक": "Owner (Malik)",
    "खाता": "Account/Khata",
    "मौजा": "Mauza (Village)",
    "तहसील": "Tehsil",
    "जिला": "District",
    "रकबा": "Area",
    "कनाल": "Kanal",
    "मरला": "Marla",
    "बीघा": "Bigha",
    "एकड़": "Acre",
    "वारिस": "Heir",
    "विरासत": "Inheritance",
    "बिक्री": "Sale",
    "गिरवी": "Mortgage",
    "पट्टा": "Lease",
    "किराएदार": "Tenant",
    "कृषि भूमि": "Agricultural Land",
    "बंजर": "Barren",
    "आबाद": "Cultivated",
    "चरागाह": "Grazing Land",
    "सरकारी जमीन": "Government Land",
    "पटवारी": "Patwari",
    "तहसीलदार": "Tehsildar",
    "नंबरदार": "Numberdar",
    "मालगुजारी": "Land Revenue",
    "लगान": "Rent",
    "दावा": "Claim",
    "आपत्ति": "Objection",
    "फैसला": "Decision",
    "अदालत": "Court",
    
    # ===========================================
    # KASHMIRI SPECIFIC TERMS
    # ===========================================
    
    "کشمیر": "Kashmir",
    "جموں": "Jammu",
    "سرینگر": "Srinagar",
    "وادی": "Valley",
    "پہاڑی": "Hilly/Mountain",
}

def apply_domain_terms(translated_text):
    """
    Post-process translated text to ensure land record terms are correctly translated.
    This preserves domain-specific terminology that may be lost in generic translation.
    """
    if not translated_text:
        return translated_text
        
    for term, replacement in LAND_RECORD_TERMS.items():
        translated_text = translated_text.replace(term, replacement)
    return translated_text

def get_detected_terms(original_text):
    """
    Detect which domain-specific terms are present in the original text.
    Returns a list of (original_term, translation) tuples.
    """
    detected = []
    if not original_text:
        return detected
        
    for term, replacement in LAND_RECORD_TERMS.items():
        if term in original_text:
            detected.append((term, replacement))
    return detected

def get_term_categories():
    """
    Return terms organized by category for UI display.
    """
    return {
        "Document Types": ["Jamabandi", "Fard", "Intiqal", "Girdawari", "Shajra"],
        "Land Units": ["Kanal", "Marla", "Bigha", "Acre", "Hectare"],
        "Ownership": ["Malik", "Qabiz", "Waris", "Tenant", "Lessee"],
        "Administration": ["Patwari", "Tehsildar", "Numberdar", "DC"],
        "Land Types": ["Agricultural", "Residential", "Commercial", "Barren"],
    }
