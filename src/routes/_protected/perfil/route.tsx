import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/perfil')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/perfil"!</div>
}
