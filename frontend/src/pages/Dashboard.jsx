import { useState, useEffect } from 'react';
import { getSystemStatus } from '../services/api';

// 1. Import all your newly extracted components
import Sidebar from '../components/sidebar';
import DashboardHeader from '../components/DashboardHeader';
import AppHealthCard from '../components/AppHealthCard';
import ResourceUsageCard from '../components/ResourceUsageCard';
import ContainerPipelineCard from '../components/ContainerPipelineCard';
import DeploymentPipelineCard from '../components/DeploymentPipelineCard';
import AutomationTimelineCard from '../components/AutomationTimelineCard';

// 2. Keep the theme tokens here (or move them to a src/utils/theme.js file and import them)
const darkTheme = {
  bg: 'bg-slate-950',
  surface: 'bg-slate-900/60',
  surfaceAlt: 'bg-slate-800/60',
  border: 'border-slate-800',
  ring: 'border-slate-800',
  text: 'text-slate-200',
  muted: 'text-slate-400',
  track: 'bg-slate-800',
  trackText: 'text-slate-800',
};

const lightTheme = {
  bg: 'bg-slate-50',
  surface: 'bg-white',
  surfaceAlt: 'bg-slate-100',
  border: 'border-slate-200',
  ring: 'border-slate-100',
  text: 'text-slate-900',
  muted: 'text-slate-500',
  track: 'bg-slate-200',
  trackText: 'text-slate-200',
};

// 3. The main Dashboard acts as the "Brain"
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  // Fetch real data from your Express backend
  useEffect(() => {
    let cancelled = false;
    const fetchSystemStatus = async () => {
      try {
        const json = await getSystemStatus();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  // Loading state remains exactly the same
  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center ${theme.bg}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className={`font-mono text-sm ${theme.muted}`}>Initializing mission data...</p>
        </div>
      </div>
    );
  }

  // 4. Assemble the dashboard using the imported components
  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${theme.bg}`}>
      <Sidebar
        theme={theme}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        user={data.user}
        integrations={data.integrations}
      />
      <main className="flex-1 overflow-y-auto p-8">
        <DashboardHeader
          theme={theme}
          statusOk={data.appHealth.status === 'healthy'}
          alerts={data.alerts}
          lastUpdated={data.lastUpdated}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AppHealthCard health={data.appHealth} theme={theme} className="lg:col-span-1" />
          <ResourceUsageCard cpu={data.resources.cpu} disk={data.resources.disk} theme={theme} className="lg:col-span-2" />
          <ContainerPipelineCard containers={data.containers} theme={theme} className="lg:col-span-3" />
          <DeploymentPipelineCard deployment={data.deployment} theme={theme} className="lg:col-span-3" />
          <AutomationTimelineCard events={data.automationEvents} theme={theme} className="lg:col-span-3" />
        </div>
      </main>
    </div>
  );
}