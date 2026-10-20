export interface NavItem {
  label: string;
  to: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
];

export const LEGAL_NAV: NavItem[] = [
  { label: 'Privacy policy', to: '/privacy-policy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Disclaimer', to: '/terms#disclaimer' },
];
