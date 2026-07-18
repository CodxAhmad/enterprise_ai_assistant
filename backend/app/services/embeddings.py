from sentence_transformers import SentenceTransformer, CrossEncoder

# Lazy-loaded models — initialized on first use to avoid OOM at startup
_embedding_model = None
_reranker_model = None

def _get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer("BAAI/bge-small-en-v1.5")
    return _embedding_model

def _get_reranker_model():
    global _reranker_model
    if _reranker_model is None:
        _reranker_model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
    return _reranker_model

def generate_embeddings(texts: list[str]):
    return _get_embedding_model().encode(
        texts,
        normalize_embeddings=True
    ).tolist()


def generate_embedding(text: str):
    return _get_embedding_model().encode(
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

    scores = _get_reranker_model().predict(pairs)

    scored_chunks = list(zip(chunks, scores))

    scored_chunks.sort(
        key=lambda x: x[1],
        reverse=True
    )

    return [
        chunk
        for chunk, score
        in scored_chunks[:top_k]
    ]