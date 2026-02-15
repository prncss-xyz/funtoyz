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

export function compose<T, U, E1, G1, F1 extends Flags>(
	o1: IOptic<U, T, E1, G1, F1>,
) {
	return <S, E2, G2, F2 extends Flags>(
		o2: ISource<T, S, E2, G2, F2>,
	): ISource<U, S, E1 | E2, G1 | G2, F1 & F2> => {
		// FIXME:
		const getModifier = (): Modifier<U, S> => {
			if (o2.flags.CONSTRUCT !== undefined) {
				return (m, next, s) =>
					o2.getter(
						s,
						(u) => o1.modifier(m, (t) => o2.setter(t, next, s), u),
						() => next(s),
					)
			}
			return (m, next, s) =>
				o2.getter(
					s,
					(u) => o1.modifier(m, (t) => o2.reviewer(t, next), u),
					() => next(s),
				)
		}

		const modifier = getModifier()

		const flags = { ...o1.flags, ...o2.flags }

		const emit: Emit<U, S, E1 | E2> =
			'emitter' in o1 ? o1.emitter(o2.emit) : composeEmit(o2.emit, o1.emit)

		const setter: Setter<U, S> =
			o1.flags.CONSTRUCT === undefined
				? (t, next, s) => o1.reviewer(t, (t) => o2.setter(t, next, s))
				: o2.flags.CONSTRUCT === undefined
					? (t, next, s) =>
							o2.getter(
								s,
								(u) => o1.setter(t, (t) => o2.reviewer(t, next), u),
								() => next(s),
							)
					: (t, next, s) =>
							o2.getter(
								s,
								(u) => o1.setter(t, (t) => o2.setter(t, next, s), u),
								() => next(s),
							)

		return {
			emit,
			flags,
			getter: (s: S, next: (u: U) => void, error: (e: G1 | G2) => void) =>
				o2.getter(s, (t) => o1.getter(t, next, error), error),
			modifier,
			remover: (s: S, next: (s: S) => void) => o2.modifier(o1.remover, next, s),
			reviewer: (t: U, next: (s: S) => void) =>
				o1.reviewer(t, (t) => o2.reviewer(t, next)),
			setter,
		}
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
