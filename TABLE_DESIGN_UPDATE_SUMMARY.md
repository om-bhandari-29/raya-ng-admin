# Table Design Update Summary

## Overview
Created a generic table layout component and updated all list pages to have a consistent, modern design matching the ERPNext-style interface.

## New Components Created

### 1. **TableLayout Component** (`src/core/component/table-layout/`)
A reusable component that provides:
- Page header with action buttons (List View, Refresh, More Options, Add)
- Left sidebar with filter options
- Search and filter bar
- Loading and error states
- Content projection for custom table content

**Features:**
- Configurable add button text
- Loading state management
- Error message display
- Total count display
- Event emitters for add and refresh actions

### 2. **ListBase Class** (`src/core/base/list-base.ts`)
An abstract base class for all list components that provides:
- Common signals: `items`, `isLoading`, `errorMessage`
- Abstract `loadItems()` method
- `getTimeAgo()` utility method for relative time display

## Design Features

### Page Header
- **List View Selector**: Dropdown for view options
- **Refresh Button**: Reload data
- **More Options**: Additional actions menu
- **Add Button**: Dark gray button with icon

### Left Sidebar - Filters
- Filter By section
- Collapsible filter options:
  - Assigned To
  - Created By
  - Edit Filters
  - Tags
  - Show Tags
- Save Filter input field

### Search Bar
- ID search input
- Filter button
- Clear filter button (X)
- Sort by "Last Updated On"

### Table Design
- **Checkbox column**: For bulk selection
- **ID column**: Clickable, opens edit modal (blue link)
- **Data columns**: Custom per table
- **Is Active column**: Green checkmark icon or dash
- **Actions column**:
  - Time ago display (3m, 1h, 1d, 1M, 1y)
  - Comment icon with count
  - Heart/favorite icon
  - Edit and Delete buttons (visible on hover)
- **Row count**: "X of X" with heart icon

### Visual Styling
- Clean gray and white color scheme
- Hover effects on table rows
- Boxicons for all icons
- Smooth transitions
- Responsive layout

## Updated Pages

### 1. **Item Group** (`src/pages/group-item/group-item-list/`)
- ✅ Updated to use TableLayout component
- ✅ Extends ListBase class
- ✅ Columns: ID, Item Group Name, Parent Item Group, Is Group, Actions

### 2. **Sub Category** (`src/pages/sub-category/sub-category-list/`)
- ✅ Updated to use TableLayout component
- ✅ Extends ListBase class
- ✅ Columns: ID, Sub Category Name, Item Group, Is Active, Actions

### 3. **UOM** (`src/pages/uom/uom-list/`)
- ✅ Updated to use TableLayout component
- ✅ Extends ListBase class
- ✅ Columns: ID, UOM Name, Description, Is Active, Actions

## Remaining Pages to Update

The following pages still need to be updated with the new table design:

### 4. **GST HSN Code** (`src/pages/gst-hsn-code/gst-hsn-code-list/`)
- Columns: ID, HSN Code, Description, GST Rate, Is Active, Actions

### 5. **Item Attribute** (`src/pages/item-attribute/item-attribute-list/`)
- Columns: ID, Attribute Name, Type, Is Active, Actions

### 6. **Product Master** (`src/pages/product-master/product-master-list/`)
- Columns: ID, Product Name, Category, Is Active, Actions

### 7. **Stone Master** (`src/pages/stone-master/stone-master-list/`)
- Columns: ID, Stone Name, Family, Clarity, Shape, Is Active, Actions

### 8. **Item** (`src/pages/item/item-list/`)
- Columns: ID, Item Name, Group, Category, Is Active, Actions

## How to Update Remaining Pages

### Step 1: Update TypeScript Component

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ListBase } from '../../../core/base/list-base';
import { TableLayout } from '../../../core/component/table-layout/table-layout';
// ... other imports

