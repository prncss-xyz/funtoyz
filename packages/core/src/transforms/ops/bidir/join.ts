import { Optic } from '../../compose'
import { source } from '../../compose/_composeEmit'
import { Flags } from '../../compose/_flags'
import { Emit, getModifier } from '../../compose/_methods'
import { Once, once as onceSource } from '../../sources/sync/once'

export function join<U, V, S, E1, G1, F1 extends Flags>(
	r: (u: U) => (u: Once<S>) => Optic<V, S, E1, G1, F1>,
) {
	return function <E2, G2, F2 extends Flags>(
		o: Optic<U, S, E2, G2, F2>,
	): Optic<V, S, E1 | E2, G1 | G2, F1 & F2> {
		const src = onceSource<S>()
		const dep = (u: U) => r(u)(src)

		const emitSrc: Emit<S, S, never> = (s, n, _e, c) => ({
			abort() {},
			start() {
				n(s)
				c()
			},
		})

		function getDep(
			d: Optic<V, S, E1, G1, F1>,
			s: S,
			next: (v: V) => void,
			error: (e: E1 | G1) => void,
		) {
			if (d.getter) return d.getter(s, next, error)
			if (d.emitter) {
				let found = false
				const emit = d.emitter(emitSrc)
				const { abort, start } = emit(
					s,
					(t) => {
						if (!found) {
							found = true
							abort()
							next(t)
						}
					},
					() => {},
					() => {
						if (!found && d.nothing) error(d.nothing())
					},
				)
				start()
			}
		}

		const result: Optic<V, S, E1 | E2, G1 | G2, F1 & F2> = {
			flags: o.flags as F1 & F2,
			nothing: o.nothing as (() => G1 | G2) | undefined,
		}

		if (o.getter) {
			result.getter = (s, next, error) =>
				o.getter!(s, (u) => getDep(dep(u), s, next, error), error)

			result.emitter = source((s, next, _error, complete) => {
				let abortDep: (() => void) | undefined
				return {
					abort() {
						abortDep?.()
					},
					start() {
						o.getter!(
							s,
							(u) => {
								const d = dep(u)
								if (d.emitter) {
									const emit = d.emitter(emitSrc)
									const res = emit(s, next, () => {}, complete)
									abortDep = res.abort
									res.start()
								} else if (d.getter) {
									d.getter(
										s,
										(v) => {
											next(v)
											complete()
										},
										() => complete(),
									)
								} else {
									complete()
								}
							},
							() => complete(),
						)
					},
				}
			}) as any

			result.setter = (v, next, s) =>
				o.getter!(
					s,
					(u) => {
						const d = dep(u)
						if (d.setter) d.setter(v, next, s)
						else next(s)
					},
					() => next(s),
				)

			result.modifier = (m, next, s) =>
				o.getter!(
					s,
					(u) => {
						const mod = getModifier(dep(u))
						if (mod) mod(m, next, s)
						else next(s)
					},
					() => next(s),
				)

			result.remover = (s, next) =>
				o.getter!(
					s,
					(u) => {
						const d = dep(u)
						if (d.remover) d.remover(s, next)
						else next(s)
					},
					() => next(s),
				)
		}

		return result
	}
}
