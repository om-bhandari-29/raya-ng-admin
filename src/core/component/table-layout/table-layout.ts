import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../models/table-column.interface';

@Component({
  selector: 'app-table-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-layout.html',
  styleUrl: './table-layout.scss',
})
export class TableLayout<T = any> implements AfterContentInit {
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() title: string = '';
  @Input() showAddButton: boolean = true;
  @Input() addButtonText: string = 'Add Item';
  @Input() isLoading: boolean = false;
  @Input() errorMessage: string | null = null;
  @Input() totalCount: number = 0;
  @Input() showCheckbox: boolean = true;
  @Input() showActions: boolean = true;
  
  @Output() onAdd = new EventEmitter<void>();
  @Output() onRefresh = new EventEmitter<void>();
  @Output() onRowClick = new EventEmitter<T>();
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();

  // Capture all ng-template elements
  @ContentChildren(TemplateRef) templates!: QueryList<TemplateRef<any>>;
  
  private templateMap = new Map<string, TemplateRef<any>>();

  ngAfterContentInit(): void {
    // Map templates by their slot names
    // Note: In actual usage, we'll use template reference variables
  }

  handleAdd(): void {
    this.onAdd.emit();
  }

  handleRefresh(): void {
    this.onRefresh.emit();
  }

  handleRowClick(item: T): void {
    this.onRowClick.emit(item);
  }

  handleEdit(item: T): void {
    this.onEdit.emit(item);
  }

  handleDelete(item: T): void {
    this.onDelete.emit(item);
  }

  // Get nested property value (supports 'parent.name' syntax)
  getNestedValue(obj: any, path: string): any {
    if (!path || !obj) return null;
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  // Render cell based on column type
  renderCell(column: TableColumn<T>, item: T): string {
    const value = this.getNestedValue(item, column.key);
    
    // Use custom format function if provided
    if (column.format) {
      return column.format(value, item);
    }
    
    switch (column.type) {
      case 'boolean':
        return ''; // Will be handled in template with icon
      case 'date':
        return this.formatDate(value);
      case 'number':
        return this.formatNumber(value);
      case 'badge':
        return ''; // Will be handled in template
      default:
        return value != null ? String(value) : '-';
    }
  }

  // Check if column should render boolean icon
  shouldRenderBooleanIcon(column: TableColumn<T>, item: T): boolean {
    if (column.type !== 'boolean') return false;
    const value = this.getNestedValue(item, column.key);
    return value === true;
  }

  // Get badge configuration
  getBadgeClass(column: TableColumn<T>, item: T): string {
    const value = this.getNestedValue(item, column.key);
    const config = column.badgeConfig;
    
    if (!config) {
      return value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600';
    }
    
    return value ? (config.trueClass || 'bg-green-100 text-green-700') 
                 : (config.falseClass || 'bg-red-100 text-red-600');
  }

  getBadgeLabel(column: TableColumn<T>, item: T): string {
    const value = this.getNestedValue(item, column.key);
    const config = column.badgeConfig;
    
    if (!config) {
      return value ? 'Active' : 'Inactive';
    }
    
    return value ? (config.trueLabel || 'Active') 
                 : (config.falseLabel || 'Inactive');
  }

  // Get cell class
  getCellClass(column: TableColumn<T>, item: T): string {
    if (typeof column.cellClass === 'function') {
      return column.cellClass(item);
    }
    return column.cellClass || '';
  }

  // Format date
  private formatDate(value: any): string {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleDateString();
  }

  // Format number
  private formatNumber(value: any): string {
    if (value == null) return '-';
    return Number(value).toLocaleString();
  }

  // Get time ago (for actions column)
  getTimeAgo(dateString: string): string {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInMinutes < 1) {
      return 'just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInDays < 30) {
      return `${diffInDays}d`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths}M`;
    } else {
      return `${diffInYears}y`;
    }
  }

  // Track by function for ngFor
  trackByKey(index: number, column: TableColumn<T>): string {
    return column.key;
  }

  trackById(index: number, item: any): any {
    return item.id || index;
  }
}

