import { forbidden } from '../../assertions'
import { Init } from '../../functions/arguments'
import { Empty } from '../../objects/types'
import { composeEmit } from './_composeEmit'
import { Flags } from './_flags'
import {
	Emit,
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
	o2: ISource<T, S, E2, G2, F2>,
) => ISource<U, S, E1 | E2, G1 | G2, F1 & F2>

function getModifier<T, U, S, E2, G2, F2 extends Flags>(
	o1: IOptic<U, T, any, any, any>,
	o2: ISource<T, S, E2, G2, F2>,
): Modifier<U, S> {
	return (
		m: (t: U, next: (t: U) => void) => void,
		next: (s: S) => void,
		s: S,
	) => o2.modifier((t, on) => o1.modifier(m, on, t), next, s)
}

function getGetter<T, U, S, E2, G2, F2 extends Flags>(
	o1: IOptic<U, T, any, any, any>,
	o2: ISource<T, S, E2, G2, F2>,
): Getter<U, S, any> | undefined {
	const o1Getter = o1.getter
	if (o1Getter === undefined) return undefined
	const o2Getter = o2.getter
	if (o2Getter === undefined) return undefined
	return (s: S, next: (u: U) => void, error: (e: any) => void) =>
		o2Getter(s, (t) => o1Getter(t, next, error), error)
}

function getSetter<T, U, S, E2, G2, F2 extends Flags>(
	o1: IOptic<U, T, any, any, any>,
	o2: ISource<T, S, E2, G2, F2>,
): Setter<U, S> | undefined {
	const o2Setter = o2.setter
	if (o1.flags.CONSTRUCT === undefined)
		return o2Setter === undefined
			? undefined
			: (t, next, s) => o1.reviewer(t, (t) => o2Setter(t, next, s))
	const o2Getter = o2.getter
	if (o2Getter === undefined) return undefined
	const o1Setter = o1.setter
	if (o1Setter === undefined) return undefined
	if (o2.flags.CONSTRUCT === undefined)
		return (t, next, s) =>
			o2Getter(
				s,
				(u) => o1Setter(t, (t) => o2.reviewer(t, next), u),
				() => next(s),
			)
	if (o2Setter === undefined) return undefined
	return (t, next, s) =>
		o2Getter(
			s,
			(u) => o1Setter(t, (t) => o2Setter(t, next, s), u),
			() => next(s),
		)
}

function getNothing<G1, G2>(
	o1: IOptic<any, any, any, G1, any>,
	o2: ISource<any, any, any, G2, any>,
): () => G1 | G2 {
	if (o1.nothing === forbidden) return o2.nothing
	return o1.nothing
}

export function compose<T, U, E1, G1, F1 extends Flags>(
	o1: IOptic<U, T, E1, G1, F1>,
) {
	return <S, E2, G2, F2 extends Flags>(
		o2: ISource<T, S, E2, G2, F2>,
	): ISource<U, S, E1 | E2, G1 | G2, F1 & F2> => {
		const emit: Emit<U, S, E1 | E2> =
			'emitter' in o1 ? o1.emitter(o2.emit) : composeEmit(o2.emit, o1.emit)
		return {
			emit,
			flags: { ...o1.flags, ...o2.flags },
			getter: getGetter(o1, o2),
			modifier: getModifier(o1, o2),
			nothing: getNothing(o1, o2),
			remover: (s: S, next: (s: S) => void) => o2.modifier(o1.remover, next, s),
			reviewer: (t: U, next: (s: S) => void) =>
				o1.reviewer(t, (t) => o2.reviewer(t, next)),
			setter: getSetter(o1, o2),
		}
	}
}

interface ICore<T, S, G, F extends Flags> {
	flags: F
	getter?: Getter<T, S, G>
	modifier: Modifier<T, S>
	nothing: () => G
	remover: Remover<S>
	reviewer: Reviewer<T, S>
	setter?: Setter<T, S>
}

export interface ISource<T, S, E, G, F extends Flags> extends ICore<
	T,
	S,
	G,
	F
> {
	emit: Emit<T, S, E>
}

export type IOptic<T, S, E, G, F extends Flags> = ICore<T, S, G, F> &
	(
		| {
				emit: Emit<T, S, E>
		  }
		| {
				emitter: Emitter<T, S, E>
		  }
	)

export type Focus<T, S, E, G, F extends Flags> = Init<
	ISource<T, S, E, G, F>,
	[ISource<S, Empty, never, never, Empty>]
>
