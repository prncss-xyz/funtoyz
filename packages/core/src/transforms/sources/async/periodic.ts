import { sourceAsync } from '..'

export const periodic = sourceAsync<number, number, never>((s, next) => {
	let id: number
	return {
		abort: () => clearInterval(id),
		start: () => {
			id = setTimeout(() => next(Date.now()), s)
		},
	}
})
