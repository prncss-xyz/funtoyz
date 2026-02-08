import { forbidden } from '../../assertions'
import { Nothing } from '../../tags/results'
import { ISource } from '../core'
import { Flags } from '../flags'
import { Emit, first, trush } from '../methods'

export class Source<
	T,
	S,
	E,
	F extends Flags & { UNIQUE: false },
> implements ISource<T, S, E, E | Nothing, F> {
	emit
	flags
	modifier = forbidden as never
	remover = trush
	reviewer = forbidden as never
	setter = forbidden as never
	constructor(emit: Emit<T, S, E>, flags: F) {
		this.emit = emit
		this.flags = flags
	}
	getter(s: S, next: (t: T) => void, error: (e: E | Nothing) => void) {
		return first(this.emit)(s, next, error)
	}
}

export function sourceSync<T, S, E>(
	emit: Emit<T, S, E>,
): ISource<T, S, E, E | Nothing, { UNIQUE: false }> {
	return new Source(emit, { UNIQUE: false })
}

export function sourceAsync<T, S, E>(
	emit: Emit<T, S, E>,
): ISource<T, S, E, E | Nothing, { SYNC: false; UNIQUE: false }> {
	return new Source(emit, { SYNC: false, UNIQUE: false })
}
