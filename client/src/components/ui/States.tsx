import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { buttonClass } from './styles';

export function LoadingBlock({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-16 text-slate">
      <Loader2 aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-red-800/20 bg-red-50/60 p-6 text-center">
      <AlertTriangle aria-hidden className="mx-auto mb-3 size-6 text-red-800" />
      <p className="text-sm text-ink">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={buttonClass('secondary', 'mt-4')}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyBlock({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-white/60 p-10 text-center">
      <Inbox aria-hidden className="mx-auto mb-3 size-6 text-slate" />
      <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-slate">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
