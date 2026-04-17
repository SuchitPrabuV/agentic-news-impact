import httpx
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NEWS_API_KEY")

BASE_URL = "https://newsapi.org/v2/everything"

async def fetch_news(query: str):
    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 20,
        "apiKey": API_KEY
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params=params)
        data = response.json()

        return data.get("articles", [])