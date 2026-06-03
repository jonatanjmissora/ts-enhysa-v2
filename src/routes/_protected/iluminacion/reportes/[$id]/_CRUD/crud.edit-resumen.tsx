import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/iluminacion/reportes/$id/_CRUD/crud/edit-resumen',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_protected/iluminacion/reportes/$id/crud-edit-general"!</div>
  )
}
