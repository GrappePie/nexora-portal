export default function Dashboard() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <ul>
        <li>
          <a href="/dashboard/products">Productos</a>
        </li>
        <li>
          <a href="/dashboard/subscriptions">Suscripciones</a>
        </li>
        <li>
          <a href="/dashboard/installation">Instalación</a>
        </li>
        <li>
          <a href="/dashboard/devices">Dispositivos</a>
        </li>
        <li>
          <a href="/dashboard/users">Usuarios</a>
        </li>
        <li>
          <a href="/dashboard/support">Soporte</a>
        </li>
      </ul>
    </main>
  )
}
