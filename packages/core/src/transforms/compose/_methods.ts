import { IOptic } from '.'
import { forbidden } from '../../assertions'
import { fromInit, Init } from '../../functions/arguments'
import { noop } from '../../functions/basics'
import { Flags } from './_flags'

export function trush<V>(v: V, cb: (v: V) => void) {
	return cb(v)
}

export type Getter<T, S, E> = (
	s: S,
	next: (t: T) => void,
	error: (e: E) => void,
) => void

export type Reviewer<T, S> = (t: T, next: (s: S) => void, s: S | void) => void

export type Modifier<T, S> = (
	m: (t: T, next: (t: T) => void) => void,
	next: (s: S) => void,
	s: S,
) => void

export function apply<V>(
	m: (v: V, next: (v: V) => void) => void,
	next: (v: V) => void,
	v: V,
) {
	return m(v, next)
}

export type Setter<T, S> = (t: T, next: (s: S) => void, s: S) => void

export type Remover<S> = (s: S, next: (s: S) => void) => void

export type Emit<T, S, E> = (
	s: S,
	next: (t: T) => void,
	error: (e: E) => void,
	complete: () => void,
) => {
	abort: () => void
	start: () => void
}

export type Emitter<U, T, E> = <S, E1>(e1: Emit<T, S, E1>) => Emit<U, S, E | E1>

function emitOne<S>(
	s: S,
	next: (s: S) => void,
	_error: (e: never) => void,
	complete: () => void,
) {
	return {
		abort: noop,
		start: () => {
			next(s)
			complete()
		},
	}
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
			const emit = o.emitter!(emitOne<S>)
			const { abort, start } = emit(
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
	forbidden()
}

export function getModifier<T, S, E, G, F extends Flags>(
	o: IOptic<T, S, E, G, F>,
): Modifier<T, S> | undefined {
	if (o.modifier) return o.modifier
	if (o.getter) {
		if (o.reviewer)
			return (m, next, s) =>
				o.getter!(s, (t) => m(t, (t) => o.reviewer!(t, next)), noop)
		if (o.setter)
			return (m, next, s) =>
				o.getter!(s, (t) => m(t, (t) => o.setter!(t, next, s)), noop)
	}
	return undefined
}

export function neverNothing(): never {
	throw new Error('Should always emit at least one value')
}

// TODO: share code with fold and scan
export function reduce<T, S, U, E, R>(
	reducer: Reducer<T, U, R>,
	o: { emitter?: Emitter<T, S, E> },
): Getter<R, S, E> {
	if (o.emitter)
		return (s, next, error) => {
			let done = false
			let acc = fromInit(reducer.init)
			const reduce =
				'reduceDest' in reducer ? reducer.reduceDest : reducer.reduce
			let res: ReturnType<Emit<T, S, E>> | undefined
			const emit = o.emitter!(emitOne<S>)
			const abort = () => res?.abort()
			res = emit(
				s,
				(t) => {
					if (!done) {
						acc = reduce(t, acc)
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
						next(reducer.result ? reducer.result(acc) : (acc as never))
					}
				},
			)
			res.start()
		}
	return forbidden()
}

export interface ReducerDest<Event, State, Result = State> {
	init: Init<State>
	reduce?: (event: Event, state: State) => State
	reduceDest: (event: Event, state: State) => State
	result?: (state: State) => Result
}

export interface ReducerNonDest<Event, State, Result = State> {
	init: Init<State>
	reduce: (event: Event, state: State) => State
	reduceDest?: (event: Event, state: State) => State
	result?: (state: State) => Result
}

export type Reducer<Event, State, Result = State> = {
	init: Init<State>
	result?: (state: State) => Result
} & (
	| {
			reduce: (event: Event, state: State) => State
	  }
	| {
			reduceDest: (event: Event, state: State) => State
	  }
)

export function toArray<T>(): Reducer<T, T[]> {
	return {
		init: () => [],
		reduce: (event, state) => [...state, event],
		reduceDest: (event, state) => {
			state.push(event)
			return state
		},
	}
}
