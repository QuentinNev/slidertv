import { Sketch } from '@uiw/react-color'
import { useState, useRef, useEffect } from 'react'

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  label?: string
}

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [hex, setHex] = useState(value ?? '#ffffff')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value !== undefined) setHex(value)
  }, [value])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleKey)
    }
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

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
        aria-label={`Couleur sélectionnée : ${hex}`}
      >
        <span className="color-picker-swatch" style={{ background: hex }} />
        <span className="color-picker-value">{hex}</span>
      </button>
      {open && (
        <div className="color-picker-popover">
          <Sketch color={hex} onChange={handleChange} />
        </div>
      )}
    </div>
  )
}
