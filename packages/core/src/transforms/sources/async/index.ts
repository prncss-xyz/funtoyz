import { nothing, Nothing } from '../../../tags/results'
import { Optic } from '../../compose'
import { Emitter } from '../../compose/_methods'

export function sourceAsync<T, S, E>(
	emitter: Emitter<T, S, E>,
): Optic<
	T,
	S,
	E,
	E | Nothing,
	{ CONSTRUCT: false; SYNC: false; UNIQUE: false; WRITE: false }
> {
	return {
		emitter,
		flags: { CONSTRUCT: false, SYNC: false, UNIQUE: false, WRITE: false },
		nothing,
	}
}
