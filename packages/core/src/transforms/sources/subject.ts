import { Emitter } from '../compose/_methods'

// TODO: encapsulate

// hot observable
export function subject<T, S, E>(
	emitter: Emitter<T, S, E>,
): (s: S) => Emitter<T, void, E> {
	let id = 0
	let count = 0
	const subs = new Map<
		number,
		{
			complete: () => void
			error: (e: E) => void
			next: (t: T) => void
		}
	>()
	return (s) => {
		const { abort, start } = emitter(
			s,
			(t) => subs.forEach(({ next }) => next(t)),
			(e) => subs.forEach(({ error }) => error(e)),
			() => subs.forEach(({ complete }) => complete()),
		)
		return (_s, next, error, complete) => {
			const _id = id++
			return {
				abort: () => {
					subs.delete(_id)
					if (count === 1) Promise.resolve().then(() => count === 0 && abort())
					count--
				},
				start: () => {
					subs.set(_id, { complete, error, next })
					count++
					if (count === 1) start()
				},
			}
		}
	}
}
