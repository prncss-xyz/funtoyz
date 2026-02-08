import { Init } from '../functions/arguments'
import { Empty } from '../objects/types'
import { Flags } from './flags'
import {
	Emit,
	Emitter,
	Getter,
	Modifier,
	Remover,
	Reviewer,
	Setter,
} from './methods'

export class Compose<
	T,
	U,
	E1,
	G1,
	F1 extends Flags,
	S,
	E2,
	G2,
	F2 extends Flags,
> implements ISource<U, S, E1 | E2, G1 | G2, F1 & F2> {
	emit
	flags
	o1
	o2
	constructor(o1: IOptic<U, T, E1, G1, F1>, o2: ISource<T, S, E2, G2, F2>) {
		this.o1 = o1
		this.o2 = o2
		this.flags = { ...o1.flags, ...o2.flags } as F1 & F2
		this.emit = o1.emitter(o2.emit)
	}
	getter(s: S, next: (u: U) => void, error: (e: G1 | G2) => void) {
		this.o2.getter(s, (t) => this.o1.getter(t, next, error), error)
	}
	modifier(
		m: (u: U, next: (u: U) => void) => void,
		next: (s: S) => void,
		s: S,
	) {
		this.o2.getter(
			s,
			// FIXME:
			(u) => this.o1.modifier(m, (t) => this.o2.reviewer(t, next), u),
			() => next(s),
		)
	}
	remover(s: S, next: (s: S) => void) {
		this.o2.remover(s, next)
	}
	reviewer(t: U, next: (s: S) => void) {
		this.o1.reviewer(t, (t) => this.o2.reviewer(t, next))
	}
	setter(t: U, next: (s: S) => void, s: S) {
		this.o2.getter(
			s,
			// FIXME:
			(u) => this.o1.setter(t, (t) => this.o2.reviewer(t, next), u),
			() => next(s),
		)
	}
}

export function compose<T, U, E1, G1, F1 extends Flags>(
	o1: IOptic<U, T, E1, G1, F1>,
) {
	return function <S, E2, G2, F2 extends Flags>(
		o2: ISource<T, S, E2, G2, F2>,
	): ISource<U, S, E1 | E2, G1 | G2, F1 & F2> {
		return new Compose(o1, o2)
	}
}

interface ICore<T, S, G, F extends Flags> {
	flags: F
	getter: Getter<T, S, G>
	modifier: Modifier<T, S>
	remover: Remover<S>
	reviewer: Reviewer<T, S>
	setter: Setter<T, S>
}

export interface ISource<T, S, E, G, F extends Flags> extends ICore<
	T,
	S,
	G,
	F
> {
	emit: Emit<T, S, E>
}

export interface IOptic<T, S, E, G, F extends Flags> extends ICore<T, S, G, F> {
	emitter: Emitter<T, S, E>
}

export type Focus<T, S, E, G, F extends Flags> = Init<
	ISource<T, S, E, G, F>,
	[ISource<S, Empty, never, never, Empty>]
>
