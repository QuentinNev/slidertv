# Drag-and-Drop Slide Reordering

**Date:** 2026-05-06

## Overview

Allow users to reorder slides in the dashboard sidebar by dragging and dropping. Order is persisted automatically after each drag via a PATCH API call.

## Frontend

**Library:** `@dnd-kit/core` + `@dnd-kit/sortable`

**Component:** Extract the slide list in `Layout.tsx` (lines 117-126) into a `SortableSlideList` component using `DndContext` and `SortableContext` from dnd-kit.

Each slide item becomes a sortable item with:
- A drag handle icon (⠿) on the left
- Cursor `grab` / `grabbing`
- Reduced opacity on the item being dragged (`isDragging`)

On `onDragEnd`:
1. Recompute the local order optimistically (array reindex)
2. Call `router.patch('/slides/reorder', { orders: [{id, order}, ...] }, { only: ['slides'] })` via Inertia partial reload
3. The Inertia reload refreshes the `slides` prop from the server

`SortableSlideList` keeps a local `items` state (copy of the `slides` prop) for dnd-kit's sortable context. It syncs from the prop on mount and after each successful reload.

## Backend

**Route:** `PATCH /slides/reorder`

**Controller method:** `SlideController.reorder`

**Payload:** `{ orders: [{ id: number, order: number }] }`

**Logic:**
1. Validate payload (array of `{id, order}` pairs)
2. For each entry, update the slide's `order` only if it belongs to the current tenant (tenant isolation via `WHERE tenantId = ?`)
3. Return 200 (Inertia handles the redirect/reload)

**Validator:** New `reorderSlidesValidator` in `validators/slide.ts`.

## Data flow

```
User drops slide
  → onDragEnd computes new order array
  → router.patch('/slides/reorder', { orders })
  → SlideController.reorder bulk-updates DB
  → Inertia reloads slides prop
  → Layout re-renders with new order
```

## Scope

- No animation beyond dnd-kit defaults
- No undo/redo
- No reordering on the TV display side (already sorted by `order` from the DB query)
