export interface NavigationItem {
  id: string;
  title: string;
  icon: string;
  route: string;
  badge?: number;
}

export interface NavigationSection {
  id: string;
  title?: string;
  items: NavigationItem[];
}

export type NavigationState = 'closed' | 'opening' | 'open' | 'closing';
