import { Source } from './core'

export type Getter<T, S, E> = (
	s: S,
	next: (t: T) => void,
	error: (e: E) => void,
) => void

export type Emitter<T, S, E> = <E2>(source: Source<S, E2>) => Source<T, E | E2>

export type Reviewer<T, S> = (t: T, next: (s: S) => void, s: S | void) => void

export type Modifier<T, S> = (
	m: (t: T, next: (t: T) => void) => void,
	next: (s: S) => void,
	s: S,
) => void

export type Setter<T, S> = (t: T, next: (s: S) => void, s: S) => void

export type Remover<S> = (s: S, next: (s: S) => void) => void
