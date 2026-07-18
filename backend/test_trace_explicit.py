from app.config import settings

from langsmith import Client
from langsmith.run_helpers import traceable

client = Client(
    api_key=settings.LANGCHAIN_API_KEY
)

@traceable(
    client=client
)
def hello():
    return "hello world"

print(hello())