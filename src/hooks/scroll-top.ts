import { useEffect } from "react"

export default function useScrollTop() {
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.scrollTo(0, 0)
		}
	}, [])

	return null
}
