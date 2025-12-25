from transformers import AutoModelForSeq2SeqLM
import os

# Handle missing IndicTransToolkit gracefully
try:
    from IndicTransToolkit import IndicProcessor, IndicTransTokenizer
    INDIC_TOOLKIT_AVAILABLE = True
except ImportError:
    print("Warning: IndicTransToolkit not found. Translation features will be disabled.")
    INDIC_TOOLKIT_AVAILABLE = False
    IndicProcessor = None
    IndicTransTokenizer = None

# Load model (downloads ~800MB on first run)
# We should probably load this lazily or check if it exists to avoid long startup times during dev
model = None
processor = None
tokenizer = None

if INDIC_TOOLKIT_AVAILABLE:
    try:
        model = AutoModelForSeq2SeqLM.from_pretrained(
            "ai4bharat/indictrans2-indic-en-dist-200M"
        )
        processor = IndicProcessor(inference=True)
        tokenizer = IndicTransTokenizer(direction="indic-en")
    except Exception as e:
        print(f"Warning: Could not load AI4Bharat model: {e}")

def translate_urdu_to_english(text):
    if not INDIC_TOOLKIT_AVAILABLE:
        return "Translation unavailable: IndicTransToolkit not installed (requires C++ Build Tools)."
        
    if not model:
        return "Model not loaded"
        
    # Preprocess
    batch = processor.preprocess_batch([text], src_lang="urd_Arab", tgt_lang="eng_Latn")
    
    # Tokenize
    inputs = tokenizer(batch, return_tensors="pt", padding=True)
    
    # Generate translation
    outputs = model.generate(**inputs, max_length=256)
    
    # Decode
    translated = tokenizer.batch_decode(outputs, skip_special_tokens=True)
    return processor.postprocess_batch(translated)[0]
