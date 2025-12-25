from werkzeug.utils import secure_filename
import os
import uuid

def save_file(file, upload_folder):
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        
    filename = secure_filename(file.filename)
    unique_filename = f"{uuid.uuid4()}_{filename}"
    filepath = os.path.join(upload_folder, unique_filename)
    file.save(filepath)
    return filepath
