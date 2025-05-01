// src/Painel.tsx
import { useAuth } from './AuthContext'

export default function Painel() {
  const { logout } = useAuth()

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to PedagoPlay! 🎓</h1>
      <button onClick={logout}>Sair</button>
    </div>
  )
}
