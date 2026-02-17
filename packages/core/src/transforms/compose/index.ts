import { Init } from '../../functions/arguments'
import { pipe2 } from '../../functions/basics'
import { Empty } from '../../objects/types'
import { Flags } from './_flags'
import {
	Emitter,
	Getter,
	Modifier,
	Remover,
	Reviewer,
	Setter,
} from './_methods'

export type Compose<T, U, E1, G1, F1 extends Flags> = <
	S,
	E2,
	G2,
	F2 extends Flags,
>(
	o2: IOptic<T, S, E2, G2, F2>,
) => IOptic<U, S, E1 | E2, G1 | G2, F1 & F2>

// TODO: optimize for trush

function getGetter<T, U, S, E2, G2, F2 extends Flags>(
	o1: IOptic<U, T, any, any, any>,
	o2: IOptic<T, S, E2, G2, F2>,
): Getter<U, S, any> | undefined {
	if (o1.getter === undefined) return undefined
	if (o2.getter === undefined) return undefined
	return (s: S, next: (u: U) => void, error: (e: any) => void) =>
		o2.getter!(s, (t) => o1.getter!(t, next, error), error)
}

function getEmitter<T, U, S, E1, E2, G2, F2 extends Flags>(
	o1: IOptic<U, T, E1, any, any>,
	o2: IOptic<T, S, E2, G2, F2>,
): Emitter<U, S, E1 | E2 | G2> | undefined {
	if (o1.emitter) {
		if (o2.emitter) {
			// assigning to res is necessary for proper type inference
			const res = pipe2(o2.emitter, o1.emitter)
			return res
		}
		if (o2.getter)
			return (emit) =>
				o1.emitter!((s, next, error, complete) =>
					emit(s, (t) => o2.getter!(t, next, error), error, complete),
				)
	}
	if (o1.getter)
		if (o2.emitter)
			return (emit) => (s, next, error, complete) =>
				o2.emitter!(emit)(s, (t) => o1.getter!(t, next, error), error, complete)
	return undefined
}

function getReviewer<T, U, S>(
	o1: IOptic<U, T, any, any, any>,
	o2: IOptic<T, S, any, any, any>,
): Reviewer<U, S> | undefined {
	if (o1.reviewer && o2.reviewer)
		return (t: U, next: (s: S) => void) =>
			o1.reviewer!(t, (t) => o2.reviewer!(t, next))
	return undefined
}

function getSetter<T, U, S, E2, G2, F2 extends Flags>(
	o1: IOptic<U, T, any, any, any>,
	o2: IOptic<T, S, E2, G2, F2>,
): Setter<U, S> | undefined {
	if (o1.reviewer)
		if (o2.setter)
			return (t, next, s) => o1.reviewer!(t, (t) => o2.setter!(t, next, s))
	if (o1.setter && o2.getter) {
		if (o2.reviewer)
			return (t, next, s) =>
				o2.getter!(
					s,
					(u) => o1.setter!(t, (t) => o2.reviewer!(t, next), u),
					() => next(s),
				)
		if (o2.setter)
			return (t, next, s) =>
				o2.getter!(
					s,
					(u) => o1.setter!(t, (t) => o2.setter!(t, next, s), u),
					() => next(s),
				)
	}
	return undefined
}

function getModifier<T, U, S, E2, G2, F2 extends Flags>(
	o1: IOptic<U, T, any, any, any>,
	o2: IOptic<T, S, E2, G2, F2>,
): Modifier<U, S> {
	return (
		m: (t: U, next: (t: U) => void) => void,
		next: (s: S) => void,
		s: S,
	) => o2.modifier((t, on) => o1.modifier(m, on, t), next, s)
}

function getNothing<G1, G2>(
	o1: IOptic<any, any, any, G1, any>,
	o2: IOptic<any, any, any, G2, any>,
): (() => G1 | G2) | undefined {
	return o2.nothing || o1.nothing
}

export function compose<T, U, E1, G1, F1 extends Flags>(
	o1: IOptic<U, T, E1, G1, F1>,
) {
	return <S, E2, G2, F2 extends Flags>(
		o2: IOptic<T, S, E2, G2, F2>,
	): IOptic<U, S, E1 | E2, G1 | G2, F1 & F2> => {
		return {
			emitter: getEmitter(o1, o2),
			flags: { ...o1.flags, ...o2.flags },
			getter: getGetter(o1, o2),
			modifier: getModifier(o1, o2),
			nothing: getNothing(o1, o2),
			remover: (s: S, next: (s: S) => void) => o2.modifier(o1.remover, next, s),
			reviewer: getReviewer(o1, o2),
			setter: getSetter(o1, o2),
		}
	}
}

export type IOptic<T, S, E, G, F extends Flags> = {
	emitter?: Emitter<T, S, E>
	flags: F
	getter?: Getter<T, S, G>
	modifier: Modifier<T, S>
	nothing?: () => G
	remover: Remover<S>
	reviewer?: Reviewer<T, S>
	setter?: Setter<T, S>
}

export type Focus<T, S, E, G, F extends Flags> = Init<
	IOptic<T, S, E, G, F>,
	[IOptic<S, Empty, never, never, Empty>]
>
