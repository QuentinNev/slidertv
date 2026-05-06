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
