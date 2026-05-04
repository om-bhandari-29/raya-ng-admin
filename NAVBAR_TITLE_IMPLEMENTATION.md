# Navbar Title Implementation

## Overview
Implemented a dynamic page title system that displays the current page title in the navbar instead of having separate headers on each page.

## Changes Made

### 1. Created Page Title Service
**File**: `src/core/services/page-title.service.ts`

A new service to manage the page title globally:
- Uses Angular signals for reactive updates
- Provides `setTitle()` method to update the title
- Provides `getTitle()` method to retrieve the current title
- Default title is "Dashboard"

```typescript
export class PageTitleService {
  public pageTitle: WritableSignal<string> = signal('Dashboard');
  
  setTitle(title: string): void {
    this.pageTitle.set(title);
  }
}
```

### 2. Updated Navbar Component
**Files**: 
- `src/core/component/nav-bar/nav-bar.ts`
- `src/core/component/nav-bar/nav-bar.html`

**Changes**:
- Injected `PageTitleService`
- Added page title display next to the logo
- Title is hidden on mobile (md:block)
- Displays as: `RAYA | [Page Title]`

**HTML Addition**:
```html
<div class="ms-4 hidden md:block">
  <span class="text-base font-medium text-slate-700">
    {{ pageTitleService.pageTitle() }}
  </span>
</div>
```

### 3. Updated Stone Dimension List Page
**File**: `src/pages/stone-dimension/stone-dimension-list/stone-dimension-list.ts`

**Changes**:
- Injected `PageTitleService`
- Sets title to "Stone Dimension" on page load

```typescript
ngOnInit(): void {
  this.pageTitleService.setTitle('Stone Dimension');
  this.loadItems();
}
```

### 4. Updated Stone Dimension Upsert Page
**File**: `src/pages/stone-dimension/stone-dimension-upsert/stone-dimension-upsert.ts`

**Changes**:
- Injected `PageTitleService`
- Sets title based on mode:
  - "New Stone Dimension" for create mode
  - "Edit Stone Dimension" for edit mode
  - Updates to actual stone name after loading data

```typescript
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id && id !== '0') {
    this.itemId.set(parseInt(id, 10));
    this.isEditMode.set(true);
    this.pageTitleService.setTitle('Edit Stone Dimension');
    this.loadItem();
  } else {
    this.pageTitleService.setTitle('New Stone Dimension');
  }
}

// After loading item data
if (res.data.stoneName) {
  this.pageTitleService.setTitle(res.data.stoneName);
}
```

### 5. Updated Upsert Page Layout
**File**: `src/pages/stone-dimension/stone-dimension-upsert/stone-dimension-upsert.html`

**Changes**:
- Removed the separate header bar with back button and title
- Added fixed action buttons (Cancel & Save) in top-right corner
- Buttons are positioned at `top-16 right-6` (below navbar)
- Buttons have shadow and border for better visibility

**New Layout**:
```html
<div class="fixed top-16 right-6 z-10 flex items-center gap-3">
  <button>Cancel</button>
  <button>Save</button>
</div>
```

## Benefits

### 1. Consistent Navigation
- All page titles appear in the same location (navbar)
- Users always know where they are in the application
- Cleaner, more professional look

### 2. More Screen Space
- Removed duplicate headers from pages
- More vertical space for content
- Especially beneficial on smaller screens

### 3. Better UX
- Fixed action buttons always visible while scrolling
- Title updates dynamically based on content
- Matches modern web application patterns

### 4. Reusable Pattern
- Easy to implement on other pages
- Just inject `PageTitleService` and call `setTitle()`
- No need for custom headers on each page

## Usage Pattern for Other Pages

To implement this pattern on other pages:

```typescript
import { PageTitleService } from '../../../core/services/page-title.service';

export class YourComponent implements OnInit {
  private pageTitleService = inject(PageTitleService);

  ngOnInit(): void {
    this.pageTitleService.setTitle('Your Page Title');
  }
}
```

## Visual Layout

### Navbar Structure
```
[☰] RAYA | Stone Dimension                    [Profile]
```

### Upsert Page Structure
```
[Navbar with title]
                                    [Cancel] [Save]

[Form Content]
```

## Technical Details

- **Service**: Singleton service provided at root level
- **Reactivity**: Uses Angular signals for automatic updates
- **Positioning**: Fixed buttons use `fixed` positioning with `z-10`
- **Responsive**: Title hidden on mobile, shown on medium+ screens
- **Styling**: Consistent with existing design system

## Next Steps

To apply this pattern to other pages in the application:

1. Import and inject `PageTitleService` in the component
2. Call `setTitle()` in `ngOnInit()` or when data loads
3. Remove any custom headers from the page template
4. Add fixed action buttons if needed (for edit/create pages)

## Files Modified

1. ✅ `src/core/services/page-title.service.ts` (new)
2. ✅ `src/core/component/nav-bar/nav-bar.ts`
3. ✅ `src/core/component/nav-bar/nav-bar.html`
4. ✅ `src/pages/stone-dimension/stone-dimension-list/stone-dimension-list.ts`
5. ✅ `src/pages/stone-dimension/stone-dimension-upsert/stone-dimension-upsert.ts`
6. ✅ `src/pages/stone-dimension/stone-dimension-upsert/stone-dimension-upsert.html`

## Status
✅ **Complete** - All TypeScript diagnostics pass, navbar displays dynamic titles
