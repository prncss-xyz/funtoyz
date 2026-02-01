import { pipe2 } from '../../../functions/basics'
import { trush } from '../../compose_'
import { getEmitter, Optic } from '../core'
import { Flags } from '../flags'
import { Emitter, Getter } from '../types_'

function composeGetGet<T, S, U, E1, E2>(
	g1: Getter<U, T, E1>,
	g2: Getter<T, S, E2>,
): Getter<U, S, E1 | E2> {
	if (g2 === trush) return g1 as never
	if (g1 === trush) return g2 as never
	return (s: S, next: (u: U) => void, error: (e: E1 | E2) => void) =>
		g2(s, (t) => g1(t, next, error), error)
}

function composeEmit<T, S, U, E1, E2>(
	e1: Emitter<U, T, E1>,
	e2: Emitter<T, S, E2>,
): Emitter<U, S, E1 | E2> {
	return pipe2(e2, e1)
}

export function composeRead<
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
	// reader
	if (o1.getter && o2.getter) {
		res.getter = composeGetGet(o1.getter, o2.getter)
		return
	}
	if ((o1.emitter || o1.getter) && (o2.getter || o2.emitter)) {
		res.emitter = composeEmit(getEmitter(o1), getEmitter(o2))
		return
	}
}
