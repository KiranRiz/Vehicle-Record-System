# Vehicle-Record-System
A digital vehicle service tracking system. This system manages vehicle records, maintenance history, and service issues in one place.

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

### API Endpoints

- `GET /api/records` - fetch all vehicle service records
- `POST /api/records` - create a new vehicle service record


## Frontend

The frontend is a static single-page app under `frontend/` and is served by the backend server when running.
