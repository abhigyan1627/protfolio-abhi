import { cx } from '../../lib/cx';

export const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory';

export type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'danger' | 'onDark';
export type ButtonSize = 'md' | 'sm';

const buttonBase = `inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200 motion-reduce:transition-none ${focusRing} disabled:cursor-not-allowed disabled:opacity-60`;

const buttonSizes: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-sm',
  sm: 'px-4 py-2 text-sm',
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-navy text-white hover:bg-navy-700',
  secondary: 'border border-navy/25 bg-white text-navy hover:border-navy hover:bg-navy hover:text-white',
  whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-dark',
  danger: 'border border-red-800/40 bg-white text-red-800 hover:bg-red-50',
  onDark: 'border border-white/40 text-white hover:bg-white hover:text-navy',
};

export const buttonClass = (variant: ButtonVariant = 'primary', extra?: string, size: ButtonSize = 'md') =>
  cx(buttonBase, buttonSizes[size], buttonVariants[variant], extra);

export const inputClass =
  'block w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-slate/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20 aria-[invalid=true]:border-red-800';

export const labelClass = 'mb-1.5 block text-sm font-medium text-ink';
export const errorClass = 'mt-1.5 text-sm text-red-800';
export const hintClass = 'mt-1.5 text-sm text-slate';
export const cardClass = 'rounded-lg border border-line bg-white p-6 shadow-[0_1px_2px_rgba(16,35,63,0.04)]';
export const eyebrowClass = 'text-xs font-semibold uppercase tracking-[0.18em] text-gold-700';
export const containerClass = 'mx-auto w-full max-w-6xl px-5 sm:px-8';
export const headingClass = 'font-display font-bold tracking-tight';
