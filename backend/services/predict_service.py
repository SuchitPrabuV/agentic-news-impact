from __future__ import annotations

import json
import os

import requests
from dotenv import load_dotenv
from fastapi import HTTPException

from backend.models.schemas import ImpactResponse
from backend.utils.json_utils import extract_json

load_dotenv()

SARVAM_API_URL = "https://api.sarvam.ai/v1/chat/completions"
PROMPT_TEMPLATE = """
You are an expert financial and industry analyst AI.

Analyze the news article and return ONLY valid JSON.

{{
  "summary": "...",
  "impact_level": "Low | Medium | High",
  "affected_entities": ["..."],
  "short_term_impact": "...",
  "long_term_impact": "...",
  "sector_impact": "...",
  "confidence_score": 0-100,
  "tags": ["..."]
}}

STRICT RULES:
- Output ONLY JSON
- No explanation
- All fields required

Article:
Headline: {headline}
Content: {content}
Sector: {sector}
"""

FALLBACK_IMPACT = {
    "summary": "Analysis unavailable",
    "impact_level": "Low",
    "affected_entities": [],
    "short_term_impact": "",
    "long_term_impact": "",
    "sector_impact": "",
    "confidence_score": 0,
    "tags": [],
}


def _model_dump(model: ImpactResponse) -> dict:
    if hasattr(model, "model_dump"):
        return model.model_dump()
    return model.dict()


def _extract_message_content(payload: dict) -> str:
    choices = payload.get("choices") or []
    if not choices:
        return ""

    message = choices[0].get("message") or {}
    content = message.get("content")

    if isinstance(content, str):
        return content

    if isinstance(content, list):
        parts: list[str] = []
        for item in content:
            if isinstance(item, dict) and item.get("type") == "text":
                parts.append(item.get("text", ""))
        return "\n".join(part for part in parts if part)

    return ""


def generate_impact(article: dict) -> dict:
    api_key = os.getenv("SARVAM_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="SARVAM_API_KEY is not configured")

    prompt = PROMPT_TEMPLATE.format(
        headline=article.get("headline", ""),
        content=article.get("content", ""),
        sector=article.get("sector", ""),
    )

    body = {
        "model": os.getenv("SARVAM_MODEL", "sarvam-m"),
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            SARVAM_API_URL,
            headers=headers,
            data=json.dumps(body),
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException as exc:
        raise HTTPException(status_code=500, detail=f"Sarvam request failed: {exc}") from exc
    except ValueError as exc:
        raise HTTPException(status_code=500, detail="Sarvam returned invalid JSON") from exc

    raw_text = _extract_message_content(payload)
    parsed = extract_json(raw_text)
    if not parsed:
        return FALLBACK_IMPACT.copy()

    try:
        normalized = ImpactResponse(**parsed)
    except Exception:
        normalized = ImpactResponse(**FALLBACK_IMPACT)

    return _model_dump(normalized)
