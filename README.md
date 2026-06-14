# Sangira

**Verified food redistribution platform** — connecting verified surplus-food donors with trusted humanitarian organisations in Kigali, Rwanda, to reduce food waste and feed communities through a reliable, accountable redistribution chain.

**Repository:** [github.com/Lisky-pixel/Sangira](https://github.com/Lisky-pixel/Sangira)

## Table of contents

- [Description](#description)
  - [Key features](#key-features)
  - [Tech stack](#tech-stack)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Configure environment variables](#3-configure-environment-variables)
  - [4. Set up the database](#4-set-up-the-database)
  - [5. Run the development servers](#5-run-the-development-servers)
  - [6. Production build (optional)](#6-production-build-optional)
  - [Useful scripts](#useful-scripts)
- [Designs](#designs)
  - [Figma mockups](#figma-mockups)
  - [Figma prototype](#figma-prototype)
  - [App interface screenshots](#app-interface-screenshots)
- [Deployment plan](#deployment-plan)
- [Video demo](#video-demo)

---

## Description

Sangira is a full-stack web application that coordinates surplus food redistribution between verified donors (hotels, caterers, supermarkets, event organisers) and verified recipient organisations (NGOs, shelters, orphanages) across Kigali.

The platform addresses three gaps identified in existing food-redistribution systems: the absence of organisational **verification**, the lack of reliable **notification infrastructure** for low-connectivity settings, and the absence of **dual-party accountability** for completed transfers. Every organisation is verified by an administrator before it can transact, every food transfer is confirmed by both the donor and the recipient, and time-critical events are communicated by SMS in addition to in-app notifications.

### Key features

| Area                  | Functionality                                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Public**            | Marketing landing page, sign-in, three-step registration, password reset                                                                   |
| **Verification gate** | Document upload, admin review, approval/rejection with reasons — no organisation transacts until verified                                  |
| **Donor portal**      | Dashboard, post surplus food, manage listings, review NGO requests, dual-confirmation pickup (QR + PIN), impact dashboard                  |
| **NGO portal**        | Dashboard with matched listings, browse & filter, request food, capacity management, dual-confirmation pickup                              |
| **Admin console**     | Overview with anomaly flags, verification queue with SLA tracking, user management (flag/suspend/revoke), listings monitor, impact reports |
| **Accounts**          | Role-specific profiles, settings, notification preferences for all three roles                                                             |
| **Notifications**     | In-app notification panel mirroring SMS alerts for new matches, accepted requests, pickup reminders, and confirmations                     |

---

### Tech stack

| Layer        | Technologies                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Shadcn-style UI (Radix + CVA), React Router 7, Axios |
| **Backend**  | Node.js 18+, Express, Mongoose ODM, MongoDB Atlas, Socket.io                                      |
| **Services** | Cloudinary (documents & food images), SMS gateway (time-critical notifications)                   |

---

## Setup

### Prerequisites

| Requirement                                    | Notes                       |
| ---------------------------------------------- | --------------------------- |
| [Node.js](https://nodejs.org/) 18+             | 20 LTS recommended          |
| npm 9+                                         | Bundled with Node.js        |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Or a local MongoDB instance |
| [Git](https://git-scm.com/)                    | For cloning the repository  |

---

### 1. Clone the repository

```bash
git clone https://github.com/Lisky-pixel/Sangira.git
cd Sangira
```

### 2. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Configure environment variables

**Backend** — copy the example file and fill in your values:

```bash
cp server/.env.example server/.env
```

| Variable         | Description                                       |
| ---------------- | ------------------------------------------------- |
| `MONGODB_URI`    | MongoDB Atlas connection string                   |
| `JWT_SECRET`     | Secret for signing auth tokens                    |
| `CLOUDINARY_URL` | Cloudinary credentials for image/document uploads |
| `SMS_API_KEY`    | SMS gateway API key                               |
| `CLIENT_URL`     | Frontend origin (for CORS + Socket.io)            |
| `PORT`           | API port (default `5000`)                         |

---

**Frontend** — copy the example file:

```bash
cp client/.env.example client/.env
```

| Variable       | Description          | Default                     |
| -------------- | -------------------- | --------------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

### 4. Set up the database

Point `MONGODB_URI` at a reachable MongoDB Atlas cluster (or local instance), then seed demo data:

```bash
cd server
npm run seed   # seed admin + demo organisations and listings
```

> Mongoose creates collections on first write, so no migration step is required. The seed script inserts the initial administrator account and demo data.

### 5. Run the development servers

```bash
# Terminal 1 — backend
cd server
npm run dev    # http://localhost:5000

# Terminal 2 — frontend
cd client
npm run dev    # http://localhost:5173
```

Open the app at **[http://localhost:5173](http://localhost:5173)**.

### 6. Production build (optional)

```bash
cd client
npm run build
npm run preview    # http://localhost:4173
```

### Useful scripts

| Command           | Location        | Description                         |
| ----------------- | --------------- | ----------------------------------- |
| `npm run dev`     | client / server | Start dev server                    |
| `npm run build`   | client          | Type-check + production build       |
| `npm run preview` | client          | Preview production build            |
| `npm run lint`    | client          | Run ESLint                          |
| `npm run seed`    | server          | Seed admin + demo data into MongoDB |

---

## Designs

### Figma mockups

**[Sangira's Project — Figma Design](https://www.figma.com/design/OkPjKY4IEVUa7KgodNeEjB/Sangira-s-Project?node-id=0-1&t=6eg7Vif2RqTzShN0-1)**

The complete UI was designed and reviewed screen by screen before implementation, covering all three roles (donor, NGO, admin) and every state, including the verification gate, the dual-confirmation pickup flow, and the admin review console.

---

### Figma prototype

**[Sangira's Project — Interactive Prototype](https://www.figma.com/proto/OkPjKY4IEVUa7KgodNeEjB/Sangira-s-Project?node-id=0-1&t=6eg7Vif2RqTzShN0-1)**

Click through the full user flows — registration, donor and NGO portals, pickup confirmation, and the admin console — as an interactive preview before diving into the live app.

---

### App interface screenshots

Screenshots of implemented screens live in [`docs/design/screenshots/`](docs/design/screenshots/).

| Screen                      | Preview                                                                          |
| --------------------------- | -------------------------------------------------------------------------------- |
| Landing page                | [01-landing.png](docs/design/screenshots/01-landing.png)                         |
| Registration & verification | [02-registration.png](docs/design/screenshots/02-registration.png)               |
| Donor dashboard             | [03-donor-dashboard.png](docs/design/screenshots/03-donor-dashboard.png)         |
| Post a listing              | [04-post-listing.png](docs/design/screenshots/04-post-listing.png)               |
| NGO dashboard & matching    | [05-ngo-dashboard.png](docs/design/screenshots/05-ngo-dashboard.png)             |
| Dual-confirmation pickup    | [06-pickup-confirmation.png](docs/design/screenshots/06-pickup-confirmation.png) |
| Admin verification queue    | [07-admin-verification.png](docs/design/screenshots/07-admin-verification.png)   |

---

## Deployment plan

| Phase                       | Platform                                       | Purpose                                                            |
| --------------------------- | ---------------------------------------------- | ------------------------------------------------------------------ |
| **Phase 1 — Frontend**      | [Vercel](https://vercel.com/)                  | React app, static hosting + CDN                                    |
| **Phase 2 — Backend**       | [Render](https://render.com/)                  | REST API, authentication, business logic, Socket.io                |
| **Phase 3 — Data**          | [MongoDB Atlas](https://www.mongodb.com/atlas) | Users, listings, requests, confirmations                           |
| **Phase 4 — Assets**        | [Cloudinary](https://cloudinary.com/)          | Verification documents and food-listing images                     |
| **Phase 5 — Notifications** | SMS gateway integration                        | Time-critical alerts (matches, acceptances, expiry, confirmations) |
| **Phase 6 — Domain**        | Custom domain (e.g. `app.sangira.rw`)          | Production URL + SSL                                               |

---

## Video demo

A **5–10 minute** walkthrough demonstrating the platform's core flows (donor, NGO, and admin):

**[Watch on Google Drive →](https://drive.google.com/drive/folders/1j62ls5-AamBS4uboGOSMdm_Juq6cFP28?usp=sharing)**

---
