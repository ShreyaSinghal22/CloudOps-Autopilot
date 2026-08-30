# Day 4 — AWS EC2 + Linux Server

## Objective

The objective of Day 4 was to take the Dockerized application developed during Days 1–3 and deploy it on a real AWS EC2 Linux server.

The Day 4 roadmap focuses on:

* Using a least-privilege IAM identity
* Launching an Ubuntu EC2 instance
* Configuring SSH access securely
* Connecting to the EC2 instance through SSH
* Installing Git and Docker
* Cloning the CloudOps Autopilot repository
* Running the application using Docker Compose
* Verifying that the application is accessible through the browser

**Day 4 Deliverable:** A live application running on AWS EC2.

---

## 1. Day 4 Architecture

The deployment workflow changed from a completely local setup to a cloud-hosted setup.

```text
Developer Machine
       │
       │ git push
       ▼
    GitHub
       │
       │ git clone
       ▼
   AWS EC2
   Ubuntu Linux
       │
       ├── Git
       ├── Docker
       └── Docker Compose
              │
              ▼
       CloudOps Autopilot
              │
              ▼
        Node.js / Express
              │
              ▼
          /health
              │
              ▼
       Live Application
```

The overall project roadmap defines this transition as:

```text
Developer
   ↓
GitHub
   ↓
Docker image / application
   ↓
EC2
   ↓
Docker Compose
   ↓
Application
```

---

# 2. AWS IAM and Access

Before working with EC2, AWS access was configured using the principle of **least privilege**.

The purpose of this was to avoid using the AWS root account for routine development and infrastructure operations.

### Key concept

**IAM — Identity and Access Management**

IAM controls:

* Who can access AWS
* What resources they can access
* What actions they are allowed to perform

The roadmap specifically requires understanding IAM users/roles, policies, least privilege, access keys, and why root should not be used for routine operations.

### Security principle

```text
AWS Root Account
       │
       │ avoid routine use
       ▼
Least-Privilege IAM Identity
       │
       ▼
Required AWS Operations
```

This follows the project's security requirement to use IAM least privilege and avoid root for routine work.

---

# 3. EC2 Instance

An **Amazon EC2** instance was created to act as the remote Linux server for the application.

The EC2 instance provides the infrastructure on which Docker and the CloudOps Autopilot application run.

### Important EC2 concepts

* **AMI:** Template used to create the instance
* **Instance:** Virtual machine running in AWS
* **Key pair:** Used for SSH authentication
* **Security Group:** Controls network traffic
* **Public IP:** Allows the server to be reached externally
* **Storage:** Provides disk space for the operating system, Docker data and application

These are the core EC2 concepts identified by the roadmap.

---

# 4. Security Group Configuration

The EC2 security group was configured to allow only the network access required by the application and administration.

The important security principle was:

```text
Internet
   │
   ├── SSH ───────► EC2
   │                 ↑
   │             Restricted
   │             source
   │
   └── Application ─► EC2
```

SSH should ideally be restricted to the developer's IP address whenever practical.

The project security checklist also requires exposing only necessary ports and restricting SSH access.

---

# 5. SSH Connection

After launching the EC2 instance, an SSH connection was established from the local machine.

The general SSH workflow is:

```text
Local Machine
      │
      │ SSH + private key
      ▼
AWS EC2 Ubuntu Server
```

The basic command used by the roadmap is:

```bash
ssh -i key.pem ubuntu@<EC2_PUBLIC_IP>
```

Once connected, commands were executed directly on the remote Ubuntu server.

This distinction is important:

```text
LOCAL MACHINE
    │
    │ SSH
    ▼
REMOTE EC2 SERVER
```

The Docker commands used after this point operate on the **EC2 server**, not the local Docker environment.

---

# 6. Linux Server Preparation

After connecting to EC2, the server was prepared to host the application.

The required tools for Day 4 were:

```text
Ubuntu EC2
   │
   ├── Git
   │
   ├── Docker
   │
   └── Docker Compose
```

The roadmap specifically requires installing Git and Docker before cloning and running the application.

The installations were verified using version commands such as:

```bash
git --version
docker --version
docker compose version
```

This confirmed that the server was ready to run the project.

---

# 7. Repository Deployment Workflow

The project repository was cloned onto the EC2 instance.

The workflow was:

```text
GitHub Repository
       │
       │ git clone
       ▼
EC2 Ubuntu Server
       │
       ▼
CloudOps Autopilot Repository
       │
       ▼
compose.yaml
       │
       ▼
Docker Compose
```

