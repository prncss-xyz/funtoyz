import { forbidden } from '../../assertions'
import { nothing, Nothing } from '../../tags/results'
import { IOptic } from '../compose'
import { source } from '../compose/_composeEmit'
import { Emit, trush } from '../compose/_methods'

export function sourceSync<T, S, E>(
	emit: Emit<T, S, E>,
): IOptic<T, S, E, E | Nothing, { UNIQUE: false }> {
	return {
		emitter: source(emit),
		flags: { UNIQUE: false },
		modifier: forbidden as never,
		nothing,
		remover: trush,
		reviewer: forbidden as never,
		setter: forbidden as never,
	}
}

export function sourceAsync<T, S, E>(
	emit: Emit<T, S, E>,
): IOptic<T, S, E, E | Nothing, { SYNC: false; UNIQUE: false }> {
	return {
		emitter: source(emit),
		flags: { SYNC: false, UNIQUE: false },
		modifier: forbidden as never,
		nothing,
		remover: trush,
		reviewer: forbidden as never,
		setter: forbidden as never,
	}
}
