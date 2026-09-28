import os from 'os';
import { exec } from 'child_process';
import util from 'util';

// Promisify exec so we can use async/await with our bash scripts
const execPromise = util.promisify(exec);

// ==========================================
// 1. HOST SYSTEM MONITORING (Node OS)
// ==========================================

export function getCpuUsage() {
  const cpus = os.cpus();

  const total = cpus.reduce(
    (acc, cpu) => {
      const times = cpu.times;
      acc.idle += times.idle;
      acc.total +=
        times.user +
        times.nice +
        times.sys +
        times.irq +
        times.idle;
      return acc;
    },
    { idle: 0, total: 0 }
  );

  if (total.total === 0) return 0;

  return Math.round(
    ((total.total - total.idle) / total.total) * 100
  );
}

export function getMemoryUsage() {
  const total = os.totalmem();
  const free = os.freemem();

  return Math.round(((total - free) / total) * 100);
}

export function getSystemUptime() {
  const seconds = os.uptime();

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

// ==========================================
// 2. SCRIPT INTEGRATIONS (Bash Scripts)
// ==========================================

export async function getDiskUsage() {
  try {
    // Run the modified script that outputs a clean integer
    const { stdout } = await execPromise('./scripts/disk-monitor.sh');
    
    const diskPercentage = parseInt(stdout.trim(), 10);
    
    // Return the number, or default to 0 if something went wrong parsing
    return isNaN(diskPercentage) ? 0 : diskPercentage;
    
  } catch (error) {
    console.error('[Monitoring] Failed to read disk usage via bash script:', error);
    return 0; // Safe fallback so the API doesn't crash
  }
}

export async function getAppHealth() {
  try {
    // Run your existing health-check.sh script
    // If the script exits with 0, it means healthy
    await execPromise('./scripts/health-check.sh');
    
    return {
      status: 'healthy',
      message: 'All health checks passing.'
    };
    
  } catch (error) {
    // If health-check.sh exits with 1 (or any non-zero code), it throws an error here
    console.error('[Monitoring] Health check failed:', error);
    
    return {
      status: 'unhealthy',
      message: 'One or more services failed the health check.'
    };
  }
}