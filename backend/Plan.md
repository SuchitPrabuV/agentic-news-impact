# 🧠 ROLE: Senior AI + Backend Engineer

Build the backend + ML integration for the **Agentic AI News Impact Prediction System**.

⚠️ DO NOT implement frontend.
⚠️ Focus only on ML integration + FastAPI backend.

---

# 📦 PROJECT STRUCTURE

Create the following structure:

backend/
  main.py
  classifier/
    classifier.joblib
    predict.py
  services/
    news_service.py
    predict_service.py
  models/
    schemas.py
  utils/
    json_utils.py

---

# 🎯 OBJECTIVE

Build a complete backend system with:

1. News ingestion + classification → `/api/news`
2. AI impact analysis using Sarvam → `/api/predict`

---

# 🧠 PART 1 — ML INTEGRATION

File: `classifier/predict.py`

- Load `classifier.joblib`
- Create function:

```python
def classify(text: str) -> str
Return one of:
"technology"
"finance"
"business"
"health"

---

# 🌐 PART 2 — NEWS SERVICE

File: `services/news_service.py`

## Function:

```python
def fetch_news(sectors: list[str]) -> dict
Requirements:
Use NewsAPI (API key from .env)
Sector keyword mapping:
SECTOR_KEYWORDS = {
  "technology": "AI OR software OR chip OR cloud",
  "finance": "stock OR inflation OR banking OR interest rates",
  "business": "company OR expansion OR merger OR CEO",
  "health": "vaccine OR drug OR health OR medical"
}
For each sector:
Fetch top 20 articles
Extract fields:
id (UUID)
headline
content (fallback to description)
source
url
publishedAt
Classify article using:
from classifier.predict import classify
Filter:
Keep only articles where predicted sector == requested sector
Sort:
Latest first
Return top 5 per sector
Output format:
{
  "technology": [...],
  "finance": [...],
  "business": [...],
  "health": [...]
}
🤖 PART 3 — SARVAM IMPACT ENGINE

File: services/predict_service.py

Prompt Template:
PROMPT_TEMPLATE = """
You are an expert financial and industry analyst AI.

Analyze the news article and return ONLY valid JSON.

{
  "summary": "...",
  "impact_level": "Low | Medium | High",
  "affected_entities": ["..."],
  "short_term_impact": "...",
  "long_term_impact": "...",
  "sector_impact": "...",
  "confidence_score": 0-100,
  "tags": ["..."]
}

STRICT RULES:
- Output ONLY JSON
- No explanation
- All fields required

Article:
Headline: {headline}
Content: {content}
Sector: {sector}
"""
Function:
def generate_impact(article: dict) -> dict
Behavior:
Format prompt
Call Sarvam API:
POST https://api.sarvam.ai/v1/chat/completions
Use .env for API key
Extract response text
Parse JSON safely
🛡️ PART 4 — JSON SAFETY

File: utils/json_utils.py

Function:
def extract_json(text: str) -> dict
Use regex to extract {...}
Handle malformed JSON
Return {} if failure
📦 PART 5 — FASTAPI APP

File: main.py

Setup:
FastAPI app
Enable CORS
Endpoint 1:
GET /api/news?sectors=technology,finance
Behavior:
Parse sectors
Call fetch_news
Return JSON
Endpoint 2:
POST /api/predict
Input:
{
  "headline": "...",
  "content": "...",
  "sector": "..."
}
Behavior:
Call generate_impact
Return structured JSON
📄 PART 6 — SCHEMAS

File: models/schemas.py

Create Pydantic models:
ArticleResponse
ImpactResponse

Validation:

confidence_score → int
impact_level → enum ("Low", "Medium", "High")
⚙️ PART 7 — ENV VARIABLES

Use .env:

NEWS_API_KEY=your_key
SARVAM_API_KEY=your_key
⚠️ ERROR HANDLING
NewsAPI failure → HTTP 503
Sarvam failure → HTTP 500
Invalid JSON → fallback:
{
  "summary": "Analysis unavailable",
  "impact_level": "Low",
  "affected_entities": [],
  "short_term_impact": "",
  "long_term_impact": "",
  "sector_impact": "",
  "confidence_score": 0,
  "tags": []
}
🧪 TESTING

Test:

GET /api/news
POST /api/predict

Ensure:

No crashes
Valid JSON responses
Correct structure
🚀 FINAL REQUIREMENTS
Clean, production-ready code
All imports included
Fully runnable with:
uvicorn main:app --reload