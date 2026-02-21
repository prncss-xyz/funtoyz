import { Emit, Getter } from './_methods'

export function flatEmit_<V, S, U, E1, E2>(
	outer: Emit<V, S, E1>,
	inner: (
		v: V,
		s: S,
		n: (u: U) => void,
		e: (err: E1 | E2) => void,
		c: () => void,
	) => { abort: () => void; start: () => void },
): Emit<U, S, E1 | E2> {
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

export function composeEmitEmit_<T, S, U, E1, E2>(
	emit1: Emit<T, S, E1>,
	emit2: Emit<U, T, E2>,
): Emit<U, S, E1 | E2> {
	return flatEmit_(emit1, (t, _s, n, e, c) => emit2(t, n, e, c))
}

export function composeGetterEmit_<T, S, U, E1, E2>(
	emit1: Emit<U, T, E1>,
	getter2: Getter<T, S, E2>,
): Emit<U, S, E1 | E2> {
	const res: Emit<U, S, E1 | E2> = (s, n, e, c) => {
		let sub: ReturnType<Emit<U, S, E1 | E2>> | undefined
		let aborted = false
		let started = false
		getter2(
			s,
			(t) => {
				if (aborted) return
				sub = emit1(t, n, e, c)
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
