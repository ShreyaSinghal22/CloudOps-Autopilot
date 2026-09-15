# Day 5 — Bash Monitoring & Automation

## Objective

The goal of Day 5 was to turn the deployed application into a **self-healing MVP** using Bash automation. We created scripts for health checking, service recovery, disk monitoring, Docker cleanup, and deployment, then added logging, safe exit codes, and Cron scheduling.

---

## 1. `health-check.sh` — Application Health Monitoring

The health-check script verifies whether the backend application is responding correctly through its `/health` endpoint.

### Script

```bash
#!/bin/bash
# health-check.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$SCRIPT_DIR/../logs/cloudops.log"

curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health | grep -q "^200$"

if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [HEALTH] Health check passed." | tee -a "$LOG_FILE"
    exit 0
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [HEALTH] Health check failed." | tee -a "$LOG_FILE"
    exit 1
fi
```

### Logic

```text
Request /health
      ↓
Check HTTP status
      ↓
200?
 ┌────┴────┐
YES        NO
 ↓          ↓
exit 0    exit 1
```

### Important concepts

* `curl` → makes the HTTP request.
* `-s` → silent mode.
* `-o /dev/null` → discards the response body.
* `-w "%{http_code}"` → outputs only the HTTP status code.
* `grep -q "^200$"` → checks whether the status is exactly `200`.
* `$?` → exit status of the previous command.
* `exit 0` → successful execution.
* `exit 1` → failure.
* `date` → adds a timestamp.
* `tee -a` → displays the message and appends it to the log.

---

# 2. `restart-service.sh` — Self-Healing / Recovery

This script restarts the backend when it becomes unhealthy and then verifies whether the application recovered.

### Script

```bash
#!/bin/bash
# restart-service.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/.."
LOG_FILE="$PROJECT_DIR/logs/cloudops.log"

cd "$PROJECT_DIR"

echo "$(date '+%Y-%m-%d %H:%M:%S') [RESTART] Starting recovery." | tee -a "$LOG_FILE"

docker compose restart backend

if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [RESTART] Backend restart command completed." | tee -a "$LOG_FILE"
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [RESTART] Backend restart failed." | tee -a "$LOG_FILE"
    exit 1
fi

sleep 10

"$SCRIPT_DIR/health-check.sh"

if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [RESTART] Application recovered successfully." | tee -a "$LOG_FILE"
    exit 0
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [RESTART] Application recovery failed." | tee -a "$LOG_FILE"
    exit 1
fi
```

### Logic

```text
Backend unhealthy
       ↓
Restart backend
       ↓
Wait 10 seconds
       ↓
Run health check
       ↓
 ┌─────┴─────┐
Healthy     Failed
   ↓           ↓
exit 0       exit 1
```

### Concepts

* `docker compose restart backend` → restarts only the backend service.
* `sleep 10` → gives the application time to start.
* Conditional execution using `if`.
* Exit codes communicate success/failure.
* This is the foundation of **self-healing infrastructure**.

---

# 3. `disk-monitor.sh` — Disk Monitoring

This script monitors the server's disk usage and compares it against a predefined threshold.

### Core logic

```bash
#!/bin/bash
# disk-monitor.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_FILE="$SCRIPT_DIR/../logs/cloudops.log"

THRESHOLD=80

USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')

if [ "$USAGE" -ge "$THRESHOLD" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') [DISK] WARNING: Disk usage is ${USAGE}%." | tee -a "$LOG_FILE"
    exit 1
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') [DISK] Disk usage is ${USAGE}%." | tee -a "$LOG_FILE"
    exit 0
fi
```

### Logic

```text
Check disk
    ↓
Get usage %
    ↓
Compare with threshold
    ↓
Usage >= 80%?
 ┌────┴────┐
YES        NO
 ↓          ↓
WARNING     OK
```

### Concepts

* `df` → displays filesystem disk usage.
* `awk` → extracts the required field.
* `tr -d '%'` → removes `%`.
* Variables → store threshold and usage.
* Numeric comparison using `-ge`.
* Monitoring through thresholds.

---

# 4. `docker-cleanup.sh` — Resource Cleanup

This script performs routine Docker housekeeping to prevent unnecessary resources from accumulating.

### Purpose

It can clean resources such as:

* stopped containers
* dangling images

The objective is **safe cleanup**, rather than aggressively deleting everything.

### Concepts

* Docker resource management
* Container lifecycle
* Image management
* Automation
* Safe cleanup

---

# 5. `deploy.sh` — Deployment Automation

This script automates the deployment process using Docker Compose and verifies the application afterward.

### Core workflow

```text
Docker Compose build/start
          ↓
       Wait
          ↓
   Health verification
          ↓
     ┌────┴────┐
   Healthy   Failed
      ↓         ↓
  Success     Failure
```

### Purpose

Deployment is not considered successful merely because containers started. The application must also pass the health check.

### Concepts

* Docker Compose
* Build automation
* Service startup
* Deployment verification
* Health checks
* Exit codes

---

# 6. `monitor-and-recover.sh` — Automation Controller

We created this wrapper script so Cron could trigger the complete monitoring and recovery workflow.

### Workflow

