
Day 6 — AWS Monitoring with CloudWatch

Project: CloudOps Autopilot
Day: 6
Focus: Monitoring, metrics, logs, and automated alerts using AWS CloudWatch

1. Objective

The goal of Day 6 was to add monitoring and alerting to the CloudOps Autopilot infrastructure.

Instead of only deploying the application and checking whether it works, we started making the infrastructure observable:

EC2 → CloudWatch Agent → Metrics/Logs → CloudWatch → Alarms

This is an important step toward the project's goal of automatically monitoring cloud resources.

2. What We Learned
CloudWatch

Amazon CloudWatch is AWS's monitoring and observability service.

It can collect and monitor:

CPU utilization
Memory utilization
Disk usage
Network traffic
Application/system logs
Custom metrics
Infrastructure health

It can also trigger alarms when a metric crosses a defined threshold.

3. Why the CloudWatch Agent Was Needed

By default, EC2 provides some basic metrics to CloudWatch, such as:

CPU utilization
Network traffic
Disk I/O

However, metrics such as memory utilization are not automatically available in the same way.

Therefore, we installed the CloudWatch Agent on our Ubuntu EC2 instance.

Architecture
                    AWS
                     │
                     ▼
              ┌─────────────┐
              │     EC2     │
              │   Ubuntu    │
              └──────┬──────┘
                     │
              CloudWatch Agent
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
      Metrics                  Logs
          │                     │
          └──────────┬──────────┘
                     ▼
             Amazon CloudWatch
                     │
                     ▼
                CloudWatch
                  Alarms
                     │
                     ▼
                  Alert
4. EC2 Environment

We worked with an Ubuntu EC2 instance.

We verified the architecture:

uname -m

Output:

x86_64

We also verified the Ubuntu installation:

lsb_release -a

This was important because the correct CloudWatch Agent package needs to match the system architecture and operating system.

5. Installing the CloudWatch Agent

We downloaded the CloudWatch Agent .deb package and installed it using:

sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

The installation created the CloudWatch Agent user/group and installed the agent on the EC2 instance.

The important idea here is:

EC2 Ubuntu
    ↓
CloudWatch Agent installed
    ↓
Agent collects system-level information
    ↓
CloudWatch receives the information
6. CloudWatch Agent Configuration

The agent needs a configuration file that tells it what information to collect.

The configuration can specify things such as:

CPU metrics
Memory metrics
Disk metrics
Disk space
Log files
Metric collection interval

The configuration is what turns the CloudWatch Agent from simply being installed into an actual monitoring component.

7. Starting the CloudWatch Agent

After configuring the agent, we started it using the CloudWatch Agent control script.

The general workflow was:

Install Agent
     ↓
Create Configuration
     ↓
Start Agent
     ↓
Agent collects metrics
     ↓
Metrics appear in CloudWatch

We also verified that the agent was running rather than assuming that installation meant it was working.

8. CloudWatch Metrics

After configuring the agent, we moved to the AWS CloudWatch console.

The collected metrics can be viewed under:

CloudWatch
   ↓
Metrics
   ↓
All Metrics

The important distinction we learned was:

AWS-provided EC2 metrics

These are available from EC2 automatically, such as:

CPUUtilization
NetworkIn
NetworkOut
DiskReadOps
DiskWriteOps
Agent-collected metrics

These can include:

mem_used_percent
disk_used_percent

This gives us much better visibility into the actual state of the server.

9. Creating CloudWatch Alarms

The next major task was creating CloudWatch alarms.

An alarm continuously evaluates a metric against a defined condition.

For example:

CPU Utilization
      │
      ▼
Is CPU > threshold?
      │
   ┌──┴──┐
  Yes    No
   │      │
   ▼      ▼
ALARM    OK
10. Alarm Configuration

While creating the alarm, we configured the important components:

Metric

The metric that should be monitored.

Example:

CPUUtilization
Threshold

The value at which the alarm should trigger.

Conceptually:

CPU > threshold
Evaluation period

CloudWatch doesn't necessarily trigger an alarm from one instantaneous reading.

It evaluates the metric over the configured period.

For example:

Metric period
     ↓
Evaluation
     ↓
Threshold comparison
     ↓
Alarm state
11. Alarm States

We learned the three main CloudWatch alarm states:

OK

The monitored metric is within the expected range.

Metric normal
     ↓
   OK
ALARM

The metric has breached the configured condition.

Metric exceeds threshold
          ↓
       ALARM
INSUFFICIENT_DATA

CloudWatch doesn't currently have enough information to determine the state.

Not enough data
      ↓
INSUFFICIENT_DATA
12. Configure Actions

During alarm creation, we reached the Configure actions section.

This is where we decide what should happen when the alarm changes state.

For example:

Metric threshold exceeded
          ↓
     CloudWatch Alarm
          ↓
     Configure Action
          ↓
      Notification

The important concept is that an alarm isn't just a graph—it can become an automated response mechanism.

13. What We Achieved

By the end of Day 6, the project had moved from basic deployment toward actual infrastructure monitoring.

Before Day 6
Application
    ↓
EC2
    ↓
Application running
After Day 6
                 ┌──────────────┐
                 │ Application  │
                 └──────┬───────┘
                        │
                        ▼
                      EC2
                        │
                ┌───────┴───────┐
                ▼               ▼
             Metrics           Logs
                │               │
                └───────┬───────┘
                        ▼
                   CloudWatch
                        │
                        ▼
                     Alarms
                        │
                        ▼
                    Alerts
14. Day 6 Workflow

The complete workflow we followed:

Launch / access EC2
       ↓
Verify Ubuntu + architecture
       ↓
Install CloudWatch Agent
       ↓
Configure CloudWatch Agent
       ↓
Start Agent
       ↓
Verify collected metrics
       ↓
Open CloudWatch
       ↓
Check EC2 / custom metrics
       ↓
Create CloudWatch Alarm
       ↓
Configure alarm conditions
       ↓
Configure actions
       ↓
Create alarm
       ↓
Verify alarm state
15. Important Concepts to Remember
CloudWatch vs CloudWatch Agent

CloudWatch

AWS service that stores, visualizes, monitors and acts on metrics/logs.

CloudWatch Agent

Software running on the EC2 instance that collects additional system metrics and logs and sends them to CloudWatch.

Metric vs Alarm

Metric

A measurement.

Example:

CPUUtilization = 72%

Alarm

A rule that evaluates a metric.

Example:

IF CPUUtilization > 80%
THEN ALARM
Monitoring vs Alerting

Monitoring

What is happening?

Alerting

Is something wrong enough that I should be notified?

CloudWatch provides both.

16. Day 6 Final Outcome

By completing Day 6, CloudOps Autopilot gained an observability layer:

✅ CloudWatch introduced
✅ CloudWatch Agent installed on Ubuntu EC2
✅ Agent configuration created
✅ System metrics collected
✅ CloudWatch metrics verified
✅ CloudWatch alarm created
✅ Alarm conditions configured
✅ Alarm actions configured
✅ Monitoring workflow established
One-line summary for your project notes

Day 6 focused on AWS monitoring and observability by installing and configuring the CloudWatch Agent on the EC2 instance, sending system metrics/logs to CloudWatch, and creating CloudWatch alarms for automated infrastructure monitoring.

This is the Day 6 documentation version I would keep in your private docs/ folder.