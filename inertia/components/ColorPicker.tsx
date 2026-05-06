import { Sketch } from '@uiw/react-color'
import { useState, useRef, useEffect } from 'react'

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  label?: string
}

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  // Internal state tracks current hex value; syncs with parent via onChange callback
  const [hex, setHex] = useState(value ?? '#ffffff')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Updates internal hex when parent prop changes; allows controlled component behavior
  useEffect(() => {
    if (value !== undefined) setHex(value)
  }, [value])

  // Implements click-outside and escape-key handlers to close the color picker popover
  useEffect(() => {
    // Click outside the color picker closes it (standard UI pattern for popovers)
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    // Escape key provides keyboard accessibility to close the picker
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      // Only attach listeners when picker is open to avoid unnecessary event handling
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleKey)
    }
    // Cleanup prevents memory leaks from accumulating listeners across renders
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  // Updates both internal state and parent component when user selects a color
  function handleChange(color: { hex: string }) {
    setHex(color.hex)
    onChange?.(color.hex)
  }

  return (
    <div className="color-picker-field" ref={containerRef}>
      {label && <label className="color-picker-label">{label}</label>}
      <button
        type="button"
        className="color-picker-trigger"
        onClick={() => setOpen((o) => !o)}
        // Aria-label improves accessibility by announcing the currently selected color
        aria-label={`Couleur sélectionnée : ${hex}`}
      >
        {/* Visual swatch shows current color; hex value displays as text for accessibility */}
        <span className="color-picker-swatch" style={{ background: hex }} />
        <span className="color-picker-value">{hex}</span>
      </button>
      {/* Only renders picker UI when open to reduce DOM nodes and improve performance */}
      {open && (
        <div className="color-picker-popover">
          <Sketch color={hex} onChange={handleChange} />
        </div>
      )}
    </div>
  )
}
