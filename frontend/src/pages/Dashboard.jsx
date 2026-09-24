import { useState, useEffect, Fragment } from 'react';
import {
  Activity,
  AlertTriangle,
  Bell,
  Boxes,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  FlaskConical,
  GitBranch,
  GitCommit,
  Hammer,
  HardDrive,
  HeartPulse,
  LogOut,
  Monitor,
  Moon,
  Plug,
  Radar,
  RefreshCw,
  Rocket,
  Server,
  Settings,
  Sun,
  Zap,
} from 'lucide-react';

/**
 * CloudOps Autopilot - mission control dashboard
 * Drop this file in as src/pages/Dashboard.jsx.
 *
 * Theming: a small `theme` token object is swapped by React state instead
 * of Tailwind's `dark:` class strategy, so this runs on a stock Tailwind
 * config - nothing to add to tailwind.config.js.
 */

// ---------------------------------------------------------------------------
// Integration placeholders - wire these up when connecting real services.
// Everything below runs on the mock data further down until you do.
// ---------------------------------------------------------------------------
const INTEGRATION_CONFIG = {
  // apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  // endpoints: { status: '/api/status', integrations: '/api/integrations' },
};

const AUTH_HOOKS = {
  // onLogin: async (email, password) => { /* call your auth provider */ },
  // onSignup: async (email, password) => { /* create an account */ },
  // onLogout: () => { /* clear the session */ },
};

// ---------------------------------------------------------------------------
// Mock data - stands in for GET /api/status
// ---------------------------------------------------------------------------
const MOCK_STATUS = {
  appHealth: {
    status: 'healthy',
    uptime: '18d 6h 42m',
    message: 'All health checks passing across 4 regions.',
  },
  resources: { cpu: 32, disk: 48 },
  containers: [
    { name: 'Backend', status: 'running' },
    { name: 'Database', status: 'running' },
    { name: 'Redis', status: 'running' },
    { name: 'Frontend', status: 'running' },
  ],
  deployment: {
    version: 'abc123',
    time: 'Today, 10:32 PM',
    status: 'successful',
    steps: [
      { label: 'Code commit' },
      { label: 'Build' },
      { label: 'Test' },
      { label: 'Deploy' },
      { label: 'Final status' },
    ],
  },
  automationEvents: [
    { time: '10:32 PM', type: 'deployment', message: 'Deployment completed' },
    { time: '10:28 PM', type: 'warning', message: 'Backend became unhealthy' },
    { time: '10:28 PM', type: 'restart', message: 'Backend automatically restarted' },
    { time: '09:54 PM', type: 'success', message: 'Disk cleanup routine finished' },
    { time: '09:10 PM', type: 'deployment', message: 'Deployment abc122 completed' },
  ],
  alerts: 2,
  lastUpdated: '10:32 PM',
  user: { name: 'Alex Johnson', title: 'DevOps Lead' },
  integrations: [
    { name: 'App A', status: 'connected' },
    { name: 'App B', status: 'auth_required' },
  ],
};

// ---------------------------------------------------------------------------
// Theme tokens
// ---------------------------------------------------------------------------
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

function usageColor(pct) {
  if (pct < 60) return { hex: '#34d399', bar: 'bg-emerald-400' };
  if (pct < 85) return { hex: '#f59e0b', bar: 'bg-amber-400' };
  return { hex: '#f43f5e', bar: 'bg-rose-400' };
}

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------
function LiveDot({ color = 'emerald' }) {
  const dot = { emerald: 'bg-emerald-500', rose: 'bg-rose-500', amber: 'bg-amber-500' }[color];
  const ping = { emerald: 'bg-emerald-400', rose: 'bg-rose-400', amber: 'bg-amber-400' }[color];
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${ping} opacity-75`} />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot}`} />
    </span>
  );
}

