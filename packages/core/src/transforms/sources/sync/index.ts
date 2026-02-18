import { nothing, Nothing } from '../../../tags/results'
import { IOptic } from '../../compose'
import { source } from '../../compose/_composeEmit'
import { Emit } from '../../compose/_methods'

export function sourceSync<T, S, E>(
	emit: Emit<T, S, E>,
): IOptic<
	T,
	S,
	E,
	E | Nothing,
	{ CONSTRUCT: false; UNIQUE: false; WRITE: false }
> {
	return {
		emitter: source(emit),
		flags: { CONSTRUCT: false, UNIQUE: false, WRITE: false },
		nothing,
	}
}