@Component({
  selector: 'app-xxx-list',
  imports: [TableLayout],
  templateUrl: './xxx-list.html',
  styleUrl: './xxx-list.scss',
})
export class XxxList extends ListBase<IXxx> implements OnInit {
  // Change signal names from specific names to 'items'
  // Change loadAll/getAll methods to 'loadItems'
  // Remove getTimeAgo method (inherited from ListBase)
}
```

### Step 2: Update HTML Template

```html
<app-table-layout
  [addButtonText]="'Add XXX'"
  [isLoading]="isLoading()"
  [errorMessage]="errorMessage()"
  [totalCount]="items().length"
  (onAdd)="openAddModal()"
  (onRefresh)="loadItems()">
  
  <!-- Table Content -->
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th scope="col" class="w-10 px-4 py-3">
            <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
          </th>
          <!-- Add your columns here -->
          <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
            <div class="flex items-center justify-end gap-2">
              <span>{{ items().length }} of {{ items().length }}</span>
              <i class="bx bx-heart text-base"></i>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
        @for (item of items(); track item.id) {
          <tr class="hover:bg-gray-50 transition-colors group">
            <!-- Add your table cells here -->
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-4 text-gray-500">
                <span class="text-xs">{{ getTimeAgo(item.updated_at) }}</span>
                <button class="hover:text-blue-600">
                  <i class="bx bx-comment text-base"></i>
                  <span class="text-xs ml-1">0</span>
                </button>
                <button class="hover:text-red-600">
                  <i class="bx bx-heart text-base"></i>
                </button>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <button type="button" (click)="openEditModal(item.id)" class="text-gray-400 hover:text-blue-600">
                    <i class="bx bx-edit text-base"></i>
                  </button>
                  <button type="button" (click)="delete(item.id)" class="text-gray-400 hover:text-red-600">
                    <i class="bx bx-trash text-base"></i>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="X" class="px-4 py-10 text-center text-gray-400 text-sm">
              No items found.
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
  
</app-table-layout>
```

## Benefits

### Code Reusability
- Single TableLayout component used across all list pages
- ListBase class provides common functionality
- Consistent behavior and styling

### Maintainability
- Changes to table design only need to be made in one place
- Easy to add new list pages
- Consistent patterns across the application

### User Experience
- Consistent interface across all pages
- Modern, clean design
- Intuitive navigation and actions
- Responsive layout

### Performance
- Signals for reactive state management
- Efficient change detection
- Lazy loading support

## Color Palette

| Element | Color | Tailwind Class |
|---------|-------|----------------|
| Background | White | `bg-white` |
| Table Header | Gray 50 | `bg-gray-50` |
| Text | Gray 800 | `text-gray-800` |
| Secondary Text | Gray 600 | `text-gray-600` |
| Border | Gray 200 | `border-gray-200` |
| Hover | Gray 50 | `hover:bg-gray-50` |
| Link | Blue 600 | `text-blue-600` |
| Success | Green 600 | `text-green-600` |
| Danger | Red 600 | `text-red-600` |
| Button | Gray 800 | `bg-gray-800` |

## Icons

All icons use Boxicons library:
- `bx-list-ul` - List view
- `bx-refresh` - Refresh
- `bx-dots-horizontal-rounded` - More options
- `bx-plus` - Add
- `bx-filter` - Filter
- `bx-sort` - Sort
- `bx-check` - Active/checked
- `bx-comment` - Comments
- `bx-heart` - Favorite
- `bx-edit` - Edit
- `bx-trash` - Delete
- `bx-chevron-down` - Dropdown

## Next Steps

1. Update remaining list pages (GST HSN Code, Item Attribute, Product Master, Stone Master, Item)
2. Add functional filter implementation
3. Add bulk selection functionality
4. Add sorting functionality
5. Add pagination
6. Add export functionality
7. Add advanced search
8. Add saved filters functionality

## Testing Checklist

- [ ] All list pages load correctly
- [ ] Add button opens modal
- [ ] Refresh button reloads data
- [ ] Edit button opens edit modal
- [ ] Delete button shows confirmation and deletes
- [ ] Hover effects work on table rows
- [ ] Time ago displays correctly
- [ ] Loading state shows spinner
- [ ] Error state shows error message
- [ ] Empty state shows "No items found"
- [ ] Responsive layout works on different screen sizes
