import { nothing, Nothing } from '../../../tags/results'
import { IOptic } from '../../compose'
import { source } from '../../compose/_composeEmit'
import { Emit } from '../../compose/_methods'

export function sourceAsync<T, S, E>(
	emit: Emit<T, S, E>,
): IOptic<
	T,
	S,
	E,
	E | Nothing,
	{ CONSTRUCT: false; SYNC: false; UNIQUE: false; WRITE: false }
> {
	return {
		emitter: source(emit),
		flags: { CONSTRUCT: false, SYNC: false, UNIQUE: false, WRITE: false },
		nothing,
	}
}
