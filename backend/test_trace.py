from app.config import settings

from langsmith import Client
from langsmith import traceable

client = Client(
    api_key=settings.LANGCHAIN_API_KEY
)

projects = list(
    client.list_projects(limit=10)
)

for p in projects:
    print(p.name)

@traceable
def hello():
    return "hello world"

print(hello())