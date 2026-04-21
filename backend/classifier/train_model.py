import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score


# ðŸ“ Load dataset
def load_data(path="agentic-news-impact\data.csv"):
    df = pd.read_csv(path)

    # Basic cleaning
    df = df.dropna()
    df = df.drop_duplicates()

    return df


# ðŸ§  Train model
def train(df):
    X = df["text"]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = Pipeline([
        ("tfidf", TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),   # ðŸ”¥ improves accuracy
            max_features=5000
        )),
        ("clf", LogisticRegression(
            max_iter=200,
            class_weight="balanced"  # ðŸ”¥ helps if data slightly imbalanced
        ))
    ])

    print("Training model...")
    model.fit(X_train, y_train)

    return model, X_test, y_test


# ðŸ“Š Evaluate model
def evaluate(model, X_test, y_test):
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    print(f"\nâœ… Accuracy: {acc:.4f}\n")

    print("ðŸ“Š Classification Report:")
    print(classification_report(y_test, y_pred))


# ðŸ’¾ Save model
def save_model(model, path="classifier.joblib"):
    joblib.dump(model, path)
    print(f"\nðŸ’¾ Model saved to {path}")


# ðŸ§ª Quick test predictions
def test_model(model):
    print("\nðŸ§ª Sample Predictions:")

    samples = [
        "Apple launches new AI chip for iPhones",
        "Stock markets fall due to inflation concerns",
        "Amazon expands business operations globally",
        "New vaccine shows promising results in trials"
    ]

    for text in samples:
        pred = model.predict([text])[0]
        print(f"{text} â†’ {pred}")


# ðŸš€ Main pipeline
def main():
    df = load_data("agentic-news-impact\data.csv")

    print(f"Loaded {len(df)} samples")

    model, X_test, y_test = train(df)

    evaluate(model, X_test, y_test)

    save_model(model)

    test_model(model)


if __name__ == "__main__":
    main()
