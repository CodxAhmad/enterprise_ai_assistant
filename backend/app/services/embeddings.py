from sentence_transformers import SentenceTransformer, CrossEncoder

embedding_model = SentenceTransformer(
    "BAAI/bge-small-en-v1.5",
    local_files_only=True
)
reranker_model = CrossEncoder(
    "cross-encoder/ms-marco-MiniLM-L-6-v2",
    local_files_only=True
)
def generate_embeddings(texts: list[str]):
    return embedding_model.encode(
        texts,
        normalize_embeddings=True
    ).tolist()


def generate_embedding(text: str):
    return embedding_model.encode(
        text,
        normalize_embeddings=True
    ).tolist()

def rerank_chunks(
    query: str,
    chunks: list,
    top_k: int = 5
):

    pairs = [
        (
            query,
            chunk.payload["chunk_text"]
        )
        for chunk in chunks
    ]

    scores = reranker_model.predict(
        pairs
    )

    scored_chunks = list(
        zip(chunks, scores)
    )

    scored_chunks.sort(
        key=lambda x: x[1],
        reverse=True
    )

    return [
    chunk
    for chunk, score
    in scored_chunks[:top_k]
]