The important concept here is that **the EC2 server receives the same application source and configuration that was developed and tested locally**.

---

# 8. Docker Compose Deployment

After cloning the repository, Docker Compose was used to start the application.

The deployment flow was:

```text
CloudOps Autopilot Repository
            │
            ▼
       compose.yaml
            │
            ▼
    Docker Compose
            │
            ▼
     Docker Container
            │
            ▼
    Node.js / Express
            │
            ▼
        /health
```

The core Compose commands from the roadmap include:

```bash
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs -f
docker compose exec backend sh
docker compose down
```

The application was successfully started on the EC2 server using Docker Compose.

---

# 9. Application Verification

After deployment, the running containers were checked using:

```bash
docker compose ps
```

Logs were inspected to make sure that the application started correctly:

```bash
docker compose logs
```

The application's health endpoint was then tested:

```bash
curl http://localhost:3000/health
```

The project already contains a `/health` endpoint, which is important because future CloudOps automation will use it to determine whether the application is healthy.

The roadmap's definition of done also explicitly requires that the `/health` endpoint exists.

---

# 10. Browser Verification

The final test was performed from the local browser using the EC2 instance's public IP and application port.

The workflow was:

```text
Browser
   │
   │ HTTP request
   ▼
EC2 Public IP
   │
   ▼
Security Group
   │
   ▼
Docker Container
   │
   ▼
Node.js / Express
   │
   ▼
Application Response
```

The application was successfully accessible from the browser.

Therefore, the application was not only running inside Docker but was **live and reachable through AWS EC2**.

---

# 11. Complete Day 4 Deployment Workflow

The complete workflow for Day 4 can be summarized as:

```text
                  DAY 4 WORKFLOW

                     AWS
                      │
                      ▼
               IAM / Permissions
                      │
                      ▼
                Launch EC2
                      │
                      ▼
             Ubuntu Linux Server
                      │
                      ▼
              Configure Security
                      │
                      ▼
                  SSH Access
                      │
                      ▼
              Install Git/Docker
                      │
                      ▼
                Clone GitHub Repo
                      │
                      ▼
              Docker Compose
                      │
                      ▼
               Start Containers
                      │
                      ▼
                 Check Logs
                      │
                      ▼
                Check /health
                      │
                      ▼
              Browser Verification
                      │
                      ▼
              🌐 LIVE APPLICATION
```

---

# 12. What Was Learned

### AWS

* EC2 provides a virtual Linux server in the cloud.
* AMIs are used as the basis for EC2 instances.
* Security groups control network access.
* Key pairs are used for SSH authentication.
* Public IPs allow external access to the instance.
* IAM controls AWS permissions.
* Least privilege should be used instead of routine root access.

### Linux

* A remote EC2 instance can be managed through SSH.
* Linux commands executed after SSH operate on the remote server.
* Server software must be installed/configured before deployment.

### Docker

* Docker allows the application to run consistently on the EC2 server.
* Docker Compose simplifies running the application's services.
* Container status and logs are useful for deployment verification.

### Deployment

The major lesson from Day 4 was the transition from:

```text
"It works on my computer."
```

to:

```text
"It works on an actual cloud server."
```

---

# 13. Day 4 Result

### Before Day 4

```text
Developer Machine
      │
      ▼
Docker Compose
      │
      ▼
Local Application
```

### After Day 4

```text
Developer
    │
    ▼
GitHub
    │
    ▼
AWS EC2
    │
    ▼
Docker Compose
    │
    ▼
CloudOps Autopilot
    │
    ▼
🌐 Live Application
```

**Day 4 Deliverable: COMPLETE ✅**

The application is successfully deployed and running on AWS EC2, satisfying the Day 4 milestone defined in the roadmap.

---

# 14. Connection to the Next Day

Day 4 established the infrastructure on which the self-healing system will operate.

The next stage is **Day 5 — Bash Monitoring + Automation**.

The roadmap calls for:

```text
scripts/
├── health-check.sh
├── restart-service.sh
├── disk-monitor.sh
├── docker-cleanup.sh
└── deploy.sh
```

These scripts will add health monitoring, automated recovery, disk monitoring, Docker cleanup and deployment automation. Logging, safe exit codes, failure testing and cron scheduling will also be introduced.

This will transform the current system from:

```text
Application running on EC2
```

into:

```text
Application
     │
     ▼
Health Check
     │
     ▼
Failure Detection
     │
     ▼
Automatic Recovery
```

That is the point where **CloudOps Autopilot begins functioning as a self-healing CloudOps system**.
