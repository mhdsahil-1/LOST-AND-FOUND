# Campus Lost & Found · Pure JavaScript Full-Stack Edition

A modern, responsive, and clean full-stack web application designed to help campus students, faculty, and security staff report, browse, claim, and recover misplaced belongings. Built with **React 19**, **Node.js Express backend**, **FontAwesome 6 icons**, and a **clean, Cupertino-inspired design** that works seamlessly across all devices (desktops, laptops, tablets, and mobile phones).

---

## 🏗️ Architecture & How It Works

This project is a 100% JavaScript full-stack application structured into two clean tiers:

```
LOST-AND-FOUND/
├── client/                     # React 19 Frontend (Vite)
│   ├── src/
│   │   ├── context/AppContext.jsx   # Central state manager (Items, User, Alerts, Filters)
│   │   ├── services/api.js          # REST API Client with automatic offline fallback
│   │   ├── services/storageService.js # LocalStorage sync and offline backup
│   │   ├── utils/imageUrl.js        # Universal image URL resolver (uploads/base64/cdn)
│   │   ├── components/
│   │   │   ├── layout/Navbar.jsx    # Responsive desktop navbar & mobile tabs
│   │   │   ├── views/               # Explore, Browse, Post, My Posts, Admin
│   │   │   ├── items/               # ItemCard, ItemDetailModal, ClaimModal, FilterSheet
│   │   │   └── common/              # FontAwesomeIcon, Badge, SegmentedControl, etc.
│   │   └── index.css                # Clean, responsive CSS with Dark/Light theme
│   └── vite.config.ts               # Proxies /api and /uploads to backend (port 5000)
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── index.js                 # Express server with CORS & static file routes
│   │   ├── db.js                    # Portable JSON database layer (matches legacy PHP)
│   │   ├── data/                    # JSON database files (items.json, categories.json)
│   │   └── routes/
│   │       ├── items.js             # Items CRUD, search, claim, & image upload
│   │       ├── admin.js             # Moderator verification queue & analytics
│   │       └── auth.js              # Student & Admin authentication
│   └── uploads/                     # Uploaded campus item photos
│
└── legacy-php/                 # Archived original PHP codebase for reference
```

### 1. The Client Tier (`client/`)
- **React 19 + Vite**: High performance, instant compilation (~250ms), and 0 build errors.
- **`AppContext.jsx`**: Manages global state. On initial load, it fetches items from the backend API (`/api/items`). When online, every action (posting an item, submitting a claim, approving a post, or deleting) persists immediately to the Express backend. If the backend is ever offline, it gracefully falls back to browser `localStorage` so the UI never crashes.
- **FontAwesome 6**: Consistent vector icons used for categories (electronics, books, bags, cards, keys, clothing, accessories, etc.), action buttons, status pills, and empty states.
- **Adaptive UI**: Responsive layouts that adjust naturally between desktop multi-column grids and mobile single-column cards with touch controls—without any fake phone borders or flashing elements.
- **Vite Proxy**: `client/vite.config.ts` automatically proxies `/api` and `/uploads` to `http://localhost:5000`, eliminating CORS issues during development.

### 2. The Server Tier (`server/`)
- **Express REST API**: Lightweight Node.js server running on port `5000`.
- **JSON Database Engine (`server/src/db.js`)**: Matches the original PHP file-based storage architecture. Persists data to `server/src/data/items.json` with atomicity, indexing, filtering, and search capabilities.
- **File Uploads (`Multer` & Base64 Decoder)**: Supports direct multipart form uploads (`POST /api/items`) as well as JSON payloads containing base64 data URLs. Saves uploaded photos to `server/uploads/` with unique filenames (`item_<timestamp>_<hash>.<ext>`) and serves them statically at `/uploads/`.
- **Moderator Queue & Verification Logic**: Items submitted by students enter a `pending` status by default. Campus administrators review them in the Moderator Console (`GET /api/admin/queue`) and can approve them (`PUT /api/admin/verify/:id`) to make them publicly visible on the explore feed.
- **Claim & Fraud Prevention**: When someone claims a found item, they must submit ownership details (e.g. device serial numbers, student ID card, or distinguishing marks) which are attached to the item record.

---

## 🚀 How to Run the Application

You can run the backend and frontend in two terminal windows:

### Terminal 1: Start the Backend (Port 5000)
```bash
# From the project root:
npm run server
```
*Or navigate into `server` and run `npm start`.*  
The server will start on `http://localhost:5000`. Health check available at `http://localhost:5000/api/health`.

### Terminal 2: Start the Frontend (Port 5173)
```bash
# From the project root:
npm run client
```
*Or navigate into `client` and run `npm run dev`.*  
Open your browser and visit:
```
http://localhost:5173
```

---

## 🔑 Login Accounts (Matching Legacy PHP)

- **Student Login**:
  - Click the user avatar in the top right.
  - Choose **Student** and enter any student name (e.g., `Ahmad Farooq` or `Sarah Khan`).
  - No password required (just like the original `legacy-php/login.php`).
- **Admin Login**:
  - Choose **Campus Proctor / Admin**.
  - **Username**: `admin`
  - **Password**: `admin123`
  - Grants access to the Moderator Console, Verification Queue, and full item deletion/approval controls.

---

## 🛠️ Verification & Testing

- **Client Linting**: `npm --prefix client run lint` (0 errors)
- **Production Build**: `npm --prefix client run build` (Builds cleanly in ~250ms)
- **Database Layer**: `node server/src/db.js` (Verified operational)
- **Dependencies**: Clean npm packages, 0 vulnerabilities, heavy `venv` directories removed.
