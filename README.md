# E-commerce (Full-Stack Learning)

A simple full-stack e-commerce example app built with:

- Frontend: React (Vite) + Clerk for auth
- Backend: Node.js (Express)
- Database: SQLite (simple file-based DB at `server/database.sqlite`)
- File uploads: served from `/uploads`
- API docs: Swagger UI at `/api-docs`

This repository contains two main folders:

- `client/` — React app (Vite) that consumes the server API
- `server/` — Express API server with endpoints for auth, sellers, buyers, and admin

---

## Quick start (developer)

Requirements

- Node.js (16+ recommended)
- npm (or pnpm/yarn)
- Optional: Clerk account for authentication (used in client & server)

1. Clone the repo

```powershell
git clone <your-repo-url>
cd E-commerce
```

2. Install dependencies

```powershell
# Server
cd server
npm install

# Client (open a new terminal for client)
cd ..\client
npm install
```

3. Environment variables

Create `.env` files in the `server/` and `client/` directories as needed.

Recommended variables:

- server/.env

  - `PORT` (optional, defaults to 5000)
  - `CLERK_SECRET_KEY` (if using Clerk server-side features)
  - Any other secrets you configure for Clerk/webhooks

- client/.env
  - `VITE_API_URL` — e.g. `http://localhost:5000` (used to call the server API)
  - `VITE_CLERK_PUBLISHABLE_KEY` — your Clerk publishable key

Notes:

- The server uses a local SQLite file by default: `server/database.sqlite`.
- If you want to swap to Postgres or another DB, update `server/src/config/db.js` accordingly.

4. Run servers

Open two terminals.

Terminal 1 — server:

```powershell
cd server
npm start
```

Terminal 2 — client:

```powershell
cd client
npm run dev
```

Open the client in the browser (Vite default): http://localhost:5173
The API server listens at http://localhost:5000 (or `PORT` you set).

---

## Project structure (important files)

- client/
  - `src/main.jsx` — routing + Clerk provider
  - `src/pages/ProductDetailPage.jsx` — product detail view (fetches `/api/buyer/products/:id`)
  - `src/pages/CartPage.jsx` — localStorage-based cart
- server/
  - `index.js` — app entry, mounts routes, Swagger setup
  - `src/routes/` — express routes: `authRoutes.js`, `buyerRoutes.js`, `sellerRoutes.js`, `adminRoutes.js`
  - `src/controllers/` — controllers for auth, buyer, seller, admin
  - `src/models/` — DB helpers (SQLite queries)
  - `src/config/db.js` — DB connection (SQLite by default)
  - `uploads/` — static folder used for uploaded media (served at `/uploads`)

---

## API overview

Swagger UI (interactive docs):

- http://localhost:5000/api-docs

Selected endpoints:

- Auth

  - POST `/api/auth/register` — register/update user role
  - GET `/api/auth/me` — (authenticated) get current user
  - GET `/api/auth/role` — (authenticated) get current user role
  - POST `/api/auth/webhook` — Clerk webhook

- Buyer (public read endpoints)

  - GET `/api/buyer/products` — list products
  - GET `/api/buyer/products/:id` — product details (includes `seller_name` & `seller_email`)

- Seller (requires seller auth)

  - POST `/api/seller/products` — add product (multipart/form-data, file upload)
  - GET `/api/seller/products/my` — get seller's own products
  - GET `/api/seller/products/all` — all products
  - PUT `/api/seller/products/:id` — update product
  - DELETE `/api/seller/products/:id` — delete product

- Admin (requires admin auth) — see `server/src/routes/adminRoutes.js` for endpoints

Notes:

- Static uploads served at: `http://<server-host>:<port>/uploads/<filename>`
- Product detail responses include `seller_name` and `seller_email` when available (joined from `users` table).

---

## Frontend notes

- Router paths (client):
  - `/` — home
  - `/buyer/dashboard` — buyer product listing
  - `/seller/dashboard` — seller dashboard
  - `/product/:id` — product detail page
  - `/cart` — cart page
- Clerk: the client must be initialized with `VITE_CLERK_PUBLISHABLE_KEY` set in `client/.env`.
- The product detail page fetches product data from `${VITE_API_URL}/api/buyer/products/:id`.

---

## Development tips & troubleshooting

- If product pages show "Failed to load product":

  - Open browser DevTools → Network and inspect the GET `/api/buyer/products/:id` response and status code.
  - If the server returns 401/403, ensure protected routes are not mounted globally. The app currently mounts buyer routes publicly; if you re-enable auth, the client must send a Clerk token.
  - If 404, check the ID is valid and that `server/database.sqlite` contains products.
  - Check server console/logs for stack traces.

- If file uploads don't display, ensure `uploads/` exists and files were saved; server serves uploads from `/uploads`.

- If the client fails to build due to JSX parse errors (Vite shows the file and line), fix the JSX syntax in the file shown by the error message.

---

## Testing & linting

This project currently doesn't include automated tests. To add tests, pick your preferred test runner (Jest / Vitest for client, Jest / supertest for server) and create a lightweight test harness.

---

## Contributing

- Fork the repo, create a branch, and open a PR describing your changes.
- Keep changes small and focused. Add tests for any new behavior.

---

## License

This project is provided as-is for learning purposes. Add a license file if you want to open-source it.

---

If you'd like, I can also:

- Add a short `README` to the `client/` and `server/` directories with targeted setup steps.
- Add a dev script to the root `package.json` to start client + server concurrently.

Tell me which follow-up you'd like and I'll add it.
