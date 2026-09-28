

export default function Card({ theme, title, icon: Icon, accentClass, glowClass = '', className = '', children }) {
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
