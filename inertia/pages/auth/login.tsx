import { Form } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'

export default function Login() {
  const { props } = usePage<Data.SharedProps>()

  return (
    <div className="form-container">
      <div>
        <h1>Connexion</h1>
      </div>

      <div>
        <Form action="/login" method="POST">
          {() => (
            <>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div>
                <button type="submit" className="button">
                  Connexion
                </button>
              </div>
            </>
          )}
        </Form>

        {props.flash?.error && (
          <div style={{ color: '#fb2c36', fontSize: '14px', marginTop: '16px' }}>
            {props.flash.error}
          </div>
        )}
      </div>
    </div>
  )
}