function Card({ theme, title, icon: Icon, accentClass, glowClass = '', className = '', children }) {
  return (
    <div
      className={`relative rounded-xl border ${theme.border} ${theme.surface} backdrop-blur-sm p-5 ${glowClass} ${className}`}
    >
      <div className="mb-4 flex items-center gap-2">
        {Icon && <Icon size={16} className={accentClass} />}
        <h3 className={`text-sm font-medium ${theme.text}`}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function GaugeRing({ percentage, color, theme, size = 108, strokeWidth = 9 }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(percentage), 150);
    return () => clearTimeout(t);
  }, [percentage]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={theme.trackText}
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-mono text-lg font-semibold ${theme.text}`}>{percentage}%</span>
      </div>
    </div>
  );
}

function ProgressBar({ percentage, colorClass, theme }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(percentage), 150);
    return () => clearTimeout(t);
  }, [percentage]);

  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full ${theme.track}`}>
      <div
        className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`}
        style={{ width: `${animated}%` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------
function AppHealthCard({ health, theme, className }) {
  const healthy = health.status === 'healthy';
  return (
    <Card
      theme={theme}
      title="App health"
      icon={HeartPulse}
      accentClass={healthy ? 'text-emerald-400' : 'text-rose-400'}
      glowClass={
        healthy
          ? 'shadow-[0_0_30px_-10px_rgba(16,185,129,0.4)]'
          : 'shadow-[0_0_30px_-10px_rgba(244,63,94,0.4)]'
      }
      className={className}
    >
      <div className="flex items-center gap-3">
        <LiveDot color={healthy ? 'emerald' : 'rose'} />
        <span className={`text-lg font-semibold ${healthy ? 'text-emerald-400' : 'text-rose-400'}`}>
          {healthy ? 'Healthy' : 'Unhealthy'}
        </span>
      </div>
      <p className={`mt-3 text-sm leading-relaxed ${theme.muted}`}>{health.message}</p>
      <div className={`mt-4 flex items-center gap-1.5 font-mono text-xs ${theme.muted}`}>
        <Clock size={12} />
        Uptime {health.uptime}
      </div>
    </Card>
  );
}

function ResourceUsageCard({ cpu, disk, theme, className }) {
  const cpuColor = usageColor(cpu);
  const diskColor = usageColor(disk);
  return (
    <Card theme={theme} title="Resource usage" icon={Cpu} accentClass="text-cyan-400" className={className}>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center gap-3">
          <GaugeRing percentage={cpu} color={cpuColor.hex} theme={theme} />
          <div className={`flex items-center gap-1.5 text-xs ${theme.muted}`}>
            <Cpu size={13} />
            CPU
          </div>
          <ProgressBar percentage={cpu} colorClass={cpuColor.bar} theme={theme} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <GaugeRing percentage={disk} color={diskColor.hex} theme={theme} />
          <div className={`flex items-center gap-1.5 text-xs ${theme.muted}`}>
            <HardDrive size={13} />
            Disk
          </div>
          <ProgressBar percentage={disk} colorClass={diskColor.bar} theme={theme} />
        </div>
      </div>
    </Card>
  );
}

const CONTAINER_ICONS = { Backend: Server, Database: Database, Redis: Zap, Frontend: Monitor };

function ContainerPipelineCard({ containers, theme, className }) {
  return (
    <Card theme={theme} title="Container topology" icon={Boxes} accentClass="text-cyan-400" className={className}>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {containers.map((c, i) => {
          const Icon = CONTAINER_ICONS[c.name] || Server;
          const running = c.status === 'running';
          const isLast = i === containers.length - 1;
          return (
            <Fragment key={c.name}>
              <div
                className={`flex min-w-[104px] flex-col items-center gap-1.5 rounded-lg border px-4 py-3 ${
                  running ? 'border-cyan-400/40 shadow-[0_0_18px_-6px_rgba(34,211,238,0.6)]' : theme.border
                } ${theme.surfaceAlt}`}
              >
                <Icon size={17} className={running ? 'text-cyan-400' : theme.muted} />
                <span className={`text-xs font-medium ${theme.text}`}>{c.name}</span>
                <span className={`font-mono text-[11px] ${running ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {running ? 'Running' : 'Down'}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`h-px w-8 flex-shrink-0 sm:w-12 ${
                    running ? 'bg-gradient-to-r from-cyan-400 to-cyan-400/10' : theme.border
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </Card>
  );
}

const PIPELINE_ICONS = [GitCommit, Hammer, FlaskConical, Rocket, CheckCircle2];

function DeploymentPipelineCard({ deployment, theme, className }) {
  const succeeded = deployment.status === 'successful';
  return (
    <Card theme={theme} title="Deployment pipeline" icon={GitBranch} accentClass="text-cyan-400" className={className}>
      <div className="flex items-center overflow-x-auto pb-1">
        {deployment.steps.map((step, i) => {
          const Icon = PIPELINE_ICONS[i] || CheckCircle2;
          const isLast = i === deployment.steps.length - 1;
          return (
            <Fragment key={step.label}>
              <div className="flex min-w-[76px] flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                    isLast && succeeded
                      ? 'border-emerald-400 shadow-[0_0_18px_-4px_rgba(16,185,129,0.7)]'
                      : 'border-cyan-400/50'
                  }`}
                >
                  <Icon size={16} className={isLast && succeeded ? 'text-emerald-400' : 'text-cyan-400'} />
                </div>
                <span className={`text-center text-xs ${theme.muted}`}>{step.label}</span>
              </div>
              {!isLast && <div className="mx-1 h-px flex-1 bg-gradient-to-r from-cyan-400/60 to-cyan-400/10" />}
            </Fragment>
          );
        })}
      </div>
      <div className={`mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4 ${theme.border}`}>
        <div className={`font-mono text-xs ${theme.muted}`}>
          <span className={theme.text}>{deployment.version}</span>
          <span className="mx-2 opacity-40">/</span>
          {deployment.time}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            succeeded
              ? 'bg-emerald-400/10 text-emerald-400 shadow-[0_0_14px_-4px_rgba(16,185,129,0.6)]'
              : 'bg-rose-400/10 text-rose-400'
          }`}
        >
          {succeeded ? 'Successful' : 'Failed'}
        </span>
      </div>
    </Card>
  );
}

const EVENT_META = {
  deployment: { icon: Rocket, text: 'text-indigo-400', bg: 'bg-indigo-400/10', badge: 'Deployment' },
  warning: { icon: AlertTriangle, text: 'text-amber-400', bg: 'bg-amber-400/10', badge: 'Alert' },
  restart: { icon: RefreshCw, text: 'text-cyan-400', bg: 'bg-cyan-400/10', badge: 'Restart' },
  success: { icon: CheckCircle2, text: 'text-emerald-400', bg: 'bg-emerald-400/10', badge: 'Success' },
};

function AutomationTimelineCard({ events, theme, className }) {
  return (
    <Card
      theme={theme}
      title="Recent automation events"
      icon={Activity}
      accentClass="text-indigo-400"
      className={className}
    >
      <ul className="-mx-2">
        {events.map((event, i) => {
          const meta = EVENT_META[event.type] || EVENT_META.success;
          const Icon = meta.icon;
          return (
            <li
              key={`${event.time}-${i}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${i % 2 === 1 ? theme.surfaceAlt : ''}`}
            >
              <Icon size={15} className={meta.text} />
              <span className={`flex-1 text-sm ${theme.text}`}>{event.message}</span>
              <span
                className={`hidden rounded-full px-2 py-0.5 text-[10px] font-medium sm:inline ${meta.text} ${meta.bg}`}
              >
                {meta.badge}
              </span>
              <span className={`font-mono text-xs ${theme.muted}`}>{event.time}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function Sidebar({ theme, isDark, onToggleTheme, user, integrations }) {
  return (
    <aside
      className={`flex h-full w-72 flex-shrink-0 flex-col overflow-y-auto border-r p-5 ${theme.border} ${theme.surface}`}
    >
      <div className="flex items-center gap-2 pb-6">
        <Radar size={20} className="text-cyan-400" />
        <span className={`text-base font-semibold tracking-tight ${theme.text}`}>CloudOps</span>
      </div>

      <div className={`flex items-center gap-3 rounded-lg border p-3 ${theme.border} ${theme.surfaceAlt}`}>
        <div className="relative flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 text-sm font-semibold text-slate-950">
            {initials(user.name)}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 bg-emerald-400 ${theme.ring}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-medium ${theme.text}`}>{user.name}</p>
          <p className={`truncate text-xs ${theme.muted}`}>{user.title}</p>
        </div>
        <button type="button" className={`${theme.muted} hover:text-cyan-400`} aria-label="Settings">
          <Settings size={15} />
        </button>
        <button
          type="button"
          className={`${theme.muted} hover:text-rose-400`}
          aria-label="Log out"
          onClick={() => AUTH_HOOKS.onLogout?.()}
        >
          <LogOut size={15} />
        </button>
      </div>

      <div className="mt-6">
        <p className={`mb-2 text-xs font-medium ${theme.muted}`}>Integrations</p>
        <ul className="space-y-1.5">
          {integrations.map((item) => (
            <li
              key={item.name}
              className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm ${theme.surfaceAlt}`}
            >
              <span className={`flex items-center gap-2 ${theme.text}`}>
                <Plug size={13} className={theme.muted} />
                {item.name}
              </span>
              <span
                className={`font-mono text-[11px] ${
                  item.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {item.status === 'connected' ? 'Connected' : 'Auth required'}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className={`mb-2 text-xs font-medium ${theme.muted}`}>Auth center</p>
        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            className={`w-full rounded-md border px-2.5 py-1.5 text-sm outline-none focus:border-cyan-400 ${theme.border} ${theme.surfaceAlt} ${theme.text}`}
          />
          <input
            type="password"
            placeholder="Password"
            className={`w-full rounded-md border px-2.5 py-1.5 text-sm outline-none focus:border-cyan-400 ${theme.border} ${theme.surfaceAlt} ${theme.text}`}
          />
          <div className="flex gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => AUTH_HOOKS.onLogin?.()}
              className="flex-1 rounded-md bg-cyan-500 py-1.5 text-sm font-medium text-slate-950 hover:bg-cyan-400"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => AUTH_HOOKS.onSignup?.()}
              className={`flex-1 rounded-md border py-1.5 text-sm font-medium hover:border-cyan-400 ${theme.border} ${theme.text}`}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onToggleTheme}
        className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${theme.border} ${theme.surfaceAlt} ${theme.text}`}
      >
        <span className="flex items-center gap-2">
          {isDark ? <Moon size={15} className="text-indigo-400" /> : <Sun size={15} className="text-amber-400" />}
          Dark mode
        </span>
        <span
          className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
            isDark ? 'justify-end bg-cyan-500' : 'justify-start bg-slate-300'
          }`}
        >
          <span className="h-4 w-4 rounded-full bg-white shadow" />
        </span>
      </button>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
function DashboardHeader({ theme, statusOk, alerts, lastUpdated }) {
  return (
    <header
      className={`mb-6 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between ${theme.border}`}
    >
      <div>
        <h1 className={`text-xl font-semibold tracking-tight ${theme.text}`}>CloudOps Autopilot</h1>
        <div className="mt-1.5 flex items-center gap-2">
          <LiveDot color={statusOk ? 'emerald' : 'rose'} />
          <span className={`text-sm ${statusOk ? 'text-emerald-400' : 'text-rose-400'}`}>
            {statusOk ? 'All systems go' : 'Attention required'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-1.5 font-mono text-xs ${theme.muted}`}>
          <Clock size={13} />
          Updated {lastUpdated}
        </div>
        <button
          type="button"
          className={`relative rounded-lg border p-2 ${theme.border} ${theme.surfaceAlt} ${theme.muted} hover:text-indigo-400`}
          aria-label="Alerts"
        >
          <Bell size={16} />
          {alerts > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
              {alerts}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Simulated GET /api/status. Swap this block for a real fetch, e.g.:
    // fetch(`${INTEGRATION_CONFIG.apiBaseUrl}${INTEGRATION_CONFIG.endpoints.status}`)
    //   .then((res) => res.json())
    //   .then((json) => !cancelled && setData(json))
    //   .finally(() => !cancelled && setLoading(false));
    const timer = setTimeout(() => {
      if (!cancelled) {
        setData(MOCK_STATUS);
        setLoading(false);
      }
    }, 1000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

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
