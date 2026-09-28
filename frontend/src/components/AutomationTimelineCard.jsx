const EVENT_META = {
  deployment: { icon: Rocket, text: 'text-indigo-400', bg: 'bg-indigo-400/10', badge: 'Deployment' },
  warning: { icon: AlertTriangle, text: 'text-amber-400', bg: 'bg-amber-400/10', badge: 'Alert' },
  restart: { icon: RefreshCw, text: 'text-cyan-400', bg: 'bg-cyan-400/10', badge: 'Restart' },
  success: { icon: CheckCircle2, text: 'text-emerald-400', bg: 'bg-emerald-400/10', badge: 'Success' },
};

import { Activity, AlertTriangle, CheckCircle2, RefreshCw, Rocket } from 'lucide-react';
import Card from './ui/Card';

export default function AutomationTimelineCard({ events, theme, className }) {
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