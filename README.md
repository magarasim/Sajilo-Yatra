 Sajilo Yatra – Team 402 3rror

Helping anyone navigate Nepal’s public transport in seconds — without confusion.

With Sajilo Yatra, a user can instantly know:
- Which vehicle to take  
- Where to board and where to get off  
- Approximately how much to pay  

All in under **10 seconds** for major routes inside Kathmandu.

---

## Team

| Name | Role / Ownership | Contact |
| --- | --- | --- |
| Anchit Gautam | Backend / API / Architecture | anchitgautam64@gmail.com / +977 9761888533 |
| Bipen Shakya | Frontend / UI | bipenshakya239@gmail.com / +977 9840783122 |
| Asim Pun Magar | Frontend / Data / Research / UI | asimmagar20@gmail.com / +977 9767224983 |
| Nistee Bhatta | Presentation / UX | bhattanistee@gmail.com / +977 9765962935 |

**Team name:** 402 3rror

---

## Judge-ready intros

Anchit built the backend APIs, route logic, and system architecture.  
Bipen built the React interface and user flow.  
Asim collected and structured transport data and worked on UI.  
Nistee worked on usability, research, and presentation.

---

## Project snapshot – where we stand now

### Route Search (MVP)

- User enters **From** and **To** on the homepage.
- Frontend calls `GET /api/route` on the Express backend.
- Backend checks Supabase (`stops` + `routes`) and returns:
  - pickup stop  
  - destination stop  
  - vehicle name  
  - estimated fare  
  - vehicle image (if available)

---

### SY Assistant (Chatbot)

A focused, transport-aware assistant available directly on the homepage.

- Communicates with `POST /api/chat`.
- Example questions:
  - “How do I go from Ratnapark to Koteshwor?”
  - “Which bus from Ratnapark to Baneshwor?”

It uses:
- Database route lookup  
- A curated static list of popular hackathon routes  

The assistant is designed to be **direct, short, and on-topic**.

---

### Complaint Flow

Users can report issues such as:
- overcharging  
- unsafe behavior  
- other incidents  

They submit:
- vehicle number  
- organization/operator  
- optional description  

Data is stored in Supabase.  
Users receive a **Complaint ID** and can later check whether it is:

`pending → solved → removed`

---

### Admin Dashboard

A centralized control panel for transport data.

Admins can manage:
- Vehicles (name + image)  
- Stops (with coordinates)  
- Routes (vehicle ↔ stops ↔ fare)  
- Proposed routes (approve & reward)  
- Complaints (update/delete)

All endpoints are under: `/api/admin/...`

---

### User Accounts & Contributions

- Login/signup via Supabase.  
- Users can submit new route proposals with photos.  
- After admin approval:
  - the route becomes official  
  - the contributor receives reward points  

---

## Problem & users

### Primary users
- Tourists  
- Students  
- New residents  
- First-time public transport riders  

### Pain today
People often:
- don’t know which vehicle to take  
- are unsure about stops  
- get overcharged  
- waste time asking around  

### Success condition

A person in Kathmandu should know:
- what to take  
- from where  
- what to pay  

within **10 seconds**.

---

## Current MVP capabilities

### Route lookup
- Case-insensitive stop matching.  
- Endpoint:  
  `GET /api/route?from=Ratnapark&to=Pulchowk`
- Optional GPS nearest-stop detection using the Haversine formula.

---

### Chatbot assistant
- Restricted strictly to transport topics.  
- Attempts DB search first.  
- Falls back to a curated emergency list including routes like:
  - Ratnapark → Baneshwor / Tinkune / Koteshwor  
  - Gongabu → Thamel  
  - Balkhu → Kalimati  

---

### Complaints
Admins can:
- view  
- update status  
- delete  

Users can track complaints anytime using their ID.

---

### Admin tools
- Vehicle CRUD with image upload  
- Stops CRUD with coordinate validation  
- Routes CRUD  
- Proposed routes  
  - Approve → create + reward user  
  - Delete → remove from queue  

---

## Tech stack

### Frontend
- React (Vite)
- React Router
- React Icons
- Modular CSS

### Backend
- Node.js
- Express
- Supabase client
- Multer
- Bcrypt
- CORS
- dotenv

### Database (Supabase Postgres)

Tables:
- vehicles  
- stops  
- routes  
- users  
- proposed_routes  
- complaints  

---

## Code structure (high level)

src/main.jsx → React entry
src/App.jsx → routing & global state
src/pages/Home.jsx → search + results + chatbot
src/pages/Complain.jsx → complaint system
src/pages/AdminDashboard.jsx → admin tools

src/backend/server.js
src/backend/controllers/routeController.js
src/backend/services/routeService.js
src/backend/services/stopService.js


---

## Local development

### Prerequisites
Node.js **18+**

---

### Install dependencies

npm install

Backend environment

Create: src/backend/.env

SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
PORT=5000
OPENAI_API_KEY=your_key

Run backend

node src/backend/server.js

Runs on:
http://localhost:5000
Run frontend

npm run dev

Usually:
http://localhost:5173
How to test quickly

    Open homepage

    From: Ratnapark

    To: Pulchowk

    Click Search route

You will receive:

    vehicle

    fare

    instruction

You can also:

    use the chatbot

    submit a complaint

    log in as admin and manage the system

Roadmap / future scope

    Expand to more cities

    Real-time vehicle tracking

    Crowd-sourced updates

    Multi-language interface

    Integration with official transport data