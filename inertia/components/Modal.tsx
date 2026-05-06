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
  if (!isOpen) return null

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '32px',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
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
