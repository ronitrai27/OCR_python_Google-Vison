"""
Script to generate sample disputed land data for testing
"""
import requests
import json
from datetime import datetime, timedelta
import random

API_BASE_URL = "http://localhost:5000/api"

# Sample districts in Pakistan
DISTRICTS = ["Lahore", "Faisalabad", "Multan", "Rawalpindi", "Gujranwala", "Sialkot", "Bahawalpur"]

# Sample tehsils by district
TEHSILS = {
    "Lahore": ["Model Town", "Gulberg", "Raiwind", "Shahdara"],
    "Faisalabad": ["Jaranwala", "Samundri", "Tandlianwala"],
    "Multan": ["Shujabad", "Jalalpur Pirwala", "Multan City"],
    "Rawalpindi": ["Taxila", "Gujar Khan", "Kallar Syedan"],
    "Gujranwala": ["Wazirabad", "Kamoke", "Nowshera Virkan"],
    "Sialkot": ["Daska", "Pasrur", "Sambrial"],
    "Bahawalpur": ["Hasilpur", "Ahmadpur East", "Yazman"]
}

# Sample mauzas (villages)
MAUZAS = [
    "Chak No. 123", "Khanewal", "Jhumra", "Kamalia", "Mian Channu",
    "Kot Addu", "Pakpattan", "Vehari", "Sahiwal", "Okara"
]

# Sample historical owners
HISTORICAL_OWNERS = [
    "Raja Muhammad Khan", "Sardar Singh", "Lala Ram Dass", 
    "Malik Ahmed Ali", "Chaudhry Abdul Hameed", "Rao Bahadur Singh"
]

# Sample claimant names
CLAIMANT_NAMES = [
    "Muhammad Ali Khan", "Fatima Begum", "Ahmed Hassan", 
    "Ayesha Bibi", "Abdul Rahman", "Zainab Malik",
    "Hassan Ali", "Rukhsana Khatoon", "Imran Ahmed"
]

# Sample dispute types
DISPUTE_TYPES = [
    "refugee_claim",
    "muhajireen_claim", 
    "redistributed",
    "overlapping_ownership",
    "inheritance"
]

# Sample dispute statuses
STATUSES = [
    "pending",
    "under_investigation",
    "court_hearing",
    "resolved",
    "rejected"
]

# Coordinates for Pakistan (approximate center with some variation)
BASE_LAT = 30.3753
BASE_LON = 69.3451
LAT_RANGE = 5
LON_RANGE = 5

def generate_claimants(num_claimants):
    """Generate random claimants"""
    claimants = []
    for _ in range(num_claimants):
        claimant = {
            "name": random.choice(CLAIMANT_NAMES),
            "cnic": f"{random.randint(10000, 99999)}-{random.randint(1000000, 9999999)}-{random.randint(1, 9)}",
            "contact": f"+92-3{random.randint(10, 99)}-{random.randint(1000000, 9999999)}",
            "relationship": random.choice(["Original Owner", "Heir", "Purchaser", "Refugee Claimant", "Legal Heir"])
        }
        claimants.append(claimant)
    return claimants

def generate_disputed_land():
    """Generate a single disputed land record"""
    district = random.choice(DISTRICTS)
    tehsil = random.choice(TEHSILS[district])
    mauza = random.choice(MAUZAS)
    dispute_type = random.choice(DISPUTE_TYPES)
    
    # Partition-related disputes more likely for refugee/muhajireen claims
    partition_impact = dispute_type in ["refugee_claim", "muhajireen_claim"] or random.random() < 0.3
    
    data = {
        "khasra_number": f"{random.randint(1, 999)}/{random.randint(1, 50)}",
        "mauza": mauza,
        "tehsil": tehsil,
        "district": district,
        "dispute_type": dispute_type,
        "dispute_status": random.choice(STATUSES),
        "claimants": generate_claimants(random.randint(2, 4)),
        "latitude": BASE_LAT + random.uniform(-LAT_RANGE, LAT_RANGE),
        "longitude": BASE_LON + random.uniform(-LON_RANGE, LON_RANGE),
        "area_kanal": random.randint(1, 50),
        "area_marla": random.randint(0, 19),
        "partition_impact": partition_impact,
        "notes": f"Dispute regarding {dispute_type.replace('_', ' ')} with multiple claimants. {'Affected by 1947 partition. ' if partition_impact else ''}Requires legal resolution."
    }
    
    # Add historical owner for partition cases
    if partition_impact:
        data["historical_owner"] = random.choice(HISTORICAL_OWNERS)
        data["redistribution_year"] = random.choice([1947, 1948, 1949, 1950, 1951])
    
    # Add case information for court cases
    if data["dispute_status"] in ["court_hearing", "resolved", "rejected"]:
        data["case_number"] = f"CL-{random.randint(1000, 9999)}/20{random.randint(10, 23)}"
        data["court_jurisdiction"] = f"Civil Court {district}"
        
        # Filed date
        days_ago = random.randint(30, 1000)
        filed_date = datetime.now() - timedelta(days=days_ago)
        data["filed_date"] = filed_date.isoformat()
        
        # Next hearing for court_hearing status
        if data["dispute_status"] == "court_hearing":
            days_ahead = random.randint(7, 60)
            next_hearing = datetime.now() + timedelta(days=days_ahead)
            data["next_hearing_date"] = next_hearing.isoformat()
    
    return data

def create_sample_data(count=50):
    """Create sample disputed lands data"""
    print(f"Generating {count} sample disputed land records...")
    
    created = 0
    failed = 0
    
    for i in range(count):
        try:
            land_data = generate_disputed_land()
            
            response = requests.post(
                f"{API_BASE_URL}/disputed-lands",
                json=land_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 201:
                created += 1
                print(f"✓ Created record {created}/{count}: {land_data['mauza']} ({land_data['dispute_type']})")
            else:
                failed += 1
                print(f"✗ Failed to create record: {response.status_code} - {response.text}")
                
        except Exception as e:
            failed += 1
            print(f"✗ Error creating record: {str(e)}")
    
    print(f"\n{'='*60}")
    print(f"Sample data generation complete!")
    print(f"Successfully created: {created}")
    print(f"Failed: {failed}")
    print(f"{'='*60}")

if __name__ == "__main__":
    print("=" * 60)
    print("Disputed Lands Sample Data Generator")
    print("=" * 60)
    print("\nMake sure the backend server is running on http://localhost:5000")
    print("This will create 50 sample disputed land records.\n")
    
    create_sample_data(50)
