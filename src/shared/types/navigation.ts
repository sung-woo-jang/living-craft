export interface NavigationItem {
  label: string;
  path: string;
  iconName?: string;
  isMore?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showBottomNav?: boolean;
}
