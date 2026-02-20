import { sourceAsync } from '.'

export const periodic = (t: number) =>
	sourceAsync<number, void, never>((_s, next) => {
		let id: number
		return {
			abort: () => clearInterval(id),
			start: () => {
				id = setInterval(() => next(Date.now()), t)
			},
		}
	})
