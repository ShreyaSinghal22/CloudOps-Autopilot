const PIPELINE_ICONS = [GitCommit, Hammer, FlaskConical, Rocket, CheckCircle2];

import { Fragment } from 'react';
import { CheckCircle2, FlaskConical, GitBranch, GitCommit, Hammer, Rocket } from 'lucide-react';
import Card from './ui/Card';

export default function DeploymentPipelineCard({ deployment, theme, className }) {
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