import { fromInit, Init } from '../../functions/arguments'
import { noop } from '../../functions/basics'
import { isFunction } from '../../guards'
import { getEmitter, getGetter } from '../compose_'
import { Eq, eq } from '../eq'
import { Optic, Source } from '../types'

type Observer<T, E> =
	| ((t: T) => void)
	| Partial<{
			complete: () => void
			error: (e: E) => void
			next: (t: T) => void
	  }>

function resolveObserver<T, E>(observer: Observer<T, E>, unmount: () => void) {
	if (typeof observer === 'function') return [observer, noop, unmount] as const
	const { complete, error, next } = observer
	return [
		next ?? noop,
		error ?? noop,
		complete
			? () => {
					observer.complete!()
					unmount()
				}
			: unmount,
	] as const
}

export function get_<T, S, EG, EF, ES, F>(
	o: Optic<T, S, EG, EF, F>,
	s: S | Source<S, ES>,
	success: (t: T) => void,
	err: (e: EF | EG | ES) => void,
) {
	if (isFunction(s)) first_(s, o, success, err)
	else getGetter(o)(s, success, err)
}

export function first_<T, S, ES, EG, EF, F>(
	source: Source<S, ES>,
	o: Init<Optic<T, S, EG, EF, F>, [Eq<S>]>,
	success: (t: T) => void,
	error: (e: EF | EG | ES) => void,
) {
	const { start, unmount } = getEmitter(fromInit(o, eq()))(source)(
		(t) => {
			success(t)
			unmount()
		},
		error,
		() => unmount(),
	)
	start()
}

export function observe_<T, S, ES, EG, EF, F>(
	source: Source<S, ES>,
	o: Init<Optic<T, S, EG, EF, F>, [Eq<S>]>,
	next: (t: T) => void,
	error: (e: EF | EG | ES) => void,
) {
	const { start, unmount } = getEmitter(fromInit(o, eq()))(source)(
		next,
		error,
		() => unmount,
	)
	start()
}

export function observe<T, S, ES, EG, EF, F>(
	source: Source<S, ES>,
	o: Init<Optic<T, S, EG, EF, F>, [Eq<S>]>,
	observer: Observer<T, EF | EG | ES>,
) {
	const { start, unmount } = getEmitter(fromInit(o, eq()))(source)(
		...resolveObserver(observer, () => unmount!),
	)
	start()
}