```text
monitor-and-recover.sh
          ↓
   health-check.sh
          ↓
    ┌─────┴─────┐
  Healthy     Unhealthy
     ↓             ↓
   Done      restart-service.sh
                    ↓
              health check
                    ↓
             Recovered/Failed
```

This separates **scheduling** from **application logic**:

* Cron decides **when** to run.
* `monitor-and-recover.sh` decides **what to do**.

---

# 7. Logging

A central log file was created:

```text
logs/
└── cloudops.log
```

Scripts record important events with timestamps.

Example:

```text
2026-08-31 17:30:01 [HEALTH] Health check passed.
2026-08-31 17:35:01 [HEALTH] Health check failed.
2026-08-31 17:35:02 [RESTART] Starting recovery.
2026-08-31 17:35:02 [RESTART] Backend restart command completed.
2026-08-31 17:35:12 [HEALTH] Health check passed.
2026-08-31 17:35:12 [RESTART] Application recovered successfully.
```

### Important commands

```bash
echo "message" >> file
```

`>>` appends instead of overwriting.

```bash
echo "message" | tee -a "$LOG_FILE"
```

`tee` displays the message while `-a` appends it to the log.

### Why logging matters

Logs create an **audit trail** of what the automation system detected and what actions it performed.

---

# 8. Cron Scheduling

Cron was introduced to make the automation run automatically.

Example:

```text
*/5 * * * * /path/to/monitor-and-recover.sh
```

This means:

> Run the monitoring/recovery script every 5 minutes.

Cron format:

```text
┌──────── minute
│ ┌────── hour
│ │ ┌──── day of month
│ │ │ ┌── month
│ │ │ │ ┌ day of week
│ │ │ │ │
* * * * *
```

### Key idea

Before Cron:

```text
Human → run script → monitor
```

After Cron:

```text
Cron → run script automatically → monitor → recover if necessary
```

This is what turns the Bash scripts into an **automated self-healing system**.

---

# 9. Cron-Safe Scripts

Because Cron may execute scripts from a different working directory, we made the scripts independent of the current directory.

```bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
```

This finds the directory containing the script.

Then:

```bash
PROJECT_DIR="$SCRIPT_DIR/.."
```

finds the project directory.

And:

```bash
cd "$PROJECT_DIR"
```

ensures Docker Compose runs from the directory containing `compose.yaml`.

### Concepts

* `$0` → path/name of the current script.
* `dirname` → extracts the directory.
* `pwd` → absolute working directory.
* `cd` → changes directory.
* `&&` → runs the next command only if the previous command succeeds.
* Absolute paths → make scheduled automation more reliable.

---

# 10. Failure & Recovery Test

The most important Day 5 test was intentionally stopping the backend:

```bash
docker compose stop backend
```

Then:

```text
health-check
      ↓
FAIL
      ↓
monitor-and-recover
      ↓
restart backend
      ↓
health-check
      ↓
PASS
```

Expected log sequence:

```text
[HEALTH] Health check failed.
[MONITOR] Application is unhealthy. Starting recovery.
[RESTART] Starting recovery.
[RESTART] Backend restart command completed.
[HEALTH] Health check passed.
[RESTART] Application recovered successfully.
[MONITOR] Recovery successful.
```

This demonstrates the core **self-healing MVP** required by Day 5.

---

# Key Concepts Learned in Day 5

| Concept        | Purpose                         |
| -------------- | ------------------------------- |
| Bash variables | Store reusable values           |
| `$0`           | Identify current script         |
| `$?`           | Check previous command's result |
| `$()`          | Command substitution            |
| `if/else`      | Decision making                 |
| `curl`         | HTTP health checking            |
| `grep`         | Search/filter output            |
| `df`           | Check disk usage                |
| `awk`          | Extract data                    |
| `tr`           | Transform/remove characters     |
| Pipes `\|`     | Pass output between commands    |
| Exit codes     | Communicate success/failure     |
| `date`         | Timestamp logs                  |
| `tee`          | Display + write output          |
| Cron           | Schedule automation             |
| Thresholds     | Detect abnormal resource usage  |
| Logging        | Record system events            |
| Self-healing   | Detect → recover → verify       |

These align with the roadmap's required Bash concepts: variables, conditions, functions, pipes, `grep`, `curl`, `jq`, exit codes, logging, and safe failure handling.

---

## Day 5 Final Architecture

```text
                         EC2
                          │
                   Docker Compose
                          │
                       Backend
                          │
                       /health
                          │
                 ┌────────┴────────┐
                 │                 │
             Monitoring          Cron
                 │                 │
          health-check.sh          │
                 │                 ▼
                 │       monitor-and-recover.sh
                 │                 │
                 │          ┌──────┴──────┐
                 │          │             │
                 │       Healthy      Unhealthy
                 │          │             │
                 │         Done      restart-service.sh
                 │                        │
                 │                        ▼
                 │                  Verify health
                 │
                 └──────────────► logs/cloudops.log
```

### Day 5 Deliverable

**Self-Healing MVP** — a Dockerized application on EC2 that can be monitored through Bash, detect failures, attempt automatic recovery, record events in logs, and execute scheduled operations through Cron.
