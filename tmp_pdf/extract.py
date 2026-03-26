import os
from pypdf import PdfReader

def extract():
    src_dir = 'd:/online/public/images'
    dest_dir = 'd:/online/tmp_pdf'
    
    files = [f for f in os.listdir(src_dir) if f.endswith('.pdf')]
    for file in files:
        try:
            reader = PdfReader(os.path.join(src_dir, file))
            text = ""
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
            with open(os.path.join(dest_dir, f"{file}.txt"), 'w', encoding='utf-8') as f:
                f.write(text)
            print(f"Extracted: {file} ({len(text)} chars)")
        except Exception as e:
            print(f"Error extracting {file}: {e}")

if __name__ == '__main__':
    extract()
