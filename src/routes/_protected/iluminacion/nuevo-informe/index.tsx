import BackChevron from '#/components/back-chevron'
import Loading from '#/components/loading'
import Title from '#/components/title'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/_protected/iluminacion/nuevo-informe/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <article className="w-full min-h-svh flex flex-col items-center gap-20 relative">
      <BackChevron />
      <Title text="Nuevo Informe" className="mt-15" />
      <IluminacionData />
    </article>
  )
}

function IluminacionData() {
	return (
		<Suspense fallback={<Loading className="scale-50 justify-start  max-h-[50svh] " />}>
			<Data />
		</Suspense>
	)
}

function Data() {

	return (
    <span className='text-xl font-bold text-center my-10 w-5/6 mx-auto'>Proximamente podras crear nuevos informes de iluminacion</span>
  )
}
