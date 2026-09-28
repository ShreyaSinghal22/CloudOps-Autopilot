
import { HeartPulse, Clock } from 'lucide-react';
import Card from './ui/Card';
import LiveDot from './ui/LiveDot';

export default function AppHealthCard({ health, theme, className }) {
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