export interface NavItem {
  label: string
  to: string
  icon: string
  matchPrefix?: boolean
}

export const navigation: NavItem[] = [
  { label: 'Analytics', to: '/analytics', icon: 'pi pi-chart-bar' },
  { label: 'Sites', to: '/sites', icon: 'pi pi-globe' },
  { label: 'Visitors', to: '/visitors', icon: 'pi pi-users', matchPrefix: true },
  { label: 'Blocklist', to: '/blocklist', icon: 'pi pi-ban' },
]
