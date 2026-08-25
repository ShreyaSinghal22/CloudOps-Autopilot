# CloudOps Autopilot — Day 3 Documentation

## Day 3: Docker Compose, Multi-Container Architecture & Service Health

### 1. Objective

The objective of Day 3 was to move the CloudOps Autopilot project from running a single Docker container manually to managing the application using **Docker Compose**.

The main goals were:

* Introduce Docker Compose.
* Create a declarative `compose.yaml` configuration.
* Run the backend through Docker Compose.
* Manage environment variables using `.env`.
* Introduce a second service using Redis.
* Understand Docker Compose networking and service discovery.
* Add container health checks.
* Configure automatic container restart behavior.
* Define service dependencies.
* Practice the Docker Compose lifecycle and management commands.

---

# 2. Starting Point

At the end of Day 2, the backend application had already been containerized using Docker.

The architecture at that point was essentially:

```text
Node.js Backend
      ↓
   Dockerfile
      ↓
 Docker Image
      ↓
 Docker Container
```

The container could be built and executed manually using Docker commands.

However, manually managing containers becomes increasingly difficult when an application contains multiple services.

Therefore, Docker Compose was introduced on Day 3.

---

# 3. Introduction to Docker Compose

Docker Compose allows multiple containerized services to be defined and managed through a single YAML configuration file.

Instead of manually creating containers, networking, environment configuration, and other resources, these requirements can be declared in:

```text
compose.yaml
```

The project uses:

```yaml
services:
  backend:
```

to define the backend application as a Compose service.

Docker Compose can then build and start the service using:

```bash
docker compose up
```

This makes the development environment more reproducible and easier to manage.

---

# 4. Creating the Compose Configuration

A `compose.yaml` file was created at the root of the CloudOps Autopilot project.

The initial configuration defined the backend service:

```yaml
services:
  backend:
    build:
      context: ./backend
    container_name: cloudops-backend
    ports:
      - "3000:3000"
```

### Configuration Explanation

### `services`

Defines the containers/services that make up the application.

### `backend`

Defines the Node.js backend as a Compose service.

### `build.context`

```yaml
build:
  context: ./backend
```

tells Docker to use the `backend` directory as the build context.

This directory contains the backend's:

* `Dockerfile`
* `package.json`
* `package-lock.json`
* `server.js`

### `container_name`

```yaml
container_name: cloudops-backend
```

gives the container a predictable name.

### `ports`

```yaml
ports:
  - "3000:3000"
```

maps port `3000` on the host machine to port `3000` inside the container.

Therefore, the application can be accessed through:

```text
http://localhost:3000
```

---

# 5. Running the Application Through Docker Compose

The application was successfully started using:

```bash
docker compose up
```

Docker Compose performed several operations automatically:

```text
compose.yaml
      ↓
Build backend image
      ↓
Create Compose network
      ↓
Create backend container
      ↓
Start Node.js application
```

The successful build demonstrated that Docker Compose was correctly reading the backend's Dockerfile and creating the required container.

---

# 6. Docker Compose Lifecycle

Several Compose commands were practiced during Day 3.

### Start services

```bash
docker compose up
```

Starts the services and attaches the terminal to their logs.

### Start in detached mode

```bash
docker compose up -d
```

Starts the services in the background.

### Check services

```bash
docker compose ps
```

Displays the current state of Compose services.

### View logs

```bash
docker compose logs
```

Displays logs from the services.

Logs for a specific service can be viewed using:

```bash
docker compose logs backend
```

### Stop services

```bash
docker compose stop
```

Stops the containers without removing them.

### Start stopped services

```bash
docker compose start
```

Starts previously stopped containers.

### Remove Compose resources

```bash
docker compose down
```

Stops and removes the containers and Compose-created network.

### Execute commands inside a service

```bash
docker compose exec backend <command>
```

allows commands to be executed inside the running backend container.

### Validate the Compose configuration

```bash
docker compose config
```

is used to validate and display the resolved Compose configuration.

---

# 7. Environment Configuration

Environment variables were separated from the Compose configuration using a `.env` file.

The root project contains:

```text
.env
```

with configuration such as:

```env
NODE_ENV=development
PORT=3000
```

The Compose configuration references these variables:

```yaml
environment:
  NODE_ENV: ${NODE_ENV}
  PORT: ${PORT}
```

The port mapping was also changed to:

```yaml
ports:
  - "${PORT}:${PORT}"
```

This creates the following configuration flow:

```text
.env
 ↓
Docker Compose
 ↓
Container Environment
 ↓
Node.js Application
```

This approach avoids unnecessarily hardcoding environment-specific configuration into the Compose file.

---

# 8. Protecting Environment Variables

The `.env` file was added to `.gitignore`:

```gitignore
.env
```

This is an important security practice because real `.env` files may contain sensitive information such as:

* Database credentials
* API keys
* JWT secrets
* OAuth credentials
* Other application secrets

Sensitive credentials should not be committed to GitHub.

---

# 9. Adding a Redis Service

A second service was introduced to demonstrate a real multi-container architecture.

Redis was added using:

```yaml
redis:
  image: redis:7-alpine
  container_name: cloudops-redis
```

The architecture therefore became:

```text
                 Docker Compose
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
      cloudops-backend    cloudops-redis
          Node.js              Redis
           :3000               :6379
```

