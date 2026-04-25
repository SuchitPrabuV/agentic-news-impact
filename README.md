# Agentic AI News Impact

This project fetches sector-specific news, classifies articles into supported sectors, and generates an impact analysis for a selected article.

## Stack

- Backend: FastAPI
- Frontend: React + Vite + Tailwind CSS
- ML: scikit-learn text classifier stored in `backend/classifier/classifier.joblib`
- External APIs: NewsAPI for article retrieval and Sarvam for impact generation

## Project Structure

- `backend/`: FastAPI app, classifier, and service layer
- `frontend/`: React client
- `docs/`: project notes
- `data.csv`: training data used by the classifier scripts

## Prerequisites

- Python 3.11+ recommended
- Node.js 20+ and npm
- A `NEWS_API_KEY`
- A `SARVAM_API_KEY`

## Environment Setup

Create a root `.env` file from `.env.example`:

```env
NEWS_API_KEY=your_newsapi_key_here
SARVAM_API_KEY=your_sarvam_api_key_here
SARVAM_MODEL=sarvam-m
VITE_API_BASE_URL=http://localhost:8000
```

Notes:

- `NEWS_API_KEY` is required for `GET /api/news`.
- `SARVAM_API_KEY` is required for `POST /api/predict`.
- `VITE_API_BASE_URL` is optional if the frontend should talk to a backend running somewhere other than `http://localhost:8000`.

## How To Run

### 1. Start the backend

From the repository root:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r backend\requirements.txt
uvicorn backend.main:app --reload
```

Backend will start on `http://127.0.0.1:8000`.

### 2. Start the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend will start on the Vite dev URL shown in the terminal, usually `http://127.0.0.1:5173`.

## Available API Endpoints

- `GET /api/news?sectors=technology,finance`
- `POST /api/predict`

Example prediction request body:

```json
{
  "headline": "NVIDIA launches a new AI accelerator",
  "content": "The new chip targets enterprise inference workloads.",
  "sector": "technology"
}
```

Supported sectors:

- `technology`
- `finance`
- `business`
- `health`

## Verification

The following checks were run successfully during the update:

- `python -m compileall backend`
- `python -c "import backend.main; print('backend import ok')"`
- `cd frontend && npm run lint`
- `cd frontend && npm run build`

Python 3.13 note:

- `backend/requirements.txt` now uses `numpy==2.2.3` and `scipy==1.15.1` so Windows + Python 3.13 installs use wheels instead of attempting a local C build.

Expected API behavior without keys:

- `/api/news` returns `503` when `NEWS_API_KEY` is missing
- `/api/predict` returns `500` when `SARVAM_API_KEY` is missing

## Classifier Utilities

Generate synthetic data:

```powershell
python backend\classifier\gendata.py
```

Train and save the classifier:

```powershell
python backend\classifier\train_model.py
```

## Troubleshooting

- If PowerShell blocks `npm`, run commands from `cmd` or relax your execution policy for your local shell.
- If the frontend cannot reach the backend, confirm `VITE_API_BASE_URL` and that the FastAPI server is running on port `8000`.
- If prediction requests fail, verify `SARVAM_API_KEY` is present in the root `.env`.
- If news requests fail, verify `NEWS_API_KEY` is present in the root `.env`.
