import fitz  # PyMuPDF
import docx
import os

class ResumeParser:
    @staticmethod
    def parse(file_path):
        """
        Extracts text from a file based on its extension.
        Supported formats: .pdf, .docx, .txt
        """
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.pdf':
            return ResumeParser.parse_pdf(file_path)
        elif ext == '.docx':
            return ResumeParser.parse_docx(file_path)
        elif ext == '.txt':
            return ResumeParser.parse_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    @staticmethod
    def parse_pdf(file_path):
        text = ""
        try:
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
        except Exception as e:
            print(f"Error parsing PDF {file_path}: {e}")
        return text

    @staticmethod
    def parse_docx(file_path):
        text = ""
        try:
            doc = docx.Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            print(f"Error parsing DOCX {file_path}: {e}")
        return text

    @staticmethod
    def parse_txt(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"Error parsing TXT {file_path}: {e}")
            return ""
