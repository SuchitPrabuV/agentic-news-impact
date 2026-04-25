from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = BASE_DIR / "data.csv"
MODEL_PATH = Path(__file__).resolve().parent / "classifier.joblib"


def load_data(path: Path = DATA_PATH):
    df = pd.read_csv(path)
    df = df.dropna()
    df = df.drop_duplicates()
    return df


def train(df):
    X = df["text"]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    stop_words="english",
                    ngram_range=(1, 2),
                    max_features=5000,
                ),
            ),
            (
                "clf",
                LogisticRegression(
                    max_iter=200,
                    class_weight="balanced",
                ),
            ),
        ]
    )

    print("Training model...")
    model.fit(X_train, y_train)

    return model, X_test, y_test


def evaluate(model, X_test, y_test):
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {acc:.4f}\n")

    print("Classification Report:")
    print(classification_report(y_test, y_pred))


def save_model(model, path: Path = MODEL_PATH):
    joblib.dump(model, path)
    print(f"\nModel saved to {path}")


def test_model(model):
    print("\nSample Predictions:")

    samples = [
        "Apple launches new AI chip for iPhones",
        "Stock markets fall due to inflation concerns",
        "Amazon expands business operations globally",
        "New vaccine shows promising results in trials",
    ]

    for text in samples:
        pred = model.predict([text])[0]
        print(f"{text} -> {pred}")


def main():
    df = load_data()

    print(f"Loaded {len(df)} samples")

    model, X_test, y_test = train(df)

    evaluate(model, X_test, y_test)
    save_model(model)
    test_model(model)


if __name__ == "__main__":
    main()
