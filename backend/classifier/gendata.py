import csv
import random

SECTORS = {
    "technology": [
        "AI", "machine learning", "cloud computing", "cybersecurity",
        "semiconductors", "software", "data centers", "blockchain"
    ],
    "finance": [
        "stock market", "interest rates", "inflation", "banking",
        "investment", "bonds", "federal reserve", "crypto markets"
    ],
    "business": [
        "expansion", "merger", "acquisition", "revenue growth",
        "CEO strategy", "global operations", "supply chain", "partnership"
    ],
    "health": [
        "clinical trials", "vaccine", "FDA approval", "drug development",
        "biotech research", "public health", "disease prevention", "medical study"
    ]
}

TEMPLATES = [
    "{company} announces major developments in {keyword}",
    "{company} reports strong growth in {keyword}",
    "{keyword} drives new strategy at {company}",
    "{company} invests heavily in {keyword}",
    "Experts discuss impact of {keyword} on {company}",
    "{company} faces challenges due to changes in {keyword}",
    "{keyword} expected to shape future of {company}",
    "{company} expands operations focusing on {keyword}"
]

COMPANIES = [
    "Apple", "Google", "Microsoft", "Amazon", "Tesla",
    "JPMorgan", "Goldman Sachs", "Pfizer", "Moderna", "Meta"
]


def generate_samples(n_per_sector=75):
    data = []

    for sector, keywords in SECTORS.items():
        for _ in range(n_per_sector):
            template = random.choice(TEMPLATES)
            keyword = random.choice(keywords)
            company = random.choice(COMPANIES)

            text = template.format(company=company, keyword=keyword)

            data.append({
                "text": text,
                "label": sector
            })

    return data


def save_csv(data, filename="data.csv"):
    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["text", "label"])
        writer.writeheader()
        writer.writerows(data)


def main():
    data = generate_samples(n_per_sector=75)  # 75 x 4 = 300
    print(f"Generated {len(data)} samples")

    save_csv(data)
    print("Saved to data.csv ✅")


if __name__ == "__main__":
    main()