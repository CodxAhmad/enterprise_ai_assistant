# import numpy as np
# import json

# from redis.commands.search.field import (
#     TextField,
#     VectorField
# )
# from app.services.embeddings import (
#     generate_embedding
# )
# from redis.commands.search.index_definition import (
#     IndexDefinition,
#     IndexType
# )

# from redis.commands.search.query import Query

# from app.services.cache import redis_client

# def create_cache_index():

#     try:
#         redis_client.ft("cache_idx").info()
#         print("Cache index already exists")

#     except:

#         schema = (
#             TextField("question"),
#             TextField("answer"),

#             VectorField(
#                 "embedding",
#                 "FLAT",
#                 {
#                     "TYPE": "FLOAT32",
#                     "DIM": 384,
#                     "DISTANCE_METRIC": "COSINE"
#                 }
#             )
#         )

#         redis_client.ft("cache_idx").create_index(
#             schema,
#             definition=IndexDefinition(
#                 prefix=["cache:"],
#                 index_type=IndexType.HASH
#             )
#         )

#         print("Created semantic cache index")

# def store_semantic_cache(
#     question: str,
#     answer: str
# ):

#     embedding = generate_embedding(question)

#     redis_client.hset(
#         f"cache:{question}",
#         mapping={
#             "question": question,
#             "answer": answer,
#             "embedding": np.array(
#                 embedding,
#                 dtype=np.float32
#             ).tobytes()
#         }
#     )

# def search_semantic_cache(
#     question: str,
#     threshold: float = 0.15
# ):

#     query_embedding = generate_embedding(
#         question
#     )

#     query_vector = np.array(
#         query_embedding,
#         dtype=np.float32
#     ).tobytes()

#     query = Query(
#         "*=>[KNN 1 @embedding $vector AS score]"
#     ).return_fields(
#         "question",
#         "answer",
#         "score"
#     ).sort_by(
#         "score"
#     ).dialect(2)

#     results = redis_client.ft(
#         "cache_idx"
#     ).search(
#         query,
#         {
#             "vector": query_vector
#         }
#     )

#     if len(results.docs) == 0:
#         return None

#     result = results.docs[0]

#     score = float(result.score)

#     if score > threshold:
#         return None

#     return {
#         "question": result.question,
#         "answer": result.answer,
#         "score": score
#     }




from app.services.cache import redis_client

CACHE_TTL = 86400  # 24 hours


def store_semantic_cache(
    question: str,
    answer: str
):
    redis_client.setex(
        f"cache:{question}",
        CACHE_TTL,
        answer
    )


def search_semantic_cache(
    question: str
):
    cached_answer = redis_client.get(
        f"cache:{question}"
    )

    if cached_answer:

        return {
            "question": question,
            "answer": cached_answer
        }

    return None