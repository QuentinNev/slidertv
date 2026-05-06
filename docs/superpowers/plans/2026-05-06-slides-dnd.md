# Drag-and-Drop Slide Reordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to drag-and-drop slides in the dashboard sidebar to reorder them, with the order persisted automatically via Inertia after each drag.

**Architecture:** Add a `PATCH /slides/reorder` backend route + controller method, then replace the static slide list in `Layout.tsx` with a `SortableSlideList` component powered by `@dnd-kit/sortable`. On drag end, the component calls `router.patch` (Inertia) with the new order, which triggers a partial reload of the `slides` prop.

**Tech Stack:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, AdonisJS routes/validators, Inertia `router.patch`

---

### Task 1: Install dnd-kit

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install packages**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Expected output: packages added to `node_modules`, `package.json` updated.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @dnd-kit/core, sortable, utilities"
```

---

### Task 2: Add reorder validator

**Files:**
- Modify: `app/validators/slide.ts`

- [ ] **Step 1: Add `reorderSlidesValidator` to the validators file**

Open `app/validators/slide.ts` and append:

```ts
export const reorderSlidesValidator = vine.compile(
  vine.object({
    orders: vine.array(
      vine.object({
        id: vine.number().positive(),
        order: vine.number().min(0),
      })
    ),
  })
)
```

- [ ] **Step 2: Commit**

```bash
git add app/validators/slide.ts
git commit -m "feat: add reorderSlidesValidator"
```

---

### Task 3: Add reorder controller method

**Files:**
- Modify: `app/controllers/slide_controller.ts`

- [ ] **Step 1: Add `reorder` method to `SlideController`**

Open `app/controllers/slide_controller.ts`. Add the import at the top alongside the existing validator import:

```ts
import { updateSlideValidator, reorderSlidesValidator } from '#validators/slide'
```

Then add this method inside the class, after `updateSlide`:

```ts
async reorder({ request, response, auth }: HttpContext) {
  const { orders } = await request.validateUsing(reorderSlidesValidator)
  const tenantId = auth.user!.tenantId!

  await Promise.all(
    orders.map(({ id, order }) =>
      Slide.query()
        .where('id', id)
        .where('tenantId', tenantId)
        .update({ order })
    )
  )

  return response.ok({ success: true })
}
```

- [ ] **Step 2: Commit**

```bash
git add app/controllers/slide_controller.ts
git commit -m "feat: add SlideController.reorder method"
```

---

### Task 4: Register the reorder route

**Files:**
- Modify: `start/routes.ts`

- [ ] **Step 1: Add the PATCH route inside the auth group**

Open `start/routes.ts`. Inside the `middleware.auth()` group, after the `router.put('slide/:id', ...)` line, add:

```ts
router.patch('slides/reorder', [controllers.Slide, 'reorder']).as('slides.reorder')
```

- [ ] **Step 2: Commit**

```bash
git add start/routes.ts
git commit -m "feat: register PATCH /slides/reorder route"
```

---

### Task 5: Create SortableSlideList component

**Files:**
- Create: `inertia/components/dashboard/SortableSlideList.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { router } from '@inertiajs/react'
import type { Slide } from '~/types'

function SortableSlide({
  slide,
  isSelected,
  onSelect,
}: {
  slide: Slide
  isSelected: boolean
  onSelect: (slide: Slide) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: slide.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="db-slide-sortable-item">
      <button
        type="button"
        className="db-slide-drag-handle"
        {...attributes}
        {...listeners}
        tabIndex={-1}
        aria-label="Réordonner"
      >
        ⠿
      </button>
      <button
        type="button"
        className={`db-slide-item${isSelected ? ' active' : ''}`}
        onClick={() => onSelect(slide)}
      >
        {slide.title || 'Sans titre'}
      </button>
    </div>
  )
}

export default function SortableSlideList({
  slides,
  selectedSlideId,
  onSlideSelect,
}: {
  slides: Slide[]
  selectedSlideId?: number
  onSlideSelect?: (slide: Slide) => void
}) {
  const [items, setItems] = useState(slides)

  useEffect(() => {
    setItems(slides)
  }, [slides])

  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((s) => s.id === active.id)
    const newIndex = items.findIndex((s) => s.id === over.id)
    const reordered = arrayMove(items, oldIndex, newIndex)

    setItems(reordered)

    router.patch(
      '/slides/reorder',
      { orders: reordered.map((s, i) => ({ id: s.id, order: i })) },
      { only: ['slides'], preserveState: true }
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        {items.map((slide) => (
          <SortableSlide
            key={slide.id}
            slide={slide}
            isSelected={selectedSlideId === slide.id}
            onSelect={(s) => onSlideSelect?.(s)}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add inertia/components/dashboard/SortableSlideList.tsx
git commit -m "feat: add SortableSlideList component with dnd-kit"
```

---

### Task 6: Add drag handle styles

**Files:**
- Modify: `inertia/css/app.css`

- [ ] **Step 1: Add styles for the drag handle and sortable item wrapper**

Append to the end of `inertia/css/app.css` (before any existing `@keyframes` at the end, or at the very bottom):

```css
/* ── Sortable slides ───────────────────────────────────── */
.db-slide-sortable-item {
  display: flex;
  align-items: center;
}

.db-slide-drag-handle {
  flex-shrink: 0;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--gray-6);
  cursor: grab;
  background: none;
  border: none;
  padding: 0;
  line-height: 1;
}

.db-slide-drag-handle:active {
  cursor: grabbing;
}

.db-slide-sortable-item .db-slide-item {
  flex: 1;
}
```

- [ ] **Step 2: Commit**

```bash
git add inertia/css/app.css
git commit -m "feat: add drag handle styles for sortable slides"
```

---

### Task 7: Wire SortableSlideList into Layout

**Files:**
- Modify: `inertia/components/dashboard/Layout.tsx`

- [ ] **Step 1: Replace the static slide list with SortableSlideList**

At the top of `Layout.tsx`, add the import:

```ts
import SortableSlideList from './SortableSlideList'
```

Then replace these lines (currently ~117-126):

```tsx
{slides.map((slide) => (
  <button
    key={slide.id}
    type="button"
    className={`db-slide-item${selectedSlideId === slide.id ? ' active' : ''}`}
    onClick={() => onSlideSelect?.(slide)}
  >
    {slide.title || 'Sans titre'}
  </button>
))}
```

With:

```tsx
<SortableSlideList
  slides={slides}
  selectedSlideId={selectedSlideId}
  onSlideSelect={onSlideSelect}
/>
```

- [ ] **Step 2: Commit**

```bash
git add inertia/components/dashboard/Layout.tsx
git commit -m "feat: integrate SortableSlideList into dashboard Layout"
```

---

### Task 8: Manual smoke test

- [ ] **Step 1: Rebuild and open the dashboard**

Rebuild the Docker container (or restart the dev server) and open `/dashboard`.

- [ ] **Step 2: Verify drag-and-drop works**

1. Open the Slides submenu
2. Drag a slide to a new position — it should move visually
3. Release — the list should stay in the new order
4. Reload the page — the new order should persist

- [ ] **Step 3: Verify tenant isolation**

The `PATCH /slides/reorder` controller filters by `tenantId`, so only the authenticated user's slides are updated. Confirm no 500 errors in the server logs.
