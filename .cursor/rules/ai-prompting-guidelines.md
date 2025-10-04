# 🤖 AI Prompting & Model Integration Guidelines

## Overview
This project uses **Google Gemini Free-tier Models** as the AI engine for:
- Processing project descriptions and details
- Generating user stories and time estimations
- Producing Jira-ready CSV data

Gemini will be responsible for all **planning and reasoning tasks**, while the React app handles **data collection** and **result rendering**.

---

## 🎯 Model & API
- **Provider:** Google AI (Gemini)
- **Model:** `gemini-2.5-flash` (preferred)
- **API Access:** via [Google AI Studio](https://makersuite.google.com/app/apikey)
