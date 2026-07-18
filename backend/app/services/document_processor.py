from pathlib import Path

from langchain_community.document_loaders import (
    PyPDFLoader,
    Docx2txtLoader,
    TextLoader,
    CSVLoader
)

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

def load_document(file_path: str):
    extension = Path(file_path).suffix.lower()

    if extension == ".pdf":
        loader = PyPDFLoader(file_path)

    elif extension == ".docx":
        loader = Docx2txtLoader(file_path)

    elif extension == ".txt":
        loader = TextLoader(file_path)

    elif extension == ".csv":
        loader = CSVLoader(file_path=file_path)

    else:
        raise ValueError(
            f"Unsupported file type: {extension}"
        )

    return loader.load()

def chunk_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    return splitter.split_documents(documents)


def process_document(file_path: str):

    documents = load_document(file_path)
    chunks = chunk_documents(documents)

    return chunks