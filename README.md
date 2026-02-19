# Sajilo Yatra
### Intelligent Public Transport Navigation System for Kathmandu

Sajilo Yatra is a full-stack web application designed to simplify public transportation navigation within Kathmandu. The system enables users to determine the correct vehicle, boarding location, drop-off point, and estimated fare within seconds.

Developed during **SanKalpa 2026**, organized by *Whitehouse Innovators* at *Himalayan Whitehouse International College* (13 February 2026).

---

# 1. Executive Summary

Public transportation in Kathmandu lacks structured, accessible, and reliable digital route information. Commuters frequently rely on verbal inquiries, resulting in confusion, time loss, and fare inconsistencies.

Sajilo Yatra addresses this problem by providing:

- Structured route lookup
- Fare estimation
- Transport-focused assistant
- Complaint tracking system
- Administrative data management tools

The system is built with a scalable full-stack architecture using React, Node.js, Express, and Supabase.

---

# 2. My Role & Contribution

**Asim Pun Magar – Frontend Development & Transport Data Structuring**

Primary responsibilities:

- Designed and implemented the React frontend (Vite-based architecture)
- Built core UI components and routing system
- Structured and validated transport route data
- Integrated frontend with backend REST APIs
- Contributed to chatbot response structure for transport queries
- Improved usability and interface clarity for first-time users

My focus was on creating a fast, intuitive, and accessible interface suitable for students, tourists, and new residents.

---

# 3. System Architecture Overview

The system follows a modular full-stack architecture:

Frontend (React + Vite)  
⬇  
Express REST API  
⬇  
Supabase (PostgreSQL Database)

Key Components:

- Route search engine
- Transport chatbot service
- Complaint management module
- Admin dashboard
- User contribution system

---

# 4. Core Functional Modules

## 4.1 Route Search (MVP)

Users input origin and destination stops.

Example Endpoint:
```
GET /api/route?from=Ratnapark&to=Pulchowk
```

Backend Process:
- Case-insensitive stop matching
- Route validation using Supabase tables
- Fare retrieval
- Optional nearest-stop detection using Haversine formula

Response Includes:
- Pickup stop
- Destination stop
- Vehicle name
- Estimated fare
- Vehicle image (if available)

---

## 4.2 SY Assistant (Transport Chatbot)

A domain-restricted assistant focused strictly on public transport queries.

Endpoint:
```
POST /api/chat
```

Behavior:
- Attempts database route lookup first
- Falls back to curated hackathon route dataset
- Returns concise, actionable responses
- Rejects non-transport queries

Example Queries:
- “How do I go from Ratnapark to Koteshwor?”
- “Which bus from Ratnapark to Baneshwor?”

---

## 4.3 Complaint Management System

Users can submit reports for:

- Overcharging
- Unsafe behavior
- Service misconduct

Submission Fields:
- Vehicle number
- Operator/organization
- Description (optional)

Each complaint receives a unique ID and status lifecycle:

```
pending → solved → removed
```

Data is stored in Supabase.

---

## 4.4 Admin Dashboard

Administrative control panel for system management.

Capabilities:

- Vehicle CRUD (with image upload)
- Stops CRUD (coordinate validation)
- Routes CRUD
- Proposed route approval & reward logic
- Complaint status management

Admin Endpoints:
```
/api/admin/...
```

---

## 4.5 User Accounts & Route Contributions

Authentication handled via Supabase.

Users can:
- Register / Login
- Submit proposed routes (with photo evidence)
- Receive reward points after approval

This encourages community-driven data expansion.

---

# 5. Technology Stack

## Frontend
- React (Vite)
- React Router
- React Icons
- Modular CSS

## Backend
- Node.js
- Express.js
- Supabase Client
- Multer (File Uploads)
- Bcrypt (Authentication Security)
- CORS
- dotenv

## Database
Supabase PostgreSQL

Core Tables:
- vehicles
- stops
- routes
- users
- proposed_routes
- complaints

---

# 6. Code Structure (High-Level)

```
src/
 ├── main.jsx
 ├── App.jsx
 ├── pages/
 │    ├── Home.jsx
 │    ├── Complain.jsx
 │    ├── AdminDashboard.jsx
 │
 └── backend/
      ├── server.js
      ├── controllers/
      ├── services/
```

The project follows separation of concerns and modular architecture for scalability.

---

# 7. Local Development Setup

## Prerequisites

- Node.js 18+
- npm

---

## Installation

```bash
npm install
```

---

## Backend Configuration

Create:

```
src/backend/.env
```

Add:

```
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
PORT=5000
OPENAI_API_KEY=your_key
```

---

## Run Backend

```bash
node src/backend/server.js
```

Runs on:
```
http://localhost:5000
```

---

## Run Frontend

```bash
npm run dev
```

Typically runs on:
```
http://localhost:5173
```

---

# 8. Functional Test Example

Input:
From: Ratnapark  
To: Pulchowk  

Output:
- Vehicle name
- Estimated fare
- Boarding instructions

Additional tests:
- Chatbot transport queries
- Complaint submission
- Admin dashboard operations

---

# 9. Problem Impact & Vision

Target Users:
- Tourists
- Students
- New residents
- First-time transport users

Impact Goal:

Enable any commuter in Kathmandu to determine:
- What vehicle to take
- Where to board
- How much to pay

Within 10 seconds.

---

# 10. Future Roadmap

- Expansion beyond Kathmandu
- Real-time vehicle tracking
- Multi-language support
- Official transport authority integration
- Mobile application version
- Crowd-sourced live updates

---

# 11. Author

Asim Pun Magar  
Frontend Developer  

GitHub: https://github.com/asimmagar20  

---

# 12. License

This project is open-source and available under the MIT License.
