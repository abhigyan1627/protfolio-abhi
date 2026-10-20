import type { ReactNode } from 'react';
import { STATUS_LABELS } from '../../lib/format';
import type { EnquiryStatus } from '../../types/api';
import { buttonClass, focusRing } from '../ui/styles';

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  NEW: 'bg-navy text-white',
  CONTACTED: 'bg-whatsapp/10 text-whatsapp-dark',
  IN_PROGRESS: 'bg-gold/20 text-gold-700',
  CLOSED: 'bg-line text-slate',
};

export function StatusBadge({ status }: { status: EnquiryStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function AdminPageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold text-navy">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// Accessible on/off switch used for quick publish and enable toggles in tables.
export function ToggleSwitch({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${focusRing} ${
        checked ? 'bg-navy' : 'bg-line'
      }`}
    >
      <span
        aria-hidden
        className={`inline-block size-5 transform rounded-full bg-white shadow transition-transform motion-reduce:transition-none ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-4 text-sm text-slate">
      <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className={buttonClass('secondary', '', 'sm')}>
        Previous
      </button>
      <span aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} className={buttonClass('secondary', '', 'sm')}>
        Next
      </button>
    </nav>
  );
}

export function FormMessage({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      className={`rounded-md border px-4 py-3 text-sm ${
        kind === 'error' ? 'border-red-800/20 bg-red-50 text-red-900' : 'border-whatsapp/20 bg-whatsapp/5 text-whatsapp-dark'
      }`}
    >
      {children}
    </div>
  );
}

export function TableShell({ children, caption }: { children: ReactNode; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

export const thClass = 'border-b border-line bg-ivory px-4 py-3 font-semibold text-navy';
export const tdClass = 'border-b border-line px-4 py-3 align-middle text-ink';
