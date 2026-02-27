import { Optic } from '.'
import { forbidden } from '../../assertions'
import { fromInit } from '../../functions/arguments/init'
import { id, noop } from '../../functions/basics'
import { Reducer } from '../../reduce'
import { Flags } from './flags'

export function trush<V>(v: V, cb: (v: V) => void) {
	return cb(v)
}

export type Getter<T, S, E> = (
	s: S,
	next: (t: T) => void,
	error: (e: E) => void,
) => void

export type Reviewer<T, S> = (t: T, next: (s: S) => void) => void

export type Modifier<T, S> = (
	m: (t: T, next: (t: T) => void) => void,
	next: (s: S) => void,
	s: S,
) => void

export type Setter<T, S> = (t: T, next: (s: S) => void, s: S) => void

export type Remover<S> = (s: S, next: (s: S) => void) => void

export type Emitter<T, S, E> = (
	s: S,
	next: (t: T) => void,
	error: (e: E) => void,
	complete: () => void,
) => {
	abort: () => void
	start: () => void
}

export function first<T, S, E extends G, G>(o: {
	emitter?: Emitter<T, S, E>
	getter?: Getter<T, S, G>
	nothing?: () => G
}): Getter<T, S, G> {
	if (o.getter) return o.getter
	if (o.emitter)
		return (s, next, error) => {
			let done = false
			const { abort, start } = o.emitter!(
				s,
				(t) => {
					if (!done) {
						done = true
						abort()
						next(t)
					}
				},
				(e) => {
					if (!done) {
						done = true
						abort()
						error(e)
					}
				},
				() => {
					if (!done) {
						done = true
						abort()
						error(o.nothing!())
					}
				},
			)
			start()
		}
	forbidden('first needs an emitter or a getter')
}

export function getModifier<T, S, E, G, F extends Flags>(
	o: Optic<T, S, E, G, F>,
): Modifier<T, S> | undefined {
	if (o.modifier) return o.modifier
	if (o.getter) {
		if (o.reviewer)
			return (m, next, s) =>
				o.getter!(
					s,
					(t) => m(t, (t) => o.reviewer!(t, next)),
					() => next(s),
				)
		if (o.setter)
			return (m, next, s) =>
				o.getter!(
					s,
					(t) => m(t, (t) => o.setter!(t, next, s)),
					() => next(s),
				)
	}
	return undefined
}

export function reduce<T, S, U, E, G, R>(
	reducer: Reducer<T, U, R>,
	o: {
		emitter?: Emitter<T, S, E>
		getter?: Getter<T, S, G>
	},
): Getter<R, S, never> {
	const result = reducer.result ?? (id as never)
	const reduce = reducer.reduceDest ?? ((reducer as any).reduce as never)

	if (o.emitter)
		return (s, next) => {
			let done = false
			let acc = fromInit(reducer.init)
			let res: ReturnType<Emitter<T, S, E>> | undefined
			const abort = () => res?.abort()
			res = o.emitter!(
				s,
				(t) => {
					if (!done) {
						acc = reduce(t, acc)
					}
				},
				noop,
				() => {
					if (!done) {
						done = true
						abort()
						next(result(acc))
					}
				},
			)
			res.start()
		}
	if (o.getter)
		return (s, next) => {
			let acc = fromInit(reducer.init)
			o.getter!(
				s,
				(t) => next(result(reduce(t, acc))),
				() => next(result(acc)),
			)
		}
	return forbidden('reduce needs an emitter or a getter')
}
