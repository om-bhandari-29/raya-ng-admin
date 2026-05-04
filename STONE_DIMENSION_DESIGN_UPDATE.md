# Stone Dimension Design Update

## Overview
Updated the stone dimension upsert page to match the simpler, cleaner two-column layout shown in the reference image.

## Design Changes

### Previous Design
- Multi-section layout with separate cards for different categories
- Three-column layout with sidebar
- Sectioned organization (Basic Information, Size & Dimensions, Pricing, Additional Information)
- More visual separation and grouping

### New Design (Current)
- **Single card layout** with clean white background
- **Two-column grid** for all form fields
- **Simpler, flatter design** with minimal visual hierarchy
- **Consistent field styling** across all inputs
- **Full-width Source File textarea** at the bottom

## Layout Structure

### Header
- Back button (left arrow icon)
- Dynamic title showing stone name or "New Stone Dimension"
- Cancel button (text only)
- Save button (dark background)

### Form Layout
- Single white card with border
- Two-column grid (grid-cols-2)
- Consistent spacing (gap-x-8 gap-y-6)
- All fields have equal visual weight

### Field Order (Left to Right, Top to Bottom)
1. **Shape** | **Size Range**
2. **Stone Name** | **length**
3. **Cut Style** | **width**
4. **Origin** | **height**
5. **Clarity** | **Estimated Weight in Ct**
6. **Colour** | **Price per ct**
7. **Stone Type** | **Price per ct USD**
8. **Cut Grade** | **Enhancement/Treatment**
9. **Country orgin** | (empty)
10. **Source File** (full width, spans 2 columns)

## Styling Details

### Input Fields
- **Background**: Light gray (`bg-slate-50`)
- **Border**: Subtle gray border (`border-slate-200`)
- **Padding**: `px-3.5 py-2.5`
- **Border radius**: `rounded-md` (medium)
- **Focus state**: White background, slightly darker border
- **Error state**: Red border and red background tint

### Labels
- **Font weight**: Normal (not bold)
- **Color**: Medium gray (`text-slate-600`)
- **Size**: Small (`text-sm`)
- **Spacing**: 2 units gap below label

### Container
- **Max width**: 6xl (1152px)
- **Padding**: 8 units
- **Background**: White with border
- **Border radius**: Large (`rounded-lg`)

### Typography
- **Title**: Extra large, semibold, dark gray
- **Labels**: Small, normal weight, medium gray
- **Input text**: Small, dark gray

## Removed Features
- ❌ Sectioned cards (Basic Information, Size & Dimensions, etc.)
- ❌ Right sidebar for status
- ❌ Visual grouping by categories
- ❌ Section headers

## Retained Features
- ✅ All form fields from original design
- ✅ Form validation
- ✅ Loading states
- ✅ Error messages
- ✅ Save/Cancel functionality
- ✅ Required field validation
- ✅ Responsive layout

## Technical Implementation

### Grid System
```html
<div class="grid grid-cols-2 gap-x-8 gap-y-6">
  <!-- All fields in two-column layout -->
</div>
```

### Field Pattern
```html
<div class="flex flex-col gap-2">
  <label class="text-sm font-normal text-slate-600">Label</label>
  <input class="w-full rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:bg-white focus:border-slate-300"/>
</div>
```

### Full-Width Field
```html
<div class="col-span-2 flex flex-col gap-2">
  <!-- Source File textarea -->
</div>
```

## Benefits of New Design

1. **Cleaner Visual Hierarchy**: Less visual noise, easier to scan
2. **Consistent Layout**: All fields have equal visual weight
3. **Better Space Utilization**: Two-column layout maximizes screen space
4. **Simpler Navigation**: No need to mentally group fields by section
5. **Faster Data Entry**: Fields are organized in a logical flow
6. **Modern Aesthetic**: Flat design with subtle shadows and borders

## Comparison with Reference Image

The implementation matches the reference image with:
- ✅ Two-column layout
- ✅ Light gray input backgrounds
- ✅ Consistent field heights
- ✅ Simple labels without bold styling
- ✅ Full-width textarea for Source File
- ✅ Clean, minimal design
- ✅ Proper field ordering and pairing

## Files Modified
- `src/pages/stone-dimension/stone-dimension-upsert/stone-dimension-upsert.html`

## Status
✅ **Complete** - All TypeScript diagnostics pass, design matches reference image
