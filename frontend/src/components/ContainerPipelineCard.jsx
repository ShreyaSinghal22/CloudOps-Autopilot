const CONTAINER_ICONS = { Backend: Server, Database: Database, Redis: Zap, Frontend: Monitor };

import { Fragment } from 'react';
import { Boxes, Database, Monitor, Server, Zap } from 'lucide-react';
import Card from './ui/Card';

export default function ContainerPipelineCard({ containers, theme, className }) {
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