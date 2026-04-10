# Vehicle-Record-System
A digital vehicle service tracking system. This system manages vehicle records, maintenance history, and service issues in one place.

## Docker

The project can be run as a three-container stack:

- `mongodb` for persistence
- `backend` for the Express API
- `frontend` for the static UI served by Nginx with `/api` proxied to the backend

### Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

Once started:

- Frontend: http://localhost
- API through Nginx: http://localhost/api/records
- Backend directly: http://localhost:3000/api/records
- MongoDB: mongodb://localhost:27017/vehicle-records

## Backend

The backend is a Node.js + Express API that stores service records in MongoDB using Mongoose.

### Run locally

1. Ensure you have MongoDB running locally or set `MONGODB_URI` to a MongoDB connection string.
2. From the `backend/` folder:

```bash
npm install
npm start
```

By default, the server will run on http://localhost:3000 and serve the frontend from `frontend/`.

When the frontend files are not present beside the backend, the server runs as an API-only service.

### API Endpoints

- `GET /api/records` - fetch all vehicle service records
- `POST /api/records` - create a new vehicle service record


## Frontend

The frontend is a static single-page app under `frontend/` and is served by the backend server when running.
