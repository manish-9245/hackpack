import os
from pydantic import BaseModel
from pydantic_ai import Agent

class SampleOutput(BaseModel):
    """Structured output from Pydantic AI."""
    text: str
    confidence: float

def get_agent():
    """Initialize Pydantic AI agent with Anthropic."""
    return Agent(
        model=f"anthropic:claude-3-5-sonnet-20241022",
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
        result_type=SampleOutput,
    )

async def generate(prompt: str) -> SampleOutput:
    """Generate structured output using Pydantic AI."""
    agent = get_agent()
    result = await agent.run(prompt)
    return result.data
