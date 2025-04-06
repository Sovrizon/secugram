from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from posts import router as posts_router

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routes
app.include_router(auth_router, prefix="/auth")
app.include_router(posts_router, prefix="/posts")


import asyncio
import requests
import random

TARGET_BACKEND_URL = "https://tiers-de-confiance.onrender.com/get_key/lalalala"
# PING_INTERVAL_SECONDS = 600  # 10 minutes

@app.on_event("startup")
async def ping_other_backend_periodically():
    asyncio.create_task(ping_other_backend())

async def ping_other_backend():
    while True:
        try:
            def make_request():
                response = requests.get(TARGET_BACKEND_URL)
                print(f"Requête vers /all OK : {response.status_code}")
            await asyncio.to_thread(make_request)
        except Exception as e:
            print(f"Erreur lors de l'appel à /all : {e}")
        PING_INTERVAL_SECONDS = random.randint(300, 600)
        await asyncio.sleep(PING_INTERVAL_SECONDS)
