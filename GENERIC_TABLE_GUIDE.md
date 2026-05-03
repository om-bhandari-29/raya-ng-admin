# Generic Table System - Complete Guide

## 🎉 Overview

The new generic table system allows you to create data tables with **70-80% less code** by using column configuration instead of writing repetitive HTML.

---

## 📊 Before vs After Comparison

### ❌ Before (50+ lines of HTML)
```html
<table>
  <thead>
    <tr>
      <th><input type="checkbox" /></th>
      <th>ID</th>
      <th>Item Group Name</th>
      <th>Parent Item Group</th>
      <th>Is Group</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    @for (item of items(); track item.id) {
      <tr>
        <td><input type="checkbox" /></td>
        <td>
          <button (click)="openEdit(item.id)">{{ item.name }}</button>
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.parent || '-' }}</td>
        <td>
          @if (item.is_active) {
            <i class="bx bx-check"></i>
          } @else {
            <span>-</span>
          }
        </td>
        <td>
          <!-- Actions buttons -->
        </td>
      </tr>
    }
  </tbody>
</table>
```

### ✅ After (10-15 lines)
```typescript
// Component
columns: TableColumn<IGroupItem>[] = [
  { key: 'name', header: 'ID', slot: 'id' },
  { key: 'name', header: 'Item Group Name', type: 'text' },
  { key: 'parent', header: 'Parent Item Group', type: 'text' },
  { key: 'is_active', header: 'Is Group', type: 'boolean' }
];
```

```html
<!-- Template -->
<app-table-layout
  [columns]="columns"
  [data]="items()"
  (onEdit)="openEdit($any($event).id)">
  
  <ng-template slot="id" let-item>
    <button (click)="openEdit(item.id)">{{ item.name }}</button>
  </ng-template>
</app-table-layout>
```

---

## 🔧 Column Types

### 1. **Text** (Default)
Simple text display.

```typescript
{
  key: 'name',
  header: 'Name',
  type: 'text'  // Optional, this is the default
}
```

**Output**: `John Doe` or `-` if null

---

### 2. **Number**
Formatted numbers with locale support.

```typescript
{
  key: 'price',
  header: 'Price',
  type: 'number'
}
```

**Output**: `1,234.56`

---

### 3. **Boolean**
Displays checkmark icon for true, dash for false.

```typescript
{
  key: 'is_active',
  header: 'Is Active',
  type: 'boolean'
}
```

**Output**: ✓ (green checkmark) or `-`

---

### 4. **Date**
Formatted date display.

```typescript
{
  key: 'created_at',
  header: 'Created Date',
  type: 'date'
}
```

**Output**: `5/3/2026`

---

### 5. **Badge**
Colored badge for status display.

```typescript
{
  key: 'status',
  header: 'Status',
  type: 'badge',
  badgeConfig: {
    trueLabel: 'Active',
    falseLabel: 'Inactive',
    trueClass: 'bg-green-100 text-green-700',
    falseClass: 'bg-red-100 text-red-600'
  }
}
```

**Output**: `Active` (green badge) or `Inactive` (red badge)

---

### 6. **Custom** (with format function)
Custom transformation of values.

```typescript
{
  key: 'labour_rate',
  header: 'Labour Rate',
  type: 'custom',
  format: (value, item) => `${value} (${item.labour_rate_on})`
}
```

**Output**: `100 (Per Gram)`

---

### 7. **Slot** (Custom Template)
For complex cells that need full template control.

```typescript
// In component
{
  key: 'id',
  header: 'ID',
  slot: 'id'  // References template with slot="id"
}
```

```html
<!-- In template -->
<ng-template slot="id" let-item>
  <button (click)="openEdit(item.id)" class="text-blue-600">
    {{ item.name }}
  </button>
</ng-template>
```

---

## 📝 Column Configuration Options

### Complete Interface

```typescript
interface TableColumn<T> {
  key: string;                    // Property name (supports nested: 'parent.name')
  header: string;                 // Column header text
  type?: ColumnType;              // 'text' | 'number' | 'boolean' | 'date' | 'badge' | 'custom'
  width?: string;                 // Column width: '100px', '20%'
  sortable?: boolean;             // Enable sorting (future feature)
  align?: 'left' | 'center' | 'right';  // Text alignment
  
  // For custom templates
  slot?: string;                  // Template slot name
  
  // For simple transformations
  format?: (value: any, item: T) => string;
  
  // For badge type
  badgeConfig?: {
    trueLabel?: string;
    falseLabel?: string;
    trueClass?: string;
    falseClass?: string;
  };
  
  // Conditional styling
  cellClass?: string | ((item: T) => string);
  
  // Hide column
  hidden?: boolean;
}
```

