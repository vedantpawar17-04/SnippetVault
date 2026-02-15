🚀SnippetVault – Full Stack MERN Code Snippet Manager

SnippetVault is a full-stack MERN application that allows developers to store, manage, explore, and discover reusable code snippets.
It supports authentication, public snippet sharing, syntax-based similarity detection, favorites, and structured code analysis.

🏗️Project Architecture

This project follows a MERN stack architecture:

MongoDB – Database for storing users and snippets

Express.js – Backend REST API

React (Vite) – Frontend client

Node.js – Server runtime

📁Project Structure
SnippetVault/
│
├── backend/                # Node.js + Express + MongoDB API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── swagger/
│   └── server.js
│
├── SnippetVault/           # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md

▶️How to Run the Project
🔹 Backend Setup

Navigate to backend:

cd backend
Install dependencies:
npm install
Start development server:
npm run dev
Server runs on:
http://localhost:5000

Swagger API Documentation:
http://localhost:5000/api-docs

🔹 Frontend Setup
Navigate to frontend:
cd SnippetVault
Install dependencies:
npm install

Start development server:
npm run dev


Frontend runs on:
http://localhost:5173

🔐Authentication Features

User Signup
User Login
JWT-based authentication
Middleware route protection
Secure password hashing
Token verification on protected routes
Logout functionality
All protected routes require valid authentication middleware.

📌Snippet Management Features
CRUD Operations
Users can:
Create new snippets
View all public snippets
Edit only their own snippets
Delete only their own snippets

Ownership is strictly enforced at the database level.

⭐Favorites System
Any user can mark any snippet as favorite
Favorites are user-specific
Snippet owner cannot control others’ favorites
Favorites stored as user references

🔎Search & Filtering
Users can:
Search snippets by title
Filter by language
Filter by tags
View only favorite snippets
Sort and browse publicly shared content

🧠Syntax-Based Similar Snippets
When viewing a snippet, the system:
Extracts structured syntax tokens during save
Stores metadata such as:
Hooks
Async patterns
Loops
Conditionals
Functions
Matches snippets based on structural similarity
Displays 3–5 related snippets
Does not block duplicates
This improves content discovery without restricting uploads.

⚠️Duplicate Detection (Non-Blocking)
Before publishing:
System checks for similar snippets
Shows warning modal:
“A similar snippet already exists. Do you want to continue?”

User can:
Continue
Cancel
Duplicates are allowed to preserve flexibility.

🎨UI Features
Modern responsive dashboard
Mobile & tablet optimized layout
Fixed desktop sidebar
Toggleable mobile sidebar
Structured snippet editor
Interview Answer field (mandatory)
Tag system
Interactive UI Blocks section (view & copy only)

🧱UI Blocks Section
A dedicated section providing:
Setup blocks
Component blocks
Layout blocks
Preview + Copy functionality
No database storage for blocks
Designed to help developers quickly bootstrap UI components.

📊Database Design
User Collection
_id
name
email
password (hashed)
createdAt

Snippet Collection
_id
title
code
language
tags
interviewAnswer (required)
syntaxTokens
codeStructure
user (ObjectId reference)
favorites (Array of userIds)
createdAt

🛡Security & Authorization
JWT authentication
Route-level middleware protection
Ownership validation before update/delete
User data isolation
No global duplicate blocking
Secure password hashing

📘Swagger Documentation
All backend REST APIs are documented using Swagger.
Access via:
http://localhost:5000/api-docs
Includes:
Auth routes
Snippet routes
CRUD endpoints
Request/response examples

🚀Extended Features
Public snippet platform model
Syntax-based similarity engine
Structured code analysis
Duplicate detection warning system
User-specific favorites
Responsive mobile experience
Interview preparation support

🏆Why This Project Stands Out
Real multi-user architecture
Secure ownership enforcement
Structured similarity recommendation system
Public + controlled interaction model
Clean MERN separation
Production-style API documentation

🎓Academic Explanation (Short Summary)
SnippetVault is a full-stack MERN web application that allows users to create, manage, and explore code snippets in a public environment. The system enforces ownership control, supports syntax-based similarity detection, and includes structured metadata extraction to improve content discovery.

📦Future Improvements
Clone snippet feature
Like count system
Commenting system
Reporting inappropriate content
AI-based semantic similarity
Deployment to cloud (Render / Vercel)

📜License
This project is for educational and portfolio purposes.