This was an important transition from managing one container to managing multiple services.

---

# 10. Docker Compose Networking

Docker Compose automatically created a project network for the services.

Both the backend and Redis containers are connected to this network.

A key concept learned was Docker's internal service discovery.

The backend can refer to Redis using its Compose service name:

```text
redis
```

rather than:

```text
localhost
```

This distinction is important.

Inside a container:

```text
localhost
```

refers to the current container itself.

Whereas:

```text
redis
```

refers to the Redis service through Docker's internal DNS/networking.

The connectivity was tested using:

```bash
docker compose exec backend getent hosts redis
```

which demonstrated that the backend container could resolve the Redis service.

---

# 11. Testing Redis

Redis was tested using:

```bash
docker compose exec redis redis-cli ping
```

The expected response was:

```text
PONG
```

This confirmed that the Redis service was running correctly.

---

# 12. Health Checks

Health checks were introduced to distinguish between:

```text
Container is running
```

and:

```text
Application is actually healthy
```

A backend health check was configured to test:

```text
http://localhost:3000/health
```

The health check verifies that the Node.js backend is responding successfully.

The Redis health check uses:

```bash
redis-cli ping
```

and expects:

```text
PONG
```

The backend health check configuration includes:

```yaml
healthcheck:
  test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

Redis uses:

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 30s
  timeout: 10s
  retries: 3
```

This allows Docker to report services as:

```text
healthy
```

when their health checks succeed.

---

# 13. Restart Policy

A restart policy was added to both services:

```yaml
restart: unless-stopped
```

This allows Docker to automatically restart a service if it unexpectedly stops or crashes.

The policy is useful for services that are expected to remain continuously available.

The behavior can be summarized as:

```text
Service crashes
      ↓
Docker detects failure
      ↓
Docker restarts service
```

If the user intentionally stops the service, Docker does not continuously restart it.

---

# 14. Service Dependency

The backend was configured to depend on Redis:

```yaml
depends_on:
  redis:
    condition: service_healthy
```

This tells Docker Compose that the backend depends on the Redis service being healthy.

The resulting startup relationship is:

```text
Redis starts
   ↓
Redis health check
   ↓
Redis becomes healthy
   ↓
Backend starts
```

This provides better control over multi-service startup.

---

# 15. Final Architecture After Day 3

The CloudOps Autopilot architecture now looks like:

```text
                         CloudOps Autopilot
                                │
                         Docker Compose
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
                  ▼                           ▼
          Backend Service               Redis Service
          cloudops-backend              cloudops-redis
                  │                           │
              Node.js                      Redis
                  │                           │
              Port 3000                   Port 6379
                  │                           │
                  └───────────┬───────────────┘
                              │
                       Compose Network
                              │
                   Health Checks + DNS
                              │
                       Restart Policies
```

---

# 16. Day 3 Commands Practiced

The following commands were used and understood:

```bash
docker compose up
docker compose up -d
docker compose ps
docker compose logs
docker compose logs backend
docker compose stop
docker compose start
docker compose down
docker compose exec backend <command>
docker compose exec redis redis-cli ping
docker compose config
```

Additional Docker commands used for inspection included:

```bash
docker inspect
```

---

# 17. Key Concepts Learned

By completing Day 3, the following concepts were covered:

### Docker Compose

Used to define and manage multiple containers as a single application environment.

### Declarative Configuration

The application's infrastructure configuration is described in `compose.yaml`.

### Environment Configuration

Environment-specific values can be supplied through `.env`.

### Multi-Container Architecture

Multiple services can run together as part of one application environment.

### Container Networking

Compose provides networking and service discovery between containers.

### Service Discovery

Services can communicate using their Compose service names rather than hardcoded IP addresses.

### Health Checks

Health checks determine whether a service is actually functioning correctly.

### Restart Policies

Docker can automatically restart failed services.

### Service Dependencies

Services can be configured to wait for required dependencies to become healthy.

---

# 18. Relation to CloudOps Autopilot

Day 3 is an important foundation for the automation aspect of CloudOps Autopilot.

The project has now progressed from simply running a container to managing a small service environment.

The evolution is:

```text
Day 1
Linux + Bash + Application
        ↓
Day 2
Dockerization
        ↓
Day 3
Container Orchestration
        ↓
Future Days
Monitoring
        ↓
Automation
        ↓
Cloud Deployment
        ↓
CloudOps Autopilot
```

The health-check system introduced on Day 3 will later provide useful signals for monitoring and automated remediation.

For example:

```text
Backend → healthy
Redis   → healthy
        ↓
Everything operating normally
```

or:

```text
Backend → unhealthy
        ↓
Monitoring detects failure
        ↓
Automation can respond
```

This establishes the foundation for the project's future monitoring and self-healing capabilities.

---

# 19. Day 3 Outcome

At the end of Day 3, CloudOps Autopilot successfully moved from a single manually managed Docker container to a **multi-service Docker Compose environment**.

The project now has:

* Docker Compose configuration
* Backend service
* Redis service
* Environment-based configuration
* Docker Compose networking
* Service discovery
* Backend health monitoring
* Redis health monitoring
* Automatic restart policies
* Service dependency management
* A reproducible multi-container development environment

**Day 3 completed successfully.**
