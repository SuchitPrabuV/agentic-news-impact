from typing import Annotated

from dotenv import load_dotenv
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from models.schemas import ArticleResponse, ImpactResponse, PredictRequest
from services.news_service import fetch_news
from services.predict_service import generate_impact

load_dotenv()

app = FastAPI(title="Agentic AI News Impact Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/news", response_model=dict[str, list[ArticleResponse]])
def get_news(
    sectors: Annotated[str, Query(description="Comma-separated sectors")]
) -> dict[str, list[ArticleResponse]]:
    sector_list = [sector.strip().lower() for sector in sectors.split(",") if sector.strip()]
    return fetch_news(sector_list)


@app.post("/api/predict", response_model=ImpactResponse)
def predict_impact(article: PredictRequest) -> ImpactResponse:
    payload = article.model_dump() if hasattr(article, "model_dump") else article.dict()
    return ImpactResponse(**generate_impact(payload))
