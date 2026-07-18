from app.services.agent import (
    agent
)

result = agent.invoke(
    {
        "user_query":
            "Tell me about Ahmad's education",

        "chat_history": []
    }
)

print(
    result["final_answer"]
)