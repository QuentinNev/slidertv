import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  closeButtonText?: string
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeButtonText = 'Fermer',
}: ModalProps) {
  // Don't render anything if modal is closed; prevents DOM nodes and event listeners from persisting
  if (!isOpen) return null

  return (
    // Fixed-position backdrop covers entire viewport; allows clicking to close the modal
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      // Backdrop click closes the modal (standard UI pattern)
      onClick={onClose}
    >
      {/* Modal content box; stopPropagation prevents backdrop click handler from firing */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        // Stops the click event from bubbling to the backdrop, preventing unwanted modal closure
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px', fontWeight: 600 }}>
          {title}
        </h2>

        <div style={{ marginBottom: '24px' }}>{children}</div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'var(--accent-color, #007bff)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {closeButtonText}
        </button>
      </div>
    </div>
  )
}
