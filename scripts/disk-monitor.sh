#!/bin/bash
# disk-monitor.sh

# 1. Define the log file location so it doesn't fail
LOG_DIR="../logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/disk-monitor.log"

# 2. Extract the raw integer
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | tr -d '%')

# 3. Write verbose details quietly to the log file (no 'tee' so it doesn't pollute stdout)
echo "$(date '+%Y-%m-%d %H:%M:%S') [DISK-USAGE] Current disk usage: $DISK_USAGE%" >> "$LOG_FILE"

# 4. Print ONLY the raw number so Node.js can easily parse it for the React Dashboard
echo $DISK_USAGE