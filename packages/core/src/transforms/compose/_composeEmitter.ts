import { Emitter, Getter } from './_methods'

export function flatEmitter_<V, S, U, E1, E2>(
	outer: Emitter<V, S, E1>,
	inner: (
		v: V,
		s: S,
		n: (u: U) => void,
		e: (err: E1 | E2) => void,
		c: () => void,
	) => { abort: () => void; start: () => void },
): Emitter<U, S, E1 | E2> {
	return (s, n, e, c) => {
		let done = false
		const aborts = new Set<() => void>()
		const { abort, start } = outer(
			s,
			(v) => {
				const res = inner(v, s, n, e, () => {
					aborts.delete(res.abort)
					if (aborts.size === 0 && done) c()
				})
				aborts.add(res.abort)
				res.start()
			},
			e,
			() => {
				done = true
				if (aborts.size === 0) c()
			},
		)
		return {
			abort() {
				aborts.forEach((cb) => cb())
				abort()
			},
			start,
		}
	}
}

export function composeEmitterEmitter_<T, S, U, E1, E2>(
	emitter1: Emitter<T, S, E1>,
	emitter2: Emitter<U, T, E2>,
): Emitter<U, S, E1 | E2> {
	return flatEmitter_(emitter1, (t, _s, n, e, c) => emitter2(t, n, e, c))
}

export function composeGetterEmitter_<T, S, U, E1, E2>(
	emitter1: Emitter<U, T, E1>,
	getter2: Getter<T, S, E2>,
): Emitter<U, S, E1 | E2> {
	const res: Emitter<U, S, E1 | E2> = (s, n, e, c) => {
		let sub: ReturnType<Emitter<U, S, E1 | E2>> | undefined
		let aborted = false
		let started = false
		getter2(
			s,
			(t) => {
				if (aborted) return
				sub = emitter1(t, n, e, c)
				if (started) sub.start()
			},
			e,
		)
		return {
			abort() {
				if (sub) sub.abort()
				else aborted = true
			},
			start() {
				if (sub) sub.start()
				else started = true
			},
		}
	}
	return res
}
