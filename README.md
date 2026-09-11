Website Link - https://hmstock-screener.netlify.app/

#  Stock Screener

A full-stack web application for analyzing Indian stocks through company financials, ratios, balance sheets, shareholding patterns, and market data.

Built with **React + TypeScript**, **FastAPI**, **SQLAlchemy**, and **MySQL**, with current market prices fetched using **Yahoo Finance (yfinance)**.

---

##  Features

*  Search companies by stock symbol
*  Company overview dashboard
*  Current market price using Yahoo Finance
*  Financial results and historical data
*  Profit & Loss and Balance Sheet
*  Financial ratios — P/E, ROE, ROCE, EPS, etc.
*  Shareholding pattern
*  REST API connecting frontend and backend
*  Relational MySQL database
*  Cloud-ready frontend, backend and database architecture

---

##  Tech Stack

| Layer           | Technology                            |
| --------------- | ------------------------------------- |
| Frontend        | React, TypeScript, Vite, Tailwind CSS |
| Backend         | Python, FastAPI                       |
| ORM             | SQLAlchemy                            |
| Database        | MySQL                                 |
| Market Data     | Yahoo Finance / yfinance              |
| Deployment      | Netlify/Vercel, Render, Aiven         |
| Version Control | Git & GitHub                          |

---

##  Architecture

```text
User
 │
 ▼
React + TypeScript
 │
 │ REST API
 ▼
FastAPI Backend
 │
 ├──────► Yahoo Finance
 │         (Market Price)
 │
 ▼
SQLAlchemy
 │
 ▼
MySQL / Aiven
```

The frontend communicates with the backend through REST APIs and **never directly accesses the database**.

---

##  Project Status

### Implemented

* [x] React frontend
* [x] FastAPI backend
* [x] MySQL + SQLAlchemy integration
* [x] Company search
* [x] Company dashboard
* [x] Financial results
* [x] Balance Sheet
* [x] Financial ratios
* [x] Shareholding Pattern
* [x] Company information
* [x] Current market price integration
* [x] Git/GitHub workflow

### Planned

* [ ] Interactive stock charts
* [ ] Cash Flow data
* [ ] Advanced stock screening
* [ ] Peer comparison
* [ ] Automated testing
* [ ] Additional financial metrics

---

##  Running Locally

### Backend

```bash
cd backend
python -m venv venv
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd UI
npm install
npm run dev
```

Create a `.env` file for database credentials. **Never commit secrets to GitHub.**

---

##  Git Workflow

```text
prototype → Development → Testing → Pull Request → main
```

The project uses a collaborative Git workflow with feature development, pull requests, and code review.

---

##  Goal

To build a practical, scalable stock-analysis platform while applying real-world concepts in **full-stack development, REST APIs, database design, third-party API integration, cloud deployment, and collaborative Git workflows**.

---

##  Repository

**GitHub:** https://github.com/himanshuj9/StockScreenerApp

> **Disclaimer:** Market data is provided through third-party services and may be delayed. This project is for educational and software-development purposes and is not financial advice.

<img width="970" height="1076" alt="image" src="https://github.com/user-attachments/assets/3f08517b-8e38-48d4-9c45-e31821ea386b" />

this is the basic structure of our DB and shows how we have linked all the companies together .

