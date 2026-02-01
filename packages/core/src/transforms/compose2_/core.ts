import { forbidden } from '../../assertions'
import { Init } from '../../functions/arguments'
import { noop } from '../../functions/basics'
import { Empty } from '../../objects/types'
import { Flags } from './flags'
import { Emitter, Getter, Modifier, Remover, Reviewer, Setter } from './types_'

export const trush = <V>(v: V, cb: (v: V) => void) => cb(v)
export const apply = <V>(
	m: (v: V, next: (v: V) => void) => void,
	next: (v: V) => void,
	v: V,
) => m(v, next)

export type Source<T, E> = (
	next: (t: T) => void,
	error: (e: E) => void,
	complete: () => void,
) => {
	start: () => void
	unmount: () => void
}

export type Optic<T, S, E, F extends Flags> = Partial<{
	emitter: Emitter<T, S, E>
	getter: Getter<T, S, E>
	modifier: Modifier<T, S>
	remover: Remover<S>
	reviewer: Reviewer<T, S>
	setter: Setter<T, S>
}> & {
	flags: F
}

export type Eq<T, E = never> = Optic<T, T, E, Empty>

export function eq<T, E = never>(): Eq<T, E> {
	return {
		flags: {},
		getter: trush,
		modifier: undefined,
		remover: trush,
		reviewer: trush,
	}
}

export type Focus<T, S, E, F extends Flags> = Init<Optic<T, S, E, F>, [Eq<S>]>

// TODO: getGetter

export function getEmitter<T, S, E>(o: Optic<T, S, E, any>): Emitter<T, S, E> {
	if (o.emitter) return o.emitter!
	if (o.getter)
		return (source) => (next, err, complete) =>
			source((s) => o.getter!(s, next, noop), err, complete)
	forbidden()
}
