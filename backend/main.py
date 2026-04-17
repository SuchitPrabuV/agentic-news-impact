from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.news_service import fetch_news
import joblib

model = joblib.load("classifier/classifier.joblib")
def classify(text):
    return model.predict([text])[0]
app = FastAPI()

# Enable CORS (IMPORTANT for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/api/news")
async def get_news(sectors: str):
    sector_list = sectors.split(",")
    result = {}

    for sector in sector_list:
        raw_articles = await fetch_news(sector)

        filtered = []

        for article in raw_articles:
            text = article.get("title", "")
            
            predicted_sector = classify(text)

            if predicted_sector == sector:
                formatted = {
                    "id": article["url"],
                    "headline": article["title"],
                    "source": article["source"]["name"],
                    "url": article["url"],
                    "published_at": article["publishedAt"],
                    "sector": sector
                }

                filtered.append(formatted)

        result[sector] = filtered[:5]

    return result

def format_article(article):
    return {
        "id": article["url"],  # unique ID
        "headline": article["title"],
        "source": article["source"]["name"],
        "url": article["url"],
        "published_at": article["publishedAt"],
        "content": article.get("description", "")
    }

@app.post("/api/predict")
def predict():
    return {"message": "predict endpoint working"}

print(classify("Tesla stock rises sharply"))
print(classify("New AI chip launched by NVIDIA"))
print(classify("Hospital sees rise in infections"))