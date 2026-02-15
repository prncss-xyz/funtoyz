import { forbidden } from '../../assertions'
import { Nothing } from '../../tags/results'
import { ISource } from '../compose'
import { Emit, first, trush } from '../compose/_methods'

export function sourceSync<T, S, E>(
	emit: Emit<T, S, E>,
): ISource<T, S, E, E | Nothing, { UNIQUE: false }> {
	return {
		emit,
		flags: { UNIQUE: false },
		getter: (s: S, next: (t: T) => void, error: (e: E | Nothing) => void) =>
			first(emit)(s, next, error),
		modifier: forbidden as never,
		remover: trush,
		reviewer: forbidden as never,
		setter: forbidden as never,
	}
}

export function sourceAsync<T, S, E>(
	emit: Emit<T, S, E>,
): ISource<T, S, E, E | Nothing, { SYNC: false; UNIQUE: false }> {
	return {
		emit,
		flags: { SYNC: false, UNIQUE: false },
		getter: (s: S, next: (t: T) => void, error: (e: E | Nothing) => void) =>
			first(emit)(s, next, error),
		modifier: forbidden as never,
		remover: trush,
		reviewer: forbidden as never,
		setter: forbidden as never,
	}
}
