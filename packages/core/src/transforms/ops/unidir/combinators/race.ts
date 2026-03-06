import { noop } from '../../../../functions/basics'
import { nothing } from '../../../../tags/results'
import { compose, Focus, fromFocus } from '../../../compose'
import { Flags } from '../../../compose/flags'

export function race<V, S, E, G, F extends Flags>(
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
			let done = false
			let aborts: Set<() => void> | undefined = undefined
			let i = 0
			const next = (v: V) => !closed && n(v)
			// const err = (v: E) => !closed && e(v)
			const localClose = () =>
				done && i === 0 && (aborts === undefined || aborts!.size === 0) && c()
			return {
				abort() {
					closed = true
					done = true
					aborts?.forEach((cb) => cb())
					c()
				},
				start() {
					for (const o of os) {
						if (closed) return
						if (o.emitter) {
							const { abort, start } = o.emitter(s, next, noop, () => {
								aborts!.delete(abort)
								localClose()
							})
							aborts ??= new Set()
							aborts.add(abort)
							start()
						} else if (o.getter) {
							i++
							o.getter(
								s,
								(v) => {
									next(v)
									i--
									localClose()
								},
								() => {
									i--
									localClose()
								},
							)
						}
						done = true
					}
					localClose()
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
