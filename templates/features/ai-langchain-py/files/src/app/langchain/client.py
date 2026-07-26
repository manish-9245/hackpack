import os
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage

def get_llm():
    """Initialize LangChain LLM client with Anthropic."""
    return ChatAnthropic(
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
        model="claude-3-5-sonnet-20241022",
    )

async def chat(messages: list[dict]) -> str:
    """Run a simple LangChain chat completion."""
    llm = get_llm()
    langchain_messages = [
        SystemMessage(content="You are a helpful assistant."),
        *[HumanMessage(content=m["content"]) if m["role"] == "user" else SystemMessage(content=m["content"]) for m in messages]
    ]
    response = await llm.ainvoke(langchain_messages)
    return response.content
