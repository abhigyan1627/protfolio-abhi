import {
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  FileCheck,
  FileText,
  Landmark,
  LineChart,
  Receipt,
  Rocket,
  Scale,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  'file-text': FileText,
  calculator: Calculator,
  receipt: Receipt,
  building: Building2,
  landmark: Landmark,
  briefcase: Briefcase,
  rocket: Rocket,
  'book-open': BookOpen,
  'shield-check': ShieldCheck,
  'line-chart': LineChart,
  users: Users,
  'file-check': FileCheck,
  scale: Scale,
  wallet: Wallet,
};

export function ServiceIcon({ iconKey, className = 'size-5' }: { iconKey: string; className?: string }) {
  const Icon = ICONS[iconKey] ?? FileText;
  return <Icon aria-hidden className={className} />;
}
