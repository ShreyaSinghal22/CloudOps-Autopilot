import { Bell, Clock } from 'lucide-react';
import LiveDot from './ui/LiveDot';

export default function DashboardHeader({ theme, statusOk, alerts, lastUpdated }) {
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
