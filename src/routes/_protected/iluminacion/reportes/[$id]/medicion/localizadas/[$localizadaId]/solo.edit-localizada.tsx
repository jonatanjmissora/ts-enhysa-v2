import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/iluminacion/reportes/$id/medicion/localizadas/$localizadaId/solo/edit-localizada',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello
      "/_protected/iluminacion/reportes/$id/medicion/localizadas/$localizadaId/solo/edit/localizada"!
    </div>
  )
}
