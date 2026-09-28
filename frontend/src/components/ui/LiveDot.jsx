
export default function LiveDot({ color = 'emerald' }) {
  const dot = { emerald: 'bg-emerald-500', rose: 'bg-rose-500', amber: 'bg-amber-500' }[color];
  const ping = { emerald: 'bg-emerald-400', rose: 'bg-rose-400', amber: 'bg-amber-400' }[color];
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${ping} opacity-75`} />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot}`} />
    </span>
  );
}
