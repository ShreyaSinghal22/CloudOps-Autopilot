# Day 2 — Dockerization

**Project:** CloudOps Autopilot
**Phase:** Application Containerization
**Status:** Completed

---

## 🎯 Objective

The objective of Day 2 was to containerize the Node.js/Express backend created during Day 1.

The goal was to understand and implement the basic Docker workflow:

```text
Application
     ↓
Dockerfile
     ↓
Docker Image
     ↓
Docker Container
     ↓
localhost:3000
```

---

# 1. Pre-Docker Verification

Before creating the Docker image, the application was verified locally.

The application was started using:

```bash
npm start
```

The server successfully ran on:

```text
http://localhost:3000
```

The following endpoints were verified:

```text
GET /
GET /health
```

Expected responses:

```text
Hello
```

and:

```text
Server is healthy
```

This confirmed that the application was functioning correctly before containerization.

---

# 2. Dockerfile

A Dockerfile was created in the backend project directory.

The final Dockerfile was:

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

---

# 3. Dockerfile Explanation

## Base Image

```dockerfile
FROM node:22-alpine
```

Uses Node.js 22 with Alpine Linux as the base image.

Alpine provides a relatively lightweight Linux distribution suitable for containerized applications.

---

## Working Directory

```dockerfile
WORKDIR /app
```

Sets `/app` as the working directory inside the container.

---

## Copy Package Files

```dockerfile
COPY package*.json ./
```

Copies:

```text
package.json
package-lock.json
```

into the container.

This allows npm dependencies to be installed before copying the application source.

---

## Install Dependencies

```dockerfile
RUN npm ci --omit=dev
```

Installs dependencies based on the package lock file.

Development dependencies are excluded because they are not required for running the production application.

For this project, this means development tooling such as Nodemon is not included in the final application environment.

---

## Copy Application Source

```dockerfile
COPY . .
```

Copies the remaining project files into `/app`.

---

## Expose Port

```dockerfile
EXPOSE 3000
```

Documents that the Express application uses port `3000`.

---

## Start Command

```dockerfile
CMD ["npm", "start"]
```

Starts the application using the `start` script defined in `package.json`.

The start script executes:

```text
node server.js
```

---

# 4. `.dockerignore`

A `.dockerignore` file was created to prevent unnecessary and sensitive files from being included in the Docker build context.

The configuration includes:

```text
node_modules
npm-debug.log
.git
.gitignore
.env
.env.*
README.md
```

The `.env` exclusion is particularly important because environment files may contain sensitive configuration or credentials.

---

# 5. Docker Image Creation

The Docker image was built using:

```bash
docker build -t cloudops-autopilot .
```

The command can be broken down into:

```text
docker build
```

Build a Docker image.

```text
-t cloudops-autopilot
```

Assign the image the name `cloudops-autopilot`.

```text
.
```

Use the current directory as the Docker build context.

---

# 6. Image Verification

The generated image was verified using:

```bash
docker images
```

The image appeared with the repository name:

```text
cloudops-autopilot
```

The image contains the application, Node.js runtime, and required production dependencies.

---

# 7. Running the Container

The container was created and started using:

```bash
docker run -d -p 3000:3000 --name cloudops-autopilot cloudops-autopilot
```

The command performs several actions:

### `-d`

Runs the container in detached mode.

### `-p 3000:3000`

Maps:

```text
Host port 3000
       ↓
Container port 3000
```

### `--name cloudops-autopilot`

Assigns the container a readable name.

### `cloudops-autopilot`

Specifies the Docker image from which the container is created.

---

# 8. Container Verification

The running container was checked using:

```bash
docker ps
```

The container was shown as running with port mapping similar to:

```text
0.0.0.0:3000->3000/tcp
```

This confirmed that Docker was forwarding traffic from the host machine to the Express application inside the container.

---

# 9. Container Logs

The application's logs were inspected using:

```bash
docker logs cloudops-autopilot
```

The application reported:

```text
Server is running on port 3000
```

This confirmed that the Express server had successfully started inside the Docker container.

---

# 10. Testing the Containerized Application

The application was accessed through the host machine.

Root endpoint:

```text
http://localhost:3000/
```

Expected response:

```text
Hello
```

Health endpoint:

```text
http://localhost:3000/health
```

Expected response:

```text
Server is healthy
```

Successful responses confirmed that the Dockerized application was accessible from the host machine.

---

# 11. Docker Container Lifecycle

The basic Docker lifecycle was practiced.

## View Running Containers

```bash
docker ps
```

## View All Containers

```bash
docker ps -a
```

## Stop Container

```bash
docker stop cloudops-autopilot
```

## Start Container

```bash
docker start cloudops-autopilot
```

## View Logs

```bash
docker logs cloudops-autopilot
```

This provided practical experience with managing a container after it has been created.

---

# 12. Final Architecture

The Day 2 architecture can be represented as:

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
                    docker build
                           │
                           ▼
                    Docker Image
              cloudops-autopilot
                           │
                     docker run
                           │
                           ▼
                  Docker Container
                           │
                     Port 3000
                           │
                           ▼
                    localhost:3000
```

---

# 13. Day 2 Outcome

The Node.js/Express backend was successfully converted into a Dockerized application.

The following components were completed:

* Dockerfile
* `.dockerignore`
* Docker image
* Docker container
* Port mapping
* Container verification
* Container logs
* Basic container lifecycle management

The application can now be packaged and executed consistently through Docker.

---

# 14. Key Concepts Learned

### Dockerfile

A set of instructions used to create a Docker image.

### Docker Image

A packaged application environment containing the required runtime, dependencies, and application code.

### Docker Container

A running instance of a Docker image.

### Port Mapping

Allows applications running inside containers to be accessed through the host machine.

```text
localhost:3000
      ↓
container:3000
```

### Docker Build

Creates an image:

```bash
docker build
```

### Docker Run

Creates and starts a container:

```bash
docker run
```

### Docker Logs

Allows inspection of application output from inside the container:

```bash
docker logs
```

---

# 15. Day 2 Completion

The application successfully progressed from:

```text
Local Node.js Application
          ↓
       Dockerfile
          ↓
     Docker Image
          ↓
    Docker Container
          ↓
     localhost:3000
```

This establishes the containerization foundation for the next stages of CloudOps Autopilot.

**Day 2 Status: ✅ Completed**
