from app.services.retrieval import rewrite_query

history = [
    "User: What is the refund policy?",
    "Assistant: Refunds are allowed within 30 days."
]

query = "What about international customers?"

result = rewrite_query(
    query,
    history
)

print(result)