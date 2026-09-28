import { AUTH_HOOKS } from '../hooks/auth';
import { Moon, Sun, LogOut, Settings, Plug, Radar } from 'lucide-react';
import { initials } from '../utils/string';

export default function Sidebar({ theme, isDark, onToggleTheme, user, integrations }) {
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