from __future__ import annotations

import os
import uuid
from datetime import datetime

import requests
from dotenv import load_dotenv
from fastapi import HTTPException

from backend.classifier.predict import classify

load_dotenv()

NEWS_API_URL = "https://newsapi.org/v2/everything"
SECTOR_KEYWORDS = {
    "technology": "AI OR software OR chip OR cloud",
    "finance": "stock OR inflation OR banking OR interest rates",
    "business": "company OR expansion OR merger OR CEO",
    "health": "vaccine OR drug OR health OR medical",
}


def _parse_published_at(value: str) -> datetime:
    if not value:
        return datetime.min

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return datetime.min


def fetch_news(sectors: list[str]) -> dict[str, list[dict]]:
    api_key = os.getenv("NEWS_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="NEWS_API_KEY is not configured")

    invalid_sectors = [sector for sector in sectors if sector not in SECTOR_KEYWORDS]
    if invalid_sectors:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported sectors: {', '.join(sorted(set(invalid_sectors)))}",
        )

    results: dict[str, list[dict]] = {}

    for sector in sectors:
        params = {
            "q": SECTOR_KEYWORDS[sector],
            "language": "en",
            "pageSize": 20,
            "sortBy": "publishedAt",
            "apiKey": api_key,
        }

        try:
            response = requests.get(NEWS_API_URL, params=params, timeout=20)
            response.raise_for_status()
            payload = response.json()
        except requests.RequestException as exc:
            raise HTTPException(status_code=503, detail=f"NewsAPI request failed: {exc}") from exc

        if payload.get("status") != "ok":
            raise HTTPException(
                status_code=503,
                detail=payload.get("message", "NewsAPI returned an error"),
            )

        filtered_articles: list[dict] = []

        for article in payload.get("articles", []):
            headline = (article.get("title") or "").strip()
            content = (article.get("content") or article.get("description") or "").strip()

            if not headline and not content:
                continue

            predicted_sector = classify(f"{headline}\n{content}".strip())
            if predicted_sector != sector:
                continue

            filtered_articles.append(
                {
                    "id": str(uuid.uuid4()),
                    "headline": headline,
                    "content": content,
                    "source": ((article.get("source") or {}).get("name") or "").strip(),
                    "url": article.get("url") or "",
                    "publishedAt": article.get("publishedAt") or "",
                }
            )

        filtered_articles.sort(
            key=lambda item: _parse_published_at(item["publishedAt"]),
            reverse=True,
        )
        results[sector] = filtered_articles[:5]

    return results
