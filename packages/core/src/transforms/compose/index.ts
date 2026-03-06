import { isFunction } from '../../guards'
import { Empty } from '../../objects/types'
import { once } from '../sources/sync/once'
import {
	composeEmitterEmitter_,
	composeGetterEmitter_,
} from './_composeEmitter'
import {
	Emitter,
	getModifier,
	Getter,
	Modifier,
	Remover,
	Reviewer,
	Setter,
	trush,
} from './_methods'
import { Flags } from './flags'

export type Compose<T, U, E1, G1, F1 extends Flags> = <
	S,
	E2,
	G2,
	F2 extends Flags,
>(
	o2: Optic<T, S, E2, G2, F2>,
) => Optic<U, S, E1 | E2, G1 | G2, F1 & F2>

// TODO: optimize for getter === trush
// TODO: optimize for reviewer === trush

function composeGetter<T, U, S, E1, G1, E2, G2>(
	o1: Optic<U, T, E1, G1, any>,
	o2: Optic<T, S, E2, G2, any>,
): Getter<U, S, any> | undefined {
	if (o1.getter === trush) return o2.getter as never
	if (o2.getter === trush) return o1.getter as never
	if (o1.getter === undefined) return undefined
	if (o2.getter === undefined) return undefined
	return (s, next, error) =>
		o2.getter!(s, (t) => o1.getter!(t, next, error), error)
}

export function composeEmitter<T, U, S, E1, E2, G2, F2 extends Flags>(
	o1: Optic<U, T, E1, any, any>,
	o2: Optic<T, S, E2, G2, F2>,
): Emitter<U, S, E1 | E2 | G2> | undefined {
	if (o1.emitter) {
		if (o2.emitter) return composeEmitterEmitter_(o2.emitter, o1.emitter)
		if (o2.getter) return composeGetterEmitter_(o1.emitter, o2.getter)
	}
	if (o1.getter)
		if (o2.emitter)
			return (s, next, error, complete) =>
				o2.emitter!(s, (t) => o1.getter!(t, next, error), error, complete)
	return undefined
}

function composeNothing<G1, G2>(
	o1: Optic<any, any, any, G1, any>,
	o2: Optic<any, any, any, G2, any>,
): (() => G1 | G2) | undefined {
	return o2.nothing || o1.nothing
}

function composesReviewer<T, U, S>(
	o1: Optic<U, T, any, any, any>,
	o2: Optic<T, S, any, any, any>,
): Reviewer<U, S> | undefined {
	if (o1.reviewer && o2.reviewer) {
		if (o1.reviewer === trush) return o2.reviewer as never
		if (o2.reviewer === trush) return o1.reviewer as never
		return (t, next) => o1.reviewer!(t, (t) => o2.reviewer!(t, next))
	}
	return undefined
}

function composeSetter<T, U, S, E2, G2, F2 extends Flags>(
	o1: Optic<U, T, any, any, any>,
	o2: Optic<T, S, E2, G2, F2>,
): Setter<U, S> | undefined {
	if (o1.reviewer)
		if (o2.setter) {
			if (o1.reviewer === trush) return o2.setter as never
			return (t, next, s) => o1.reviewer!(t, (t) => o2.setter!(t, next, s))
		}
	if (o1.setter && o2.getter) {
		if (o2.reviewer) {
			return (t, next, s) =>
				o2.getter!(
					s,
					(u) => o1.setter!(t, (t) => o2.reviewer!(t, next), u),
					() => next(s),
				)
		}
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

function composeModifier<T, U, S, E2, G2, F2 extends Flags>(
	o1: Optic<U, T, any, any, any>,
	o2: Optic<T, S, E2, G2, F2>,
): Modifier<U, S> | undefined {
	if (o1.modifier || o2.modifier) {
		const mod1 = getModifier(o1)
		const mod2 = getModifier(o2)
		if (mod1 && mod2)
			return (m, next, s) => mod2((t, nextT) => mod1(m, nextT, t), next, s)
	}
	return undefined
}

function composeRemover<T, U, S>(
	o1: Optic<U, T, any, any, any>,
	o2: Optic<T, S, any, any, any>,
): Remover<S> | undefined {
	if (o1.remover) {
		const m = getModifier(o2)
		if (m) return (s, next) => m(o1.remover!, next, s)
	}
	return undefined
}

export function compose<T, U, E1, G1, F1 extends Flags>(
	o1: Optic<U, T, E1, G1, F1>,
) {
	return <S, E2, G2, F2 extends Flags>(
		o2: Optic<T, S, E2, G2, F2>,
	): Optic<U, S, E1 | E2 | G2, G1 | G2, F1 & F2> => {
		return {
			emitter: composeEmitter(o1, o2),
			flags: { ...o1.flags, ...o2.flags },
			getter: composeGetter(o1, o2),
			modifier: composeModifier(o1, o2),
			nothing: composeNothing(o1, o2),
			remover: composeRemover(o1, o2),
			reviewer: composesReviewer(o1, o2),
			setter: composeSetter(o1, o2),
		}
	}
}

export function focus<T, U, E1, G1, F1 extends Flags>(
	o1: Focus<U, T, E1, G1, F1>,
) {
  return compose(fromFocus(o1))
}

export type Optic<T, S, E, G, F extends Flags> = {
	emitter?: Emitter<T, S, E>
	flags: F
	getter?: Getter<T, S, E | G>
	modifier?: Modifier<T, S>
	nothing?: () => G
	remover?: Remover<S>
	reviewer?: Reviewer<T, S>
	setter?: Setter<T, S>
}

export function fromFocus<T, S, E, G, F extends Flags>(
	focus: Focus<T, S, E, G, F> | Optic<T, S, E, G, F>,
): Optic<T, S, E, G, F> {
	if (isFunction(focus)) return focus(once<S>())
	return focus
}

export type Focus<T, S, E, G, F extends Flags> = (
	o: Optic<S, S, never, never, Empty>,
) => Optic<T, S, E, G, F>
