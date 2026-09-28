import { Cpu, HardDrive } from 'lucide-react';
import Card from './ui/Card';
import GaugeRing from './ui/GaugeRing';
import ProgressBar from './ui/ProgressBar';

// The helper function specific to this component stays here
function usageColor(pct) {
  if (pct < 60) return { hex: '#34d399', bar: 'bg-emerald-400' };
  if (pct < 85) return { hex: '#f59e0b', bar: 'bg-amber-400' };
  return { hex: '#f43f5e', bar: 'bg-rose-400' };
}

export default function ResourceUsageCard({ cpu, disk, theme, className }) {
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
