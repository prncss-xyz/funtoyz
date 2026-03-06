import { nothing } from '../../../../tags/results'
import { compose, Focus, fromFocus } from '../../../compose'
import { Flags } from '../../../compose/flags'

// TODO: optimize for sync
// TODO: type overloads

export function seq<V, S, E, G, F extends Flags>(
	...fs: Focus<V, S, E, G, F>[]
) {
	const os = fs.map(fromFocus)
	return compose<
		S,
		V,
		E,
		G,
		(F['SYNC'] extends false ? { SYNC: false } : {}) & {
			CONSTRUCT: false
			UNIQUE: false
			WRITE: false
		}
	>({
		emitter(s, n, _e, c) {
			let closed = false
			let abort: (() => void) | undefined = undefined
			const next = (v: V) => !closed && n(v)
			return {
				abort() {
					closed = true
					abort!()
					c()
				},
				start() {
					let i = 0
					function step() {
						if (closed) return
						let o = os[i++]
						if (o === undefined) return c()
						if (o.emitter) {
							const res = o.emitter(s, next, step, c)
							abort = res.abort
							res.start()
						} else if (o.getter) {
							abort = undefined
							o.getter(
								s,
								(v) => {
									next(v)
									step()
								},
								step,
							)
						}
					}
					step()
				},
			}
		},
		flags: {
			CONSTRUCT: false,
			SYNC: os[0]?.flags.SYNC as never,
			UNIQUE: false,
			WRITE: false,
		},
		nothing: nothing as never,
	})
}
