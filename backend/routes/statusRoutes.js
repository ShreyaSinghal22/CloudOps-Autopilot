import express from 'express';

// Import our three custom services
import { 
  getCpuUsage, 
  getMemoryUsage, 
  getSystemUptime, 
  getDiskUsage, 
  getAppHealth 
} from '../services/monitoringService.js';
import { getContainers } from '../services/containerservice.js';
import { getAutomationEvents } from '../services/automationservice.js';
import { getDeploymentStatus } from '../services/deploymentservice.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 1. Fetch async data (requires awaiting bash scripts or Docker commands)
    const diskUsage = await getDiskUsage();
    const appHealth = await getAppHealth();
    const containerList = await getContainers();
    const deploymentStatus = await getDeploymentStatus();

    // 2. Fetch sync data (instant Node.js OS calculations)
    const cpu = getCpuUsage();
    const memory = getMemoryUsage();
    const uptime = getSystemUptime();

    // 3. Fetch the live automation audit log
    const automationLog = getAutomationEvents();

    // 4. Determine if we have active alerts (Basic logic: if unhealthy, alert = 1)
    const activeAlerts = appHealth.status === 'unhealthy' ? 1 : 0;

    // 5. Construct the final JSON contract for the React Dashboard
    res.json({
      appHealth: {
        status: appHealth.status,
        uptime: uptime,
        message: appHealth.message
      },
      resources: {
        cpu: cpu,
        memory: memory,
        disk: diskUsage
      },
      containers: containerList,
      deployment: deploymentStatus,
      automationEvents: automationLog,
      alerts: activeAlerts,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('[API] Failed to generate status report:', error);
    res.status(500).json({ error: 'Unable to collect system status' });
  }
});

export default router;