import { Optic } from '../../../compose'
import { source } from '../../../compose/_composeEmit'
import { Flags } from '../../../compose/_flags'
import { Emit, getModifier } from '../../../compose/_methods'
import { Once, once as onceSource } from '../../../sources/sync/once'

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

		function getFirst(
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

		function emitAll(
			d: Optic<V, S, E1, G1, F1>,
			s: S,
			next: (v: V) => void,
			complete: () => void,
		) {
			if (d.emitter) {
				const emit = d.emitter(emitSrc)
				const res = emit(s, next, () => {}, complete)
				res.start()
				return res.abort
			}
			if (d.getter) {
				d.getter(s, (v) => { next(v); complete() }, () => complete())
			} else {
				complete()
			}
		}

		const result: Optic<V, S, E1 | E2, G1 | G2, F1 & F2> = {
			flags: o.flags as F1 & F2,
			nothing: o.nothing as (() => G1 | G2) | undefined,
		}

		// --- Getter (only if o has getter) ---
		if (o.getter) {
			result.getter = (s, next, error) =>
				o.getter!(s, (u) => getFirst(dep(u), s, next, error), error)
		}

		// --- Emitter ---
		if (o.emitter) {
			result.emitter = source((s: S, next, _error, complete) => {
				let outerDone = false
				const pending = new Set<() => void>()
				const outerEmit = o.emitter!(emitSrc)
				const checkComplete = () => {
					if (outerDone && pending.size === 0) complete()
				}
				const seen = new Set<U>()
				const { abort: outerAbort, start: outerStart } = outerEmit(
					s,
					(u) => {
						if (seen.has(u)) return
						seen.add(u)
						const d = dep(u)
						if (d.emitter) {
							const emit = d.emitter(emitSrc)
							const res = emit(s, next, () => {}, () => {
								pending.delete(res.abort)
								checkComplete()
							})
							pending.add(res.abort)
							res.start()
						} else if (d.getter) {
							d.getter(s, next, () => {})
						}
					},
					() => {},
					() => {
						outerDone = true
						checkComplete()
					},
				)
				return {
					abort() {
						pending.forEach((cb) => cb())
						outerAbort()
					},
					start: outerStart,
				}
			}) as any
		} else if (o.getter) {
			result.emitter = source((s: S, next, _error, complete) => {
				let abortDep: (() => void) | undefined
				return {
					abort() {
						abortDep?.()
					},
					start() {
						o.getter!(
							s,
							(u) => {
								abortDep = emitAll(dep(u), s, next, complete)
							},
							() => complete(),
						)
					},
				}
			}) as any
		}

		// --- Modifier ---
		if (o.getter) {
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
		} else if (o.emitter) {
			result.modifier = (m, next, s) => {
				const us: U[] = []
				const seen = new Set<U>()
				const emit = o.emitter!(emitSrc)
				const { start } = emit(
					s,
					(u) => { if (!seen.has(u)) { seen.add(u); us.push(u) } },
					() => {},
					() => {},
				)
				start()

				let cur = s
				function apply(i: number) {
					if (i >= us.length) return next(cur)
					const mod = getModifier(dep(us[i]!))
					if (mod) mod(m, (s2) => { cur = s2; apply(i + 1) }, cur)
					else apply(i + 1)
				}
				apply(0)
			}
		}

		// --- Setter ---
		if (o.getter) {
			result.setter = (v, next, s) =>
				o.getter!(
					s,
					(u) => {
						const d = dep(u)
						if (d.setter) d.setter(v, next, s)
						else {
							const mod = getModifier(d)
							if (mod) mod((_, n) => n(v), next, s)
							else next(s)
						}
					},
					() => next(s),
				)
		}

		// --- Remover ---
		if (o.getter) {
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
		} else if (o.emitter) {
			result.remover = (s, next) => {
				const us: U[] = []
				const seen = new Set<U>()
				const emit = o.emitter!(emitSrc)
				const { start } = emit(
					s,
					(u) => { if (!seen.has(u)) { seen.add(u); us.push(u) } },
					() => {},
					() => {},
				)
				start()

				let cur = s
				function apply(i: number) {
					if (i >= us.length) return next(cur)
					const d = dep(us[i]!)
					if (d.remover) d.remover(cur, (s2) => { cur = s2; apply(i + 1) })
					else apply(i + 1)
				}
				apply(0)
			}
		}

		return result
	}
}
