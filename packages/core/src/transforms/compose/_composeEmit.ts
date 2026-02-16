import { Emit } from './_methods'

export function composeEmit<T, S, U, E1, E2>(
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
