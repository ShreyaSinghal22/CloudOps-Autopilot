# ☁️ CloudOps Autopilot

CloudOps Autopilot is a hands-on Cloud and DevOps project focused on building an automated application deployment and operations workflow.

The project is being developed incrementally, starting with application development and containerization and progressing toward cloud infrastructure, CI/CD, monitoring, and operational automation.

---

## 🎯 Project Objective

The goal of CloudOps Autopilot is to understand and implement a practical DevOps workflow that takes an application from development to automated cloud deployment and monitoring.

The project will gradually cover:

* Application development
* Containerization
* Cloud infrastructure
* Deployment automation
* CI/CD
* Application health monitoring
* Logging and observability
* Infrastructure automation
* Cloud operations automation

---

## 🛠️ Technology Stack

| Technology     | Purpose                      |
| -------------- | ---------------------------- |
| Node.js        | Backend runtime              |
| Express.js     | Backend web framework        |
| Docker         | Application containerization |
| Docker Desktop | Local Docker environment     |
| Git            | Version control              |
| GitHub         | Source code management       |
| VS Code        | Development environment      |
| AWS            | Planned cloud infrastructure |

---

## 📁 Project Structure

```text
CloudOps-Autopilot/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── docs/
│   ├── day-01.md
│   └── day-02.md
│
└── README.md
```

---

# 🔌 Backend

The current backend is a Node.js application built using Express.js.

The application runs on port `3000` by default.

## API Endpoints

### `GET /`

Basic application endpoint.

Response:

```text
Hello
```

### `GET /health`

Health-check endpoint used to verify that the application is running correctly.

Response:

```text
Server is healthy
```

The health endpoint will later be useful for monitoring, automated deployment checks, and cloud infrastructure health checks.

---

# 💻 Running Locally

## Prerequisites

Install:

* Node.js
* npm
* Git
* Docker Desktop

---

## 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd CloudOps-Autopilot
```

---

## 2. Navigate to the backend

```bash
cd backend
```

---

## 3. Install dependencies

```bash
npm install
```

---

## 4. Start the application

```bash
npm start
```

The server should start on:

```text
http://localhost:3000
```

Test the application:

```text
http://localhost:3000/
```

Health check:

```text
http://localhost:3000/health
```

---

# 🐳 Running with Docker

The backend is containerized using Docker.

## 1. Build the Docker image

From the `backend` directory:

```bash
docker build -t cloudops-autopilot .
```

---

## 2. Verify the image

```bash
docker images
```

The image should appear as:

```text
cloudops-autopilot
```

---

## 3. Run the container

```bash
docker run -d -p 3000:3000 --name cloudops-autopilot cloudops-autopilot
```

The application is now available at:

```text
http://localhost:3000
```

---

## 4. Verify the running container

```bash
docker ps
```

---

## 5. View container logs

```bash
docker logs cloudops-autopilot
```

---

# 🧹 Useful Docker Commands

### Stop the container

```bash
docker stop cloudops-autopilot
```

### Start the container again

```bash
docker start cloudops-autopilot
```

### View running containers

```bash
docker ps
```

### View all containers

```bash
docker ps -a
```

### View logs

```bash
docker logs cloudops-autopilot
```

### Remove the container

```bash
docker rm cloudops-autopilot
```

### Remove the image

```bash
docker rmi cloudops-autopilot
```

---

# 🐳 Docker Configuration

The backend uses a lightweight Node.js Alpine image.

The Dockerfile:

1. Uses Node.js as the base image.
2. Creates `/app` as the working directory.
3. Copies npm package files.
4. Installs production dependencies.
5. Copies the application source code.
6. Exposes port `3000`.
7. Starts the Express server using `npm start`.

The `.dockerignore` file prevents unnecessary files such as:

```text
node_modules
.git
.env
npm-debug.log
```

from being included in the Docker build context.

---

# 🏗️ Current Architecture

```text
                    CloudOps Autopilot
                           │
                           ▼
                  Node.js + Express
                           │
                       server.js
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
           GET /                  GET /health
              │                         │
              ▼                         ▼
           "Hello"              Health Status
              │                         │
              └────────────┬────────────┘
                           ▼
                       Dockerfile
                           │
                           ▼
                    Docker Image
                           │
                           ▼
                  Docker Container
                           │
                           ▼
                    localhost:3000
```

---

# 🗺️ Development Roadmap

## ✅ Day 1 — Environment & Application Setup

* Development environment setup
* Node.js and npm configuration
* Express backend setup
* Basic API endpoints
* Health-check endpoint
* Docker Desktop verification

## ✅ Day 2 — Application Containerization

* Dockerfile
* `.dockerignore`
* Docker image creation
* Docker container execution
* Port mapping
* Container logs
* Basic Docker lifecycle

## 🔄 Upcoming

* Docker Compose
* Multi-service architecture
* AWS infrastructure
* Cloud deployment
* CI/CD
* Automated deployment
* Monitoring
* Logging and observability
* CloudOps automation

---

# 📊 Project Status

**Current Stage:** Dockerized Node.js/Express Backend

The application currently runs successfully both locally and inside a Docker container.

Cloud infrastructure, CI/CD, monitoring, and automation components will be implemented in subsequent stages.

---

# 📚 Development Documentation

Detailed development notes are maintained separately:

* [Day 1 — Environment & Application Setup](docs/day-01.md)
* [Day 2 — Dockerization](docs/day-02.md)

---

# 🎓 Purpose

This project is being developed as a practical learning project to understand how modern applications progress through the DevOps lifecycle:

```text
Development
     ↓
Containerization
     ↓
Cloud Infrastructure
     ↓
Deployment
     ↓
CI/CD
     ↓
Monitoring
     ↓
Automation
```

The long-term objective is to evolve CloudOps Autopilot from a manually operated application into an automated CloudOps workflow.