---

## 🎯 Real-World Examples

### Example 1: Simple Table (Sub Category)

```typescript
// sub-category-list.ts
columns: TableColumn<ISubCategory>[] = [
  {
    key: 'name',
    header: 'ID',
    width: '120px',
    slot: 'id'
  },
  {
    key: 'name',
    header: 'Sub Category Name',
    type: 'text',
    cellClass: 'text-gray-800 font-medium'
  },
  {
    key: 'item_group.name',  // Nested property!
    header: 'Item Group',
    type: 'text'
  },
  {
    key: 'is_active',
    header: 'Is Active',
    type: 'boolean'
  }
];
```

```html
<!-- sub-category-list.html -->
<app-table-layout
  [columns]="columns"
  [data]="items()"
  [addButtonText]="'Add Sub Category'"
  (onAdd)="openAddModal()"
  (onEdit)="openEditModal($any($event).id)"
  (onDelete)="delete($any($event).id)">
  
  <ng-template slot="id" let-item>
    <button (click)="openEditModal(item.id)" class="text-blue-600">
      {{ item.name }}
    </button>
  </ng-template>
</app-table-layout>
```

---

### Example 2: Table with Badges (Item Attribute)

```typescript
// item-attribute-list.ts
columns: TableColumn<IItemAttribute>[] = [
  {
    key: 'attribute_name',
    header: 'ID',
    slot: 'id'
  },
  {
    key: 'attribute_name',
    header: 'Attribute Name',
    type: 'text'
  },
  {
    key: 'numeric_values',
    header: 'Type',
    type: 'badge',
    badgeConfig: {
      trueLabel: 'Numeric',
      falseLabel: 'Text',
      trueClass: 'bg-blue-100 text-blue-700',
      falseClass: 'bg-purple-100 text-purple-700'
    }
  },
  {
    key: 'values',
    header: 'Values Count',
    type: 'custom',
    format: (values) => values?.length || 0
  },
  {
    key: 'status',
    header: 'Is Active',
    type: 'boolean'
  }
];
```

---

### Example 3: Table with Custom Formatting (Product Master)

```typescript
// product-master-list.ts
columns: TableColumn<IProductMaster>[] = [
  {
    key: 'name',
    header: 'ID',
    slot: 'id'
  },
  {
    key: 'name',
    header: 'Product Name',
    type: 'text',
    cellClass: 'text-gray-800 font-medium'
  },
  {
    key: 'sub_category.name',
    header: 'Sub Category',
    type: 'text'
  },
  {
    key: 'labour_rate',
    header: 'Labour Rate',
    type: 'custom',
    format: (value, item) => `${value} (${item.labour_rate_on})`
  },
  {
    key: 'is_active',
    header: 'Is Active',
    type: 'boolean'
  }
];
```

---

### Example 4: Conditional Cell Styling

```typescript
columns: TableColumn<IItem>[] = [
  {
    key: 'stock_level',
    header: 'Stock',
    type: 'number',
    cellClass: (item) => {
      if (item.stock_level < 10) return 'text-red-600 font-bold';
      if (item.stock_level < 50) return 'text-yellow-600';
      return 'text-green-600';
    }
  }
];
```

---

## 🎨 TableLayout Component Props

### Inputs

```typescript
@Input() columns: TableColumn<T>[] = [];        // Column configuration
@Input() data: T[] = [];                        // Data array
@Input() addButtonText: string = 'Add Item';    // Add button text
@Input() isLoading: boolean = false;            // Loading state
@Input() errorMessage: string | null = null;    // Error message
@Input() showCheckbox: boolean = true;          // Show checkbox column
@Input() showActions: boolean = true;           // Show actions column
```

### Outputs

```typescript
@Output() onAdd = new EventEmitter<void>();     // Add button clicked
@Output() onRefresh = new EventEmitter<void>(); // Refresh button clicked
@Output() onEdit = new EventEmitter<T>();       // Edit button clicked
@Output() onDelete = new EventEmitter<T>();     // Delete button clicked
```

---

## 🚀 Migration Guide

### Step 1: Update Component

