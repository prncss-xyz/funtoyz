import { fromInit, Init } from '../../functions/arguments'
import { nothing, Nothing } from '../../tags/results'

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

export function first<T, S, E>(emit: Emit<T, S, E>): Getter<T, S, E | Nothing> {
	return (s, next, error) => {
		let done = false
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
					error(nothing())
				}
			},
		)
		start()
	}
}

export function reduce<T, S, U, E, R>(
	reducer: Reducer<T, U, R>,
	o: { emit: Emit<T, S, E> },
): Getter<R, S, E> {
	return (s, next, error) => {
		let done = false
		let acc = fromInit(reducer.init)
		const res = o.emit(
			s,
			(t) => {
				if (!done) {
					acc = reducer.reduce(t, acc)
				}
			},
			(e) => {
				if (!done) {
					done = true
					res.abort()
					error(e)
				}
			},
			() => {
				if (!done) {
					done = true
					res.abort()
					next(reducer.result ? reducer.result(acc) : (acc as never))
				}
			},
		)
		res.start()
	}
}

export interface Reducer<T, S, R = S> {
	init: Init<S>
	reduce: (event: T, state: S) => S
	result?: (state: S) => R
}

// TODO: destructive option
export function toArray<T>(): Reducer<T, T[]> {
	return {
		init: () => [],
		reduce: (event, state) => [...state, event],
	}
}
