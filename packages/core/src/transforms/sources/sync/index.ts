import { nothing, Nothing } from '../../../tags/results'
import { Optic } from '../../compose'
import { Emitter } from '../../compose/_methods'

export function sourceSync<T, S, E>(
	emitter: Emitter<T, S, E>,
): Optic<
	T,
	S,
	E,
	E | Nothing,
	{ CONSTRUCT: false; UNIQUE: false; WRITE: false }
> {
	return {
		emitter,
		flags: { CONSTRUCT: false, UNIQUE: false, WRITE: false },
		nothing,
	}
}
