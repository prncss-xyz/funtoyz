import { Optic } from '../../compose'
import { Flags } from '../../compose/_flags'

export function flatten() {
	return function <T, S, E1, G1, E2, G2, F extends Flags>(
		o: Optic<Optic<T, S, E1, G1, any>, S, E2, G2, F>,
	): Optic<
		T,
		S,
		E1 | E2,
		G1 | G2,
		(F['SYNC'] extends false ? { SYNC: false } : object) & {
			CONSTRUCT: false
			UNIQUE: false
			WRITE: false
		}
	> {
		return {
			emit: o.emit
				? (s, n, e, c) => {
						let done = false
						const aborts = new Set<() => void>()
						const { abort, start } = o.emit!(
							s,
							(inner) => {
								const res = inner.emit!(s, n, e, () => {
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
				: undefined,
			flags: {
				CONSTRUCT: false,
				SYNC: o.flags.SYNC,
				UNIQUE: false,
				WRITE: false,
			} as never,
			nothing: o.nothing,
		}
	}
}
