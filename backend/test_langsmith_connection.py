from langsmith import Client
from app.config import settings

client = Client(
    api_key=settings.LANGCHAIN_API_KEY
)

projects = list(client.list_projects())

print("Connected")
print("Projects:", len(projects))

for p in projects[:5]:
    print(p.name)