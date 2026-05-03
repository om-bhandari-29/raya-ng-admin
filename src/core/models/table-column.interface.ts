export type ColumnType = 'text' | 'number' | 'boolean' | 'date' | 'badge' | 'custom';

export interface BadgeConfig {
  trueLabel?: string;
  falseLabel?: string;
  trueClass?: string;
  falseClass?: string;
}

export interface TableColumn<T = any> {
  key: string;                          // Property key (supports nested like 'parent.name')
  header: string;                       // Column header text
  type?: ColumnType;                    // Column type (default: 'text')
  width?: string;                       // Column width (e.g., '100px', '20%')
  sortable?: boolean;                   // Enable sorting (future feature)
  align?: 'left' | 'center' | 'right'; // Text alignment
  
  // For custom rendering via template
  slot?: string;                        // Template slot name
  
  // For simple transformations
  format?: (value: any, item: T) => string;
  
  // For badge type
  badgeConfig?: BadgeConfig;
  
  // Conditional styling
  cellClass?: string | ((item: T) => string);
  
  // Hide column on certain conditions
  hidden?: boolean;
}
