from fastapi import FastAPI

# hackpack:imports

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Welcome to your hackpack project"}


# hackpack:routers
