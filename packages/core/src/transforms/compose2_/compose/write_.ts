import { forbidden } from '../../../assertions'
import { apply, Optic, trush } from '../core'
import { Flags } from '../flags'
import { Modifier, Reviewer, Setter } from '../types_'

export function composeWrite<
	T,
	S,
	U,
	E1,
	E2,
	F1 extends Flags,
	F2 extends Flags,
>(
	o1: Optic<U, T, E1, F1>,
	o2: Optic<T, S, E2, F2>,
	res: Optic<U, S, E1 | E2, F1 & F2>,
) {
	if (o1.reviewer && o2.reviewer) {
		res.reviewer = composeReview(o1.reviewer, o2.reviewer)
		return
	}
	if (o1.reviewer && o2.setter) {
		res.setter = (t, next, s) => o1.reviewer!(t, (t) => o2.setter!(t, next, s))
		return
	}
	if (o1.setter && o2.reviewer && o2.getter) {
		res.setter = (t, next, s) =>
			o2.getter!(
				s,
				// TODO: optimize for trush
				(u) => o1.setter!(t, (t) => o2.reviewer!(t, next, s), u),
				() => next(s),
			)
		return
	}
	if (o1.setter && o2.setter && o2.getter) {
		res.setter = (t, next, s) =>
			o2.getter!(
				s,
				(u) => o1.setter!(t, (t) => o2.setter!(t, next, s), u),
				() => next(s),
			)
		return
	}
	// TODO: lots of missing cases
	if (o1.reviewer === trush && o2.modifier) {
		res.modifier = o2.modifier as never
		return
	}
	if (o2.reviewer === trush && o1.modifier) {
		res.modifier = o1.modifier as never
		return
	}
	if (o1.modifier && o2.modifier) {
		res.modifier = composeModifier(o1.modifier, o2.modifier)
		return
	}

	// else if (o1.modifier && (o2.reviewer || o2.setter || o2.modifier))
}

function composeReview<T, S, U>(
	r1: Reviewer<U, T>,
	r2: Reviewer<T, S>,
): Reviewer<U, S> {
	if (r2 === trush) return r1 as never
	if (r1 === trush) return r2 as never
	return (t: U, next: (s: S) => void) => r1(t, (t) => r2(t, next))
}

function composeModifier2<T, S, U>(
	m1: Modifier<U, T>,
	m2: Modifier<T, S>,
): Modifier<U, S> {
	if (m2 === apply) return m1 as never
	if (m1 === apply) return m2 as never
	return (m, next, s) => m2((t, on) => m1(m, on, t), next, s)
}

function composeModifier<T, S, U>(
	m1: Modifier<U, T>,
	m2: Modifier<T, S>,
): Modifier<U, S> {
	if (m2 === apply) return m1 as never
	if (m1 === apply) return m2 as never
	return (m, next, s) => m2((t, on) => m1(m, on, t), next, s)
}

export function getSetter<T, S, E>(o: Optic<T, S, E, any>): Setter<T, S> {
	if (o.setter) return o.setter!
	if (o.reviewer) return o.reviewer!
	if (o.modifier)
		return (t, next, s) => o.modifier!((_t, next) => next(t), next, s as any)
	forbidden()
}
