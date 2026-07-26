from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

import asgi
from app.auth.security import create_token, decode_token, hash_password, verify_password
from app.db.client import execute, query

router = APIRouter(prefix="/auth")


class SignupBody(BaseModel):
    email: str
    password: str
    name: str


class LoginBody(BaseModel):
    email: str
    password: str


@router.post("/signup")
async def signup(body: SignupBody, env=Depends(asgi.env)):
    existing = await query(env.DB, "SELECT id FROM users WHERE email = ?", [body.email])
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    await execute(
        env.DB,
        "INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)",
        [body.email, body.email, body.name, hash_password(body.password)],
    )
    return {"token": create_token(body.email, env.JWT_SECRET)}


@router.post("/login")
async def login(body: LoginBody, env=Depends(asgi.env)):
    rows = await query(env.DB, "SELECT id, password_hash FROM users WHERE email = ?", [body.email])
    if not rows or not verify_password(body.password, rows[0]["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": create_token(rows[0]["id"], env.JWT_SECRET)}


def get_current_user_id(
    authorization: str | None = Header(default=None),
    env=Depends(asgi.env),
) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    try:
        return decode_token(authorization.removeprefix("Bearer "), env.JWT_SECRET)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token") from None


@router.get("/me")
async def me(user_id: str = Depends(get_current_user_id), env=Depends(asgi.env)):
    rows = await query(env.DB, "SELECT id, email, name FROM users WHERE id = ?", [user_id])
    if not rows:
        raise HTTPException(status_code=404, detail="User not found")
    return rows[0]
