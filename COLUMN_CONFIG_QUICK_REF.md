# Column Configuration Quick Reference Card

## 🚀 Quick Start

### Basic Setup

**1. Import in Component:**
```typescript
import { TableColumn } from '../../../core/models/table-column.interface';
```

**2. Define Columns:**
```typescript
columns: TableColumn<YourInterface>[] = [
  { key: 'name', header: 'Name', type: 'text' }
];
```

**3. Use in Template:**
```html
<app-table-layout
  [columns]="columns"
  [data]="items()"
  (onEdit)="openEdit($any($event).id)">
</app-table-layout>
```

---

## 📋 Column Types Cheat Sheet

| Type | Use Case | Example |
|------|----------|---------|
| `text` | Simple text | `{ key: 'name', header: 'Name', type: 'text' }` |
| `number` | Numbers | `{ key: 'price', header: 'Price', type: 'number' }` |
| `boolean` | Yes/No | `{ key: 'is_active', header: 'Active', type: 'boolean' }` |
| `date` | Dates | `{ key: 'created_at', header: 'Created', type: 'date' }` |
| `badge` | Status | `{ key: 'status', header: 'Status', type: 'badge', badgeConfig: {...} }` |
| `custom` | Custom format | `{ key: 'price', header: 'Price', type: 'custom', format: (v) => ... }` |
| `slot` | Complex cell | `{ key: 'id', header: 'ID', slot: 'id' }` |

---

## 💡 Common Patterns

### Pattern 1: Clickable ID Column
```typescript
// TypeScript
{ key: 'name', header: 'ID', slot: 'id' }

// HTML
<ng-template slot="id" let-item>
  <button (click)="openEdit(item.id)" class="text-blue-600">
    {{ item.name }}
  </button>
</ng-template>
```

### Pattern 2: Nested Property
```typescript
{ key: 'item_group.name', header: 'Item Group', type: 'text' }
```

### Pattern 3: Status Badge
```typescript
{
  key: 'is_active',
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

### Pattern 4: Custom Formatting
```typescript
{
  key: 'labour_rate',
  header: 'Labour Rate',
  type: 'custom',
  format: (value, item) => `${value} (${item.labour_rate_on})`
}
```

### Pattern 5: Conditional Styling
```typescript
{
  key: 'stock',
  header: 'Stock',
  type: 'number',
  cellClass: (item) => item.stock < 10 ? 'text-red-600' : 'text-green-600'
}
```

---

## 🎨 Styling Options

### Cell Alignment
```typescript
{ key: 'price', header: 'Price', align: 'right' }
```

### Column Width
```typescript
{ key: 'id', header: 'ID', width: '120px' }
```

### Cell Class (Static)
```typescript
{ key: 'name', header: 'Name', cellClass: 'text-gray-800 font-medium' }
```

### Cell Class (Dynamic)
```typescript
{ 
  key: 'status', 
  header: 'Status',
  cellClass: (item) => item.is_active ? 'text-green-600' : 'text-red-600'
}
```

---

## 🔧 TableLayout Props

### Inputs
```typescript
[columns]="columns"              // Column configuration
[data]="items()"                 // Data array
[addButtonText]="'Add Item'"     // Add button text
[isLoading]="isLoading()"        // Loading state
[errorMessage]="errorMessage()"  // Error message
[showCheckbox]="true"            // Show checkbox column
[showActions]="true"             // Show actions column
```

### Outputs
```typescript
(onAdd)="openAdd()"              // Add button clicked
(onRefresh)="loadItems()"        // Refresh button clicked
(onEdit)="openEdit($any($event).id)"    // Edit button clicked
(onDelete)="delete($any($event).id)"    // Delete button clicked
```

---

## ✅ Do's and ❌ Don'ts

### ✅ Do's

**Use simple types when possible:**
```typescript
✅ { key: 'is_active', header: 'Active', type: 'boolean' }
```

**Use nested properties:**
```typescript
✅ { key: 'item_group.name', header: 'Group', type: 'text' }
```

**Use type-safe columns:**
```typescript
✅ columns: TableColumn<IItem>[] = [...]
```

### ❌ Don'ts

**Don't use slots for simple text:**
```typescript
❌ { key: 'name', header: 'Name', slot: 'name' }
✅ { key: 'name', header: 'Name', type: 'text' }
```

**Don't use format for nested properties:**
```typescript
❌ { key: 'item_group', format: (v) => v?.name }
✅ { key: 'item_group.name', type: 'text' }
```

**Don't skip type parameter:**
```typescript
❌ columns: TableColumn[] = [...]
✅ columns: TableColumn<IItem>[] = [...]
```

---

## 🎯 Real-World Examples

### Simple Table (3 columns)
```typescript
columns: TableColumn<IUom>[] = [
  { key: 'name', header: 'ID', slot: 'id' },
  { key: 'name', header: 'Name', type: 'text' },
  { key: 'is_active', header: 'Active', type: 'boolean' }
];
```

### Complex Table (6 columns)
```typescript
columns: TableColumn<IItem>[] = [
  { key: 'name', header: 'ID', width: '150px', slot: 'id' },
  { key: 'name', header: 'Name', type: 'text', cellClass: 'font-medium' },
  { key: 'item_group.name', header: 'Group', type: 'text' },
  { key: 'product_master.name', header: 'Product', type: 'text' },
  { key: 'has_variants', header: 'Variants', type: 'boolean' },
  { key: 'is_disabled', header: 'Active', slot: 'is_active' }
];
```

---

## 🐛 Troubleshooting

### Column not showing data
**Problem:** Typo in key name  
**Solution:** Check property name matches interface

### Nested property shows [object Object]
**Problem:** Missing nested key  
**Solution:** Use `item_group.name` instead of `item_group`

### Custom template not rendering
**Problem:** Slot name mismatch  
**Solution:** Ensure slot name in column matches ng-template slot attribute

### TypeScript error on property
**Problem:** Property doesn't exist on type  
**Solution:** Add type parameter: `TableColumn<YourInterface>[]`

---

## 📚 Full Documentation

For complete documentation with detailed examples, see:
- `GENERIC_TABLE_GUIDE.md` - Comprehensive guide
- `COLUMN_CONFIGURATION_UPDATE_SUMMARY.md` - Implementation summary

---

**Quick Tip:** Start with simple `type: 'text'` columns, then add complexity only where needed!
