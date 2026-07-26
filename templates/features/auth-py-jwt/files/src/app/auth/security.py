"""Password hashing and JWT helpers.

Pure-Python (hashlib's PBKDF2 + PyJWT) on purpose — C-extension packages like
bcrypt aren't guaranteed to have Pyodide wheels, and this runs inside the
Pyodide-based Python Workers sandbox.

Secrets come from the Workers `env` binding (via `asgi.env`), not `os.environ`
— there's no real process environment inside the Workers sandbox, so these
functions take the secret as a parameter rather than reading a global.
"""

import hashlib
import hmac
import os
import time

import jwt

JWT_ALGORITHM = "HS256"
JWT_EXPIRY_SECONDS = 60 * 60 * 24 * 7


def hash_password(password: str, salt: str | None = None) -> str:
    salt = salt or os.urandom(16).hex()
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 100_000)
    return f"{salt}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    salt, _, digest_hex = stored.partition("$")
    expected = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 100_000)
    return hmac.compare_digest(expected.hex(), digest_hex)


def create_token(user_id: str, secret: str) -> str:
    payload = {"sub": user_id, "exp": int(time.time()) + JWT_EXPIRY_SECONDS}
    return jwt.encode(payload, secret, algorithm=JWT_ALGORITHM)


def decode_token(token: str, secret: str) -> str:
    payload = jwt.decode(token, secret, algorithms=[JWT_ALGORITHM])
    return payload["sub"]
