from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field

try:
    from pydantic import field_validator
except ImportError:
    from pydantic import validator as field_validator


class ImpactLevel(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"


class ArticleResponse(BaseModel):
    id: str
    headline: str
    content: str
    source: str
    url: str
    publishedAt: str


class PredictRequest(BaseModel):
    headline: str
    content: str
    sector: str

    @field_validator("sector")
    @classmethod
    def validate_sector(cls, value: str) -> str:
        normalized = value.strip().lower()
        allowed = {"technology", "finance", "business", "health"}
        if normalized not in allowed:
            raise ValueError("sector must be one of: technology, finance, business, health")
        return normalized


class ImpactResponse(BaseModel):
    summary: str
    impact_level: ImpactLevel
    affected_entities: list[str]
    short_term_impact: str
    long_term_impact: str
    sector_impact: str
    confidence_score: int = Field(ge=0, le=100)
    tags: list[str]
