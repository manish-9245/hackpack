"""Raw Cloudflare D1 access via the Workers binding.

There's no SQLAlchemy/SQLModel dialect for D1 yet, so queries go through the
binding's native `.prepare(sql).bind(*params)` API directly (the same shape D1
exposes in JS) instead of an ORM engine. SQLModel is still useful here purely
for defining row shapes and getting free Pydantic validation in FastAPI routes.
"""

from typing import Any


async def query(db: Any, sql: str, params: list[Any] | None = None) -> list[dict]:
    stmt = db.prepare(sql)
    if params:
        stmt = stmt.bind(*params)
    result = await stmt.all()
    return result.results.to_py()


async def execute(db: Any, sql: str, params: list[Any] | None = None) -> None:
    stmt = db.prepare(sql)
    if params:
        stmt = stmt.bind(*params)
    await stmt.run()
