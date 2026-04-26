export enum ItemTab {
  DETAILS = 'details',
  DASHBOARD = 'dashboard',
  INVENTORY = 'inventory',
  VARIANTS = 'variants',
  METAL_TAGS = 'metal-tags',
  STONE_DETAILS = 'stone-details',
  ACCOUNTING = 'accounting',
  PURCHASING = 'purchasing',
  SALES = 'sales',
  TAX = 'tax',
  QUALITY = 'quality',
  MANUFACTURING = 'manufacturing',
}

export const ITEM_TABS: { key: ItemTab; label: string }[] = [
  { key: ItemTab.DETAILS, label: 'Details' },
  { key: ItemTab.DASHBOARD, label: 'Dashboard' },
  { key: ItemTab.INVENTORY, label: 'Inventory' },
  { key: ItemTab.VARIANTS, label: 'Variants' },
  { key: ItemTab.METAL_TAGS, label: 'Metal Tags' },
  { key: ItemTab.STONE_DETAILS, label: 'Stone Details' },
  { key: ItemTab.ACCOUNTING, label: 'Accounting' },
  { key: ItemTab.PURCHASING, label: 'Purchasing' },
  { key: ItemTab.SALES, label: 'Sales' },
  { key: ItemTab.TAX, label: 'Tax' },
  { key: ItemTab.QUALITY, label: 'Quality' },
  { key: ItemTab.MANUFACTURING, label: 'Manufacturing' },
];
