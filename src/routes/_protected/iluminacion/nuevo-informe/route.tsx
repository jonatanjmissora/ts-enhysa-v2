import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/iluminacion/nuevo-informe')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
