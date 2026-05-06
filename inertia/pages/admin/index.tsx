import { useForm, usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'
import Modal from '~/components/Modal'
import type { Data } from '@generated/data'

interface Tenant {
  id: number
  name: string
  slug: string
  createdAt: string
}

interface NewTenant {
  email: string
  password: string
  name: string
}

export default function AdminIndex({ tenants, newTenant: initialNewTenant }: { tenants: Tenant[], newTenant?: NewTenant | string | null }) {
  const [newTenant, setNewTenant] = useState<NewTenant | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (initialNewTenant) {
      try {
        const data = typeof initialNewTenant === 'string' ? JSON.parse(initialNewTenant) : initialNewTenant
        setNewTenant(data)
      } catch (e) {
        console.error('[ADMIN] Failed to parse newTenant', e)
      }
    }
  }, [initialNewTenant])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const { props } = usePage<Data.SharedProps>()
  const logoutForm = useForm({})

  const createForm = useForm({
    name: '',
    slug: '',
    email: '',
  })

  const deleteForm = useForm({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createForm.post('/admin/tenants', {
      onSuccess: () => {
        createForm.reset()
      },
    })
  }

  return (
    <div className="db-layout">
      <header className="db-header">
        <h1>Admin</h1>
        <div className="db-header-right">
          {props.user && (
            <div className="db-user">
              <span className="db-user-name">{props.user.fullName ?? props.user.email}</span>
              <form onSubmit={(e) => { e.preventDefault(); logoutForm.post('/logout') }}>
                <button type="submit" className="db-logout">Déconnexion</button>
              </form>
            </div>
          )}
        </div>
      </header>

      <div style={{ padding: '40px', maxWidth: '100%', width: '100%', margin: '0 auto' }}>
        <div className="db-card" style={{ marginBottom: '32px' }}>
          <h2>Créer un tenant</h2>
          <form onSubmit={handleSubmit} className="db-form" style={{ marginTop: '16px' }}>
            <div className="db-field">
              <input
                type="text"
                value={createForm.data.name}
                onChange={(e) => createForm.setData('name', e.target.value)}
                placeholder="Hôtel Ibis"
              />
              {createForm.errors.name && <div className="db-error">{createForm.errors.name}</div>}
            </div>
            <div className="db-field">
              <input
                type="text"
                value={createForm.data.slug}
                onChange={(e) => createForm.setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="hotel-ibis"
              />
              {createForm.errors.slug && <div className="db-error">{createForm.errors.slug}</div>}
            </div>
            <div className="db-field">
              <input
                type="email"
                value={createForm.data.email}
                onChange={(e) => createForm.setData('email', e.target.value)}
                placeholder="contact@hotel-ibis.com"
              />
              {createForm.errors.email && <div className="db-error">{createForm.errors.email}</div>}
            </div>
            <button type="submit" disabled={createForm.processing} style={{ alignSelf: 'flex-start', width: 'auto', padding: '10px 24px' }}>
              {createForm.processing ? 'Création...' : 'Créer'}
            </button>
          </form>
        </div>

        <div className="db-card">
          <h2>Tenants ({tenants.length})</h2>
          {tenants.length === 0 ? (
            <p className="db-empty" style={{ marginTop: '16px' }}>Aucun tenant pour l'instant.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--gray-3)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 0', fontWeight: 600, fontSize: '14px' }}>Nom</th>
                  <th style={{ padding: '8px 0', fontWeight: 600, fontSize: '14px' }}>Slug</th>
                  <th style={{ padding: '8px 0', fontWeight: 600, fontSize: '14px' }}>Écran TV</th>
                  <th style={{ padding: '8px 0' }}></th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} style={{ borderBottom: '1px solid var(--gray-2)' }}>
                    <td style={{ padding: '12px 0', fontSize: '14px' }}>{tenant.name}</td>
                    <td style={{ padding: '12px 0', fontSize: '14px', color: 'var(--gray-6)', fontFamily: 'monospace' }}>{tenant.slug}</td>
                    <td style={{ padding: '12px 0', fontSize: '14px' }}>
                      <a href={`/${tenant.slug}`} target="_blank" className="db-link" style={{ color: 'var(--gray-7)' }}>
                        /{tenant.slug} ↗
                      </a>
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'right' }}>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (confirm(`Supprimer "${tenant.name}" ?`)) {
                            deleteForm.delete(`/admin/tenants/${tenant.id}`)
                          }
                        }}
                      >
                        <button
                          type="submit"
                          style={{ width: 'auto', padding: '4px 12px', fontSize: '13px', background: 'transparent', color: '#fb2c36', border: '1px solid #fb2c36', cursor: 'pointer' }}
                        >
                          Supprimer
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={!!newTenant}
        onClose={() => {
          setNewTenant(null)
          setShowPassword(false)
        }}
        title={`Tenant créé : ${newTenant?.name}`}
      >
        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
          <p>Partagez ces identifiants avec le tenant :</p>
          <div style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
            <div style={{ marginBottom: '12px' }}>
              <strong>Email</strong>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'monospace' }}>{newTenant?.email}</div>
                <div>
                  <button
                    onClick={() => copyToClipboard(newTenant?.email || '')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px' }}
                    title="Copier"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>

            <div>
              <strong>Mot de passe</strong>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '4px',
                  cursor: 'pointer',
                  justifyContent: 'space-between',
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <div style={{ fontFamily: 'monospace' }}>
                  {showPassword ? newTenant?.password : '••••••••••••••••'}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--gray-6)' }}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(newTenant?.password || '')
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px' }}
                    title="Copier"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--gray-6)', fontSize: '12px', marginBottom: 0 }}>
            Les identifiants peuvent être utilisés pour se connecter à /auth/login
          </p>
        </div>
      </Modal>
    </div>
  )
}
