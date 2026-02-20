import { Emit, Getter } from './_methods'

export function composeEmitEmit_<T, S, U, E1, E2>(
	emit1: Emit<T, S, E1>,
	emit2: Emit<U, T, E2>,
): Emit<U, S, E1 | E2> {
	return (s, n, e, c) => {
		let done = false
		const unmounts = new Set<() => void>()
		const { abort: abort1, start: start1 } = emit1(
			s,
			(t) => {
				const res = emit2(t, n, e, () => {
					unmounts.delete(res.abort)
					if (unmounts.size === 0 && done) c()
				})
				unmounts.add(res.abort)
				res.start()
			},
			e,
			() => {
				done = true
				if (unmounts.size == 0) c()
			},
		)
		return {
			abort() {
				unmounts.forEach((cb) => cb())
				abort1()
			},
			start: start1,
		}
	}
}

export function composeGetterEmit_<T, S, U, E1, E2>(
	emit1: Emit<U, T, E1>,
	getter2: Getter<T, S, E2>,
): Emit<U, S, E1 | E2> {
	const res: Emit<U, S, E1 | E2> = (s, n, e, c) => {
		// TODO: make it work with async getters
		let sub!: ReturnType<Emit<U, S, E1 | E2>>
		getter2(s, (t) => (sub = emit1(t, n, e, c)), e)
		return sub
	}
	return res
}
