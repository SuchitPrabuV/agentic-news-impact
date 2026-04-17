import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

# 1. Sample dataset (you can expand later)
data = [
    # TECH (10 examples)
    ("Apple launches new AI chip", "tech"),
    ("Google releases new Android update", "tech"),
    ("Microsoft invests in cloud computing", "tech"),
    ("Tesla develops autonomous driving software", "tech"),
    ("NVIDIA introduces new GPU for AI", "tech"),
    ("OpenAI releases new GPT model", "tech"),
    ("Meta builds virtual reality platform", "tech"),
    ("Amazon develops AI tools", "tech"),
    ("Cybersecurity threats increase globally", "tech"),
    ("Startup builds AI-powered app", "tech"),

    # FINANCE (10 examples)
    ("Stock market crashes due to inflation", "finance"),
    ("Gold prices rise amid uncertainty", "finance"),
    ("Federal Reserve raises interest rates", "finance"),
    ("Cryptocurrency market sees volatility", "finance"),
    ("Investors shift towards bonds", "finance"),
    ("Banking sector faces liquidity crisis", "finance"),
    ("IPO market slows down", "finance"),
    ("Global economy shows signs of slowdown", "finance"),
    ("Oil prices impact global markets", "finance"),
    ("Rupee weakens against dollar", "finance"),

    # BUSINESS (10 examples)
    ("Startup raises $50M funding", "business"),
    ("Amazon expands logistics network", "business"),
    ("Company announces merger deal", "business"),
    ("Retail sales increase during festival", "business"),
    ("Uber expands services globally", "business"),
    ("E-commerce growth rises sharply", "business"),
    ("New business strategies adopted by firms", "business"),
    ("Corporate profits increase this quarter", "business"),
    ("Manufacturing sector expands", "business"),
    ("Supply chain disruptions affect companies", "business"),

    # HEALTH (10 examples)
    ("New vaccine shows promising results", "health"),
    ("Hospital reports increase in infections", "health"),
    ("Doctors warn about new virus strain", "health"),
    ("Healthcare system under pressure", "health"),
    ("Mental health awareness increases", "health"),
    ("New treatment approved for cancer", "health"),
    ("Fitness trends rise globally", "health"),
    ("Nutrition impacts long-term health", "health"),
    ("Medical research breakthrough announced", "health"),
    ("Pandemic preparedness improves", "health"),
]

# Convert to DataFrame
df = pd.DataFrame(data, columns=["text", "label"])

# 2. Create ML pipeline
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("model", LogisticRegression())
])

# 3. Train model
pipeline.fit(df["text"], df["label"])

# 4. Save model
joblib.dump(pipeline, "classifier/classifier.joblib")

print("✅ Model trained and saved!")