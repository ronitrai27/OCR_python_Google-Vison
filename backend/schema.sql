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
