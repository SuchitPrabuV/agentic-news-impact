from __future__ import annotations

from functools import lru_cache
from pathlib import Path

import joblib

MODEL_PATH = Path(__file__).resolve().parent / "classifier.joblib"
SECTOR_LABELS = {"technology", "finance", "business", "health"}
KEYWORD_FALLBACK = {
    "technology": ("ai", "software", "chip", "cloud", "semiconductor", "robotics"),
    "finance": ("stock", "inflation", "banking", "interest rate", "fed", "market"),
    "business": ("company", "expansion", "merger", "ceo", "acquisition", "revenue"),
    "health": ("vaccine", "drug", "health", "medical", "trial", "hospital"),
}


@lru_cache(maxsize=1)
def _load_model():
    if not MODEL_PATH.exists():
        return None
    return joblib.load(MODEL_PATH)


def _fallback_classify(text: str) -> str:
    normalized = text.lower()
    scores = {
        sector: sum(keyword in normalized for keyword in keywords)
        for sector, keywords in KEYWORD_FALLBACK.items()
    }
    best_sector = max(scores, key=scores.get)
    return best_sector if scores[best_sector] > 0 else "business"


def classify(text: str) -> str:
    model = _load_model()
    if model is None:
        return _fallback_classify(text)

    prediction = str(model.predict([text])[0]).strip().lower()
    if prediction not in SECTOR_LABELS:
        return _fallback_classify(text)
    return prediction
