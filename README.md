## Problem Statement
Based on my experience at AbsoluteIT, agreements were linked to drivers, causing inconsistencies when drivers changed. A better approach is to link agreements directly to vehicles. Also, there was no digital record of vehicle services, drivers handled maintenance themselves, leading to lost records and recurring issues. A centralized digital system was needed to manage vehicles, service records, agreements, and fares.

## Proposed Solution
- Built a web-based Vehicle Service Record System
- Company's employees can:
  - Add vehicle service records.
  - View all records in a table.
  - Edit / Delete records.
  - Can Add extra info.
  - Manage agreements & fares
  - Assign vehicles to drivers 

## System Requirements
- Following are the system requirements

 # Functional Requirements

 # CRUD – Vehicle Service Records
  - Create: Employee can add a new vehicle service record
  - Read:   Employee can view all vehicle records
  - Update: Employee can edit any existing record
  - Delete: Employee can delete any record

  # CRUD - User (Driver) Management
  - Create: Employee can add a new driver
  - Read:   Employee can view all drivers with their assigned vehicles
  - Update: Employee can edit driver details
  - Delete: Employee can remove a driver record

  # CRUD - Agreement Management
  - Create: Employee can create a new agreement
  - Read:   Employee can view all agreements with vehicle and driver details
  - Update: Employee can edit existing agreement details (dates, fare type, fare limits)
  - Delete: Employee can remove an agreement

  # CRUD - FareType Mnagemant
  - Create: Employee can define a new fare type (Fixed, Dynamic, Metered)
  - Read:   Employee can view all available fare types
  - Update: Employee can modify fare type rates and rules
  - Delete: Empoyee can remove a fare type

  # CSV Export
  - Export: Employee can download service records as CSV file
  - Export: Empoyee can download driver records as CSV file

# Non‑Functional Requirements

  # Usability: 
  - Simple interface 
  - Sidebar navigation
  - Toast notifications

  # Performance: 
  - API responses fast table rendering

  # Reliability: 
  - Data persists in MongoDB
  - No loss on refresh

  # Maintainability: 
  - Clean separation of all frontend files (HTML/CSS/JS)
  - Clean separation of all backend files (Node.js/Express)

## Data Requirements & Storage
# Entities & Fields
# Vehicle Record
| Field     | Type     | Description                |
|-----------|----------|----------------------------|
| vehicle   | String   | Name of the vehicle        |
| reg       | String   | Unique registration number |
| owner     | String   | Owner name                 |
| mobile    | String   | Owner mobile number        |
| mileage   | Number   | mileage in km              |
| date      | Date     | Service date               |
| parts     | String   | Parts changed              |
| addInfo   | String   | Additional information     |
| _id       | ObjectId | Auto-generated             |
| createdAt | Date     | Auto-generated             |
| updatedAt | Date     | Auto-generated             |

# User (Driver)

| Field           | Type   | Description                   |
|-----------------|--------|-------------------------------|
| userName        | String | Driver name                   |
| regNo           | String | driver registration ID        |
| mobile          | String | Driver mobile number          |
| assignDate      | Date   | Date when vehicle assigned    |
| assignedVehicle | String | Vehicle registration number   |

# Agreement

| Field         | Type   | Description                   |
|---------------|--------|-------------------------------|
| startDate     | Date   | Agreement start date          |
| endDate       | Date   | Agreement end date            |
| fareName      | String | Name of fare                  |
| Agreement Name| String | Minimum fare amount           |


#### FareType
| Field     | Type   | Description               |
|-----------|--------|---------------------------|
|  fareName | String | Name of the fare          |
|  fareType | String | Fixed / Dynamic / Metered |
|  minFare  | Number | Minimum fare amount       |
|  maxFare  | Number | Maximum fare amount       |

# Entity Relationships

- One fare type can be used in many agreements.
- One agreement belongs can be assign to many vehicle.
- One vehicle can be assigned to many drivers over time.
- One driver can have only one assigned vehicle at a time and can be reassigned later.

## Storage Choice - MongoDB

# Why MongoDB?
- Flexible schema
- JSON‑like documents direct map to JavaScript objects
- Easy to add new fields later without migrations
- Docker container portable, no local install needed

## System Architecture (Three‑Tier)
# Frontend (Client‑Side)
- The UI seen in the browser is the frontend.
- It is a Single Page Application (SPA).
- No page refresh – everything updates dynamically.
- When a employee clicks a button (e.g., "Submit Record"), the frontend sends a request to the backend using the `fetch()` API.
- Features: sidebar navigation, forms, dynamic table, toast notifications, searach, dropdowns.

# Backend (Server‑Side)
- Built with Node.js + Express.js.
- Listens to requests from the frontend and responds.
- On GET request, backend fetches data from the database and sends JSON.
- On POST, PUT, DELETE, backend saves/updates/deletes data in the database.
- Middleware: express.json() (to understand JSON data).
- Backend also serves frontend files (HTML, CSS, JS) statically.

# Database (MongoDB)
- NoSQL database.
- Runs inside a Docker container (`mongo:latest`).
- Uses Mongoose ODM (schema, validation, queries).
- Data is stored permanently and can be modify.
- Data remains safe after page refresh or server restart

### Communication Flow
- Step 1: User performs an action in the frontend (e.g., form submit).
- Step 2: Frontend sends an HTTP request to the backend via `fetch()`.
- Step 3: Backend receives the request.
- Step 4: Backend reads/writes from/to the database using Mongoose.
- Step 5: Database operation completes.
- Step 6: Backend sends a JSON response to the frontend.
- Step 7: Frontend handles the response.
- Step 8: Frontend updates the DOM without reloading the page.

## Feature    
# Vehicle Records
- Add Vehicle: Add a new vehicle service record with vehicle name, registration number, etc.
- View Vehicle: View all vehicle records in a table.
- Update Vehicle: Edit any existing vehicle record.
- Delete Vehicle: Permanently remove a vehicle record.

# Users / Drivers
- Add driver: Add a new driver with name, registration ID, mobile, assignment date, and assigned vehicle.
- View driver: View all drivers with their assigned vehicles.
- Update driver: Edit driver details (name, mobile, assigned vehicle, etc.).
- Delete driver: Remove a driver record.

# Agreements
- Create agreement: Create a new agreement.
- View agreement: View all agreements with vehicle and driver details.
- Update agreement: Edit existing agreement details (dates, fare type, fare limits).
- Delete agreement: Remove an agreement.

# Fare Types
- Add fare: Define a new fare type.
- View fare: View all available fare types.
- Update fare: Modify fare type rules.
- Delete fare: Remove a fare type 

## Additional Features

 # Search Features
- Vehicle Records Table: Real‑time filter by registration number.
- User Records Table: Real‑time filter by driver registration number.
- Vehicle Info Search:  Button‑based check to verify if a vehicle exists before saving addInfo.

# Dropdowns Used
- Assign Vehicle: User Management form; shows only existing vehicle registration numbers so drivers get valid vehicles.
- Agreement Name: Vehicle Information section; lists all saved agreements to attach one to a vehicle record.
- Fare Name: Agreement form; populated from Fare Types so each agreement gets a valid fare (e.g., Standard).

# CSV Export: 
- Download all service records and driver records as CSV files.

# Toast Notifications:
- Non‑intrusive feedback for every action (add, edit, delete, save).

# Unique Validation: 
- No duplicate registration numbers for vehicles or drivers.

# Sidebar Navigation: 
- Easy access to all sections.

# API Endpoints Used in the Project
  All endpoints are relative to http://localhost:3000/api/records

  Method   |     Endpoint           |   Description
  GET      |     /api/records       |   Fetch all vehicle service records
  POST     |     /api/records       |   Create a new vehicle record
  PUT      |     /api/records/{id}  |   Update an existing record (by MongoDB _id)
  DELETE   |     /api/records/{id}  |   Delete a record (by _id)


  All endpoints are relative to http://localhost:3000/api/users

  Method   |     Endpoint         |   Description
  GET      |     /api/users       |   Fetch all users records
  POST     |     /api/users       |   Create a new user record
  PUT      |     /api/users/{id}  |   Update an existing record (by MongoDB _id)
  DELETE   |     /api/users/{id}  |   Delete a user (by _id)


  All endpoints are relative to http://localhost:3000/api/Agreement

  Method   |     Endpoint             |   Description
  GET      |     /api/Agreement       |   Fetch all Agreement records
  POST     |     /api/Agreement       |   Create a new Agreement record
  PUT      |     /api/Agreement/{id}  |   Update an existing record (by MongoDB _id)
  DELETE   |     /api/Agreement/{id}  |   Delete a Agreement (by _id)


  All endpoints are relative to http://localhost:3000/api/fares

  Method   |     Endpoint         |   Description
  GET      |     /api/fares       |   Fetch all fare records
  POST     |     /api/fares       |   Create a new fare record
  PUT      |     /api/fares/{id}  |   Update an existing record (by MongoDB _id)
  DELETE   |     /api/fares/{id}  |   Delete a fare (by _id)


## Testing

# Unit Tests (Jest)

Unit tests are written in `backend/tests/users.test.js` for the User (Driver) CRUD API. 
The following test cases are implemented:

| Test Case                           | Expected HTTP Status      |Expected Response|
|-------------------------------------|---------------------------|---------------|
| POST /users with valid data         | 201 Created               | Created user  |
| POST /users with a missing field    | 400 Bad Request           | Throws error  |
| POST /users when database save fails| 500 Internal Server Error | Throws error  |
| GET /users/:id when user exists     | 200 OK                    | user object   |
| GET /users/:id when user not found  | 404 Not Found             | Throws error  |
| GET /users/:id on database error    | 500 Internal Server Error | Throws error  |
| PUT /users/:id with valid update    | 200 OK                    | Updated object|
| PUT /users/:id when user not found  | 404 Not Found             | throws error  |
| PUT /users/:id on database error    | 500 Internal Server Error | throws error  |
| DELETE /users/:id when user exists  | 200 OK                    | Delete user   |
| DELETE /users/:id when user not found | 404 Not Found           | Throws error  |
| DELETE /users/:id on database error | 500 Internal Server Error | Throws error  |

# Run the Tests
- bash
- cd backend
- npm test  (To run all test cases)
- npm test -- users.test.js (To run single file)

# AI help Commits 
- Update PUT route to save agreementName using $set and bypass strict mode (Commit dc0539d) 

# How to run the Project?
- Prerequisites: Docker and Docker Composed Installed
- Clone the repository
- In project folder run this command to start container: docker compose up -d
- Access on http://localhost:3000 
- To stop the container: docker compose down


## Learning Resources
  Resource	       |        Purpose                     |   Youtube Toturial
  Node.js          |  JavaScript runtime for backend    |   https://nodejs.org/
  Express.js       |   Web framework for Node.js        |   https://expressjs.com/
  MongoDB Container|   How to run                       |   https://hub.docker.com/_/mongo
  Request Methods  |   To know about APIs calls         |   https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference
  MongoDB          |   NoSQL database                   |   https://www.mongodb.com/
  Docker           |   Containerisation for MongoDB     |   https://www.docker.com/
  CRUD API Tutorial|   Node, Express, MongoDB:          |   https://www.youtube.com/watch?v=_7UQPve99r4
  CRUD Operations  |   learn MongoDB                    |   https://www.youtube.com/watch?v=ZMEVI1Y7FtY
 
