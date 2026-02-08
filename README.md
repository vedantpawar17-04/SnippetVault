# SnippetVault - Full Stack MERN Application

This project consists of a Node.js/Express backend and a React/Vite frontend.

## Structure

- `backend/`: Node.js + Express + MongoDB backend.
- `SnippetVault/`: React + Vite Frontend (Client).

## Setup & Running

### Prerequisites

- MongoDB must be running locally on port 27017, or update `backend/.env` with your Mongo URI.

### Backend

1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`.
   Swagger Docs: `http://localhost:5000/api-docs`.

### Frontend

1. Navigate to `SnippetVault` folder:
   ```bash
   cd SnippetVault
   ```
2. Install dependencies (if not already):
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`.

## Features

- **Authentication**: Signup/Login with JWT.
- **Dashboard**: Create, Read, Update, Delete Snippets.
- **Search & Filter**: Filter snippets by tags, language, or favorites.
- **Swagger Documentation**: API endpoints documented.