```typescript
// OLD
export class MyList extends Base {
  items = signal<IMyItem[]>([]);
  // ... duplicate code
}

// NEW
export class MyList extends ListBase<IMyItem> {
  columns: TableColumn<IMyItem>[] = [
    // Define columns
  ];
}
```

### Step 2: Update Template

```html
<!-- OLD: 50+ lines of table HTML -->
<table>...</table>

<!-- NEW: 10-15 lines -->
<app-table-layout
  [columns]="columns"
  [data]="items()"
  (onEdit)="openEdit($any($event).id)">
  
  <!-- Only custom cells need templates -->
  <ng-template slot="id" let-item>
    <button (click)="openEdit(item.id)">{{ item.name }}</button>
  </ng-template>
</app-table-layout>
```

---

## 💡 Best Practices

### 1. **Use Simple Types When Possible**
```typescript
// ✅ Good - Let the system handle it
{ key: 'is_active', header: 'Is Active', type: 'boolean' }

// ❌ Avoid - Unnecessary custom template
{ key: 'is_active', header: 'Is Active', slot: 'active' }
```

### 2. **Use Nested Properties**
```typescript
// ✅ Good - Supports nested access
{ key: 'item_group.name', header: 'Item Group', type: 'text' }

// ❌ Avoid - Unnecessary format function
{ 
  key: 'item_group', 
  header: 'Item Group',
  format: (value) => value?.name 
}
```

### 3. **Use Slots for Complex Cells Only**
```typescript
// ✅ Good - Simple text
{ key: 'name', header: 'Name', type: 'text' }

// ✅ Good - Complex interaction
{ key: 'id', header: 'ID', slot: 'id' }  // With clickable button

// ❌ Avoid - Slot for simple text
{ key: 'name', header: 'Name', slot: 'name' }
```

### 4. **Type Safety**
```typescript
// ✅ Good - Type-safe
columns: TableColumn<IGroupItem>[] = [
  { key: 'name', header: 'Name' }  // TypeScript knows 'name' exists
];

// ❌ Avoid - No type safety
columns: TableColumn[] = [
  { key: 'namee', header: 'Name' }  // Typo won't be caught
];
```

---

## 🎯 Quick Reference

| Need | Solution | Example |
|------|----------|---------|
| Simple text | `type: 'text'` | Name, Description |
| Number | `type: 'number'` | Price, Quantity |
| Yes/No | `type: 'boolean'` | Is Active, Published |
| Date | `type: 'date'` | Created At |
| Status badge | `type: 'badge'` | Active/Inactive |
| Custom format | `format: (v) => ...` | "100 (Per Gram)" |
| Clickable link | `slot: 'id'` | ID column |
| Nested property | `key: 'parent.name'` | Related entity |
| Conditional style | `cellClass: (item) => ...` | Red if low stock |

---

## 📈 Benefits

### Code Reduction
- **Before**: 50-60 lines of HTML per table
- **After**: 10-15 lines per table
- **Savings**: 70-80% less code

### Consistency
- All tables look the same
- Same behavior across pages
- Easy to maintain

### Type Safety
- Full TypeScript support
- Autocomplete for properties
- Compile-time error checking

### Flexibility
- Simple columns are automatic
- Complex cells use templates
- Easy to extend

---

## 🐛 Troubleshooting

### Issue: Column not showing data
```typescript
// ❌ Wrong - typo in key
{ key: 'namee', header: 'Name' }

// ✅ Correct
{ key: 'name', header: 'Name' }
```

### Issue: Nested property shows [object Object]
```typescript
// ❌ Wrong - missing nested key
{ key: 'item_group', header: 'Item Group' }

// ✅ Correct
{ key: 'item_group.name', header: 'Item Group' }
```

### Issue: Custom template not rendering
```html
<!-- ❌ Wrong - slot name doesn't match -->
<ng-template slot="myId" let-item>...</ng-template>

<!-- Column config -->
{ key: 'id', slot: 'id' }  // Looking for slot="id"

<!-- ✅ Correct -->
<ng-template slot="id" let-item>...</ng-template>
```

---

## 🎉 Summary

The generic table system provides:
- ✅ 70-80% less code
- ✅ Type-safe configuration
- ✅ Automatic rendering for common types
- ✅ Flexible templates for complex cells
- ✅ Consistent design across all pages
- ✅ Easy to maintain and extend

**Result**: Faster development, fewer bugs, happier developers! 🚀
