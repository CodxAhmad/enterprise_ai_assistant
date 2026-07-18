from fastembed import SparseTextEmbedding

model = SparseTextEmbedding(
    model_name="Qdrant/bm25"
)

result = next(
    model.embed(
        ["COMSATS University Islamabad"]
    )
)

print(type(result))
print(result)