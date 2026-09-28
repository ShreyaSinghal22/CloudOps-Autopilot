import { useEffect, useState } from 'react';

export default function ProgressBar({ percentage, colorClass, theme }) {
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
