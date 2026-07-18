from qdrant_client import QdrantClient
from app.services.embeddings import (
    generate_embedding,
    generate_embeddings
)
from app.config import settings
from fastembed import SparseTextEmbedding
from uuid import uuid4
from qdrant_client.models import (
    Distance,
    VectorParams,
    SparseVectorParams,
    PointStruct,
    SparseVector,
    NamedVector,
    NamedSparseVector,
    FusionQuery,
    Fusion
)

client = QdrantClient(
    url=settings.QDRANT_URL,
    api_key=settings.QDRANT_API_KEY
)
sparse_model = SparseTextEmbedding(
    model_name="Qdrant/bm25"
)

def init_qdrant():

    collections = client.get_collections()

    collection_names = [
        c.name
        for c in collections.collections
    ]

    if "document_chunks" not in collection_names:

        client.create_collection(
    collection_name="document_chunks",

    vectors_config={
        "dense": VectorParams(
            size=384,
            distance=Distance.COSINE
        )
    },

    sparse_vectors_config={
        "sparse": SparseVectorParams()
    }
)

        print("Created document_chunks collection")

    else:
        print("document_chunks already exists")


        

def store_chunks(
    chunks,
    embeddings,
    document_id,
    filename
):
    points = []

    for chunk, embedding in zip(
        chunks,
        embeddings
    ):

        sparse_vector = next(
            sparse_model.embed(
                [chunk.page_content]
            )
        )

        points.append(
            PointStruct(
                id=str(uuid4()),
                vector={
                    "dense": embedding,
                    "sparse": {
                        "indices": sparse_vector.indices.tolist(),
                        "values": sparse_vector.values.tolist()
                    }
                },
                payload={
                    "document_id": document_id,
                    "filename": filename,
                    "chunk_text": chunk.page_content
                }
            )
        )

    client.upsert(
        collection_name="document_chunks",
        points=points
    )

def search_documents(
    query: str,
    limit: int = 10
):

    query_vector = generate_embeddings([query])[0]

    results = client.query_points(
    collection_name="document_chunks",
    query=query_vector,
    using="dense",
    limit=limit
)

    return results.points

    
def hybrid_search(
    query: str,
    limit: int = 10
):
    dense_vector = generate_embedding(query)

    sparse_embedding = list(
        sparse_model.embed([query])
    )[0]

    results = client.query_points(
        collection_name="document_chunks",

        prefetch=[
            {
                "query": dense_vector,
                "using": "dense",
                "limit": limit
            },
            {
                "query": SparseVector(
                    indices=sparse_embedding.indices.tolist(),
                    values=sparse_embedding.values.tolist()
                ),
                "using": "sparse",
                "limit": limit
            }
        ],

        query=FusionQuery(
            fusion=Fusion.RRF
        ),

        limit=limit
    )

    return results.points