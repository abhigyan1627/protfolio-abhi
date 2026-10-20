import { LayoutDashboard, FileText, Layers, BookOpen, Inbox, LogOut, Settings } from 'lucide-react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LoadingBlock } from '../components/ui/States';
import { focusRing } from '../components/ui/styles';
import { useAdminSession } from '../hooks/AdminSessionProvider';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { ROLE_LABELS } from '../lib/format';

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { to: '/admin/services', label: 'Services', icon: Layers },
  { to: '/admin/plans', label: 'Plans', icon: FileText },
  { to: '/admin/resources', label: 'Resources', icon: BookOpen },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
  const { session, signOut } = useAdminSession();
  const location = useLocation();
  const navigate = useNavigate();

  useDocumentMeta({
    title: 'Admin | CA Mohit Agrawal',
    description: 'Administration area.',
    path: location.pathname,
    noindex: true,
  });

  if (session.status === 'checking') {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ivory">
        <LoadingBlock label="Checking your session" />
      </div>
    );
  }

  if (session.status === 'anonymous') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const user = session.user;

  return (
    <div className="min-h-dvh bg-ivory text-ink lg:flex">
      <aside className="border-b border-line bg-navy text-white lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-7">
          <Link to="/admin/dashboard" className={`rounded-sm ${focusRing}`}>
            <p className="font-display text-base font-bold">CA Mohit Agrawal</p>
            <p className="text-xs text-white/65">Admin</p>
          </Link>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate('/admin/login', { replace: true });
            }}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white lg:mt-8 lg:w-full lg:px-3 ${focusRing}`}
          >
            <LogOut aria-hidden className="size-4" /> Sign out
          </button>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4 lg:pb-0">
          {ADMIN_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `inline-flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${focusRing} ${
                  isActive ? 'bg-white text-navy' : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="hidden px-6 pb-6 pt-10 text-xs text-white/60 lg:block">
          Signed in as {user.email}
          <br />
          Role: {ROLE_LABELS[user.role]}
        </p>
      </aside>

      <div className="min-w-0 flex-1">
        <main id="admin-main" className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
