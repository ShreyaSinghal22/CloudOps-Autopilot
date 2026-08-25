# Day 1 — Environment & Application Setup

**Project:** CloudOps Autopilot
**Phase:** Initial Development
**Status:** Completed

---

## 🎯 Objective

The objective of Day 1 was to establish the development environment for CloudOps Autopilot and create a basic Node.js/Express backend that could later be containerized using Docker.

The focus was on:

* Setting up the development environment
* Verifying Node.js and npm
* Setting up the Express backend
* Creating basic API endpoints
* Creating a health-check endpoint
* Verifying Docker Desktop

---

# 1. Development Environment

The project was developed using:

* Visual Studio Code
* Node.js
* npm
* Git/GitHub
* Docker Desktop
* Linux/WSL where required

Docker Desktop was selected as the local Docker environment.

---

# 2. Docker Desktop Verification

Docker Desktop was opened and its configuration was inspected.

Under:

```text
Docker Desktop
    → Settings
        → Builders
```

the available builders were reviewed.

The selected builder was:

```text
Desktop Linux
```

This provides a Linux-based environment for building Docker images through Docker Desktop.

A separate Docker engine installation inside WSL was not required because Docker Desktop was already providing the required Docker functionality.

---

# 3. Backend Setup

The backend was created using:

```text
Node.js
Express.js
```

The main application file is:

```text
server.js
```

The project uses the following npm scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

The primary application command is:

```bash
npm start
```

---

# 4. Dependencies

The backend uses Express as its main dependency.

The project also includes Nodemon as a development dependency.

```json
"dependencies": {
  "express": "^5.2.1"
}
```

```json
"devDependencies": {
  "nodemon": "^3.1.14"
}
```

Nodemon is intended for development use and is not required in the production Docker image.

---

# 5. Express Application

The application was initialized using Express:

```javascript
const express = require('express');

const app = express();
```

JSON request parsing was enabled using:

```javascript
app.use(express.json());
```

---

# 6. Port Configuration

The application was configured to use an environment variable for its port, with `3000` as the default:

```javascript
const PORT = process.env.PORT || 3000;
```

This allows the same application to use different ports in different environments.

For example:

```text
PORT=5000
```

would cause the application to run on port `5000`.

If no environment variable is supplied, the application uses:

```text
3000
```

---

# 7. API Endpoints

## Root Endpoint

The root endpoint was created:

```http
GET /
```

Implementation:

```javascript
app.get('/', (req, res) => {
    res.send('Hello');
});
```

Expected response:

```text
Hello
```

This endpoint provides a simple way to confirm that the application is running.

---

## Health Endpoint

A health-check endpoint was implemented:

```http
GET /health
```

Implementation:

```javascript
app.get('/health', (req, res) => {
    const isHealthy = true;

    if (isHealthy) {
        res.status(200).send('Server is healthy');
    } else {
        res.status(500).send('Server is not healthy');
    }
});
```

Expected healthy response:

```text
Server is healthy
```

with HTTP status:

```text
200 OK
```

The endpoint was introduced as a foundation for future monitoring and automated health checks.

---

# 8. Server Configuration

The Express server was configured to listen on all network interfaces:

```javascript
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
```

The use of:

```text
0.0.0.0
```

allows the application to accept connections through Docker's networking layer when it is containerized.

---

# 9. Local Testing

The application was first tested without Docker.

The application was started using:

```bash
npm start
```

The server successfully started on:

```text
http://localhost:3000
```

The root endpoint was tested:

```text
http://localhost:3000/
```

Expected response:

```text
Hello
```

The health endpoint was also tested:

```text
http://localhost:3000/health
```

Expected response:

```text
Server is healthy
```

Successful local testing established that the application was functioning correctly before Dockerization.

---

# 10. Day 1 Outcome

At the end of Day 1, the following components were completed:

* Node.js backend setup
* Express.js configuration
* `server.js`
* npm scripts
* Root endpoint
* Health-check endpoint
* Environment-based port configuration
* Local application testing
* Docker Desktop verification

The backend was ready to be containerized on Day 2.

---

# 11. Key Concepts Learned

### Node.js

Used as the runtime environment for the backend.

### Express.js

Used to create the HTTP server and API endpoints.

### npm

Used for dependency management and application execution.

### Environment Variables

Used to configure values such as the application port without hardcoding them for every environment.

### Health Checks

A health endpoint provides a simple way to determine whether the application is operational.

### Docker Environment

Docker Desktop was verified as the containerization environment for subsequent development.

---

# 12. Day 1 Completion

The initial application foundation was successfully established.

The resulting workflow was:

```text
Node.js
   ↓
Express
   ↓
server.js
   ↓
API endpoints
   ↓
Local testing
   ↓
Ready for Dockerization
```

**Day 1 Status: ✅ Completed**
