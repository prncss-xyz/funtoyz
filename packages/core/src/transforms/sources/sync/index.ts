import { nothing, Nothing } from '../../../tags/results'
import { Optic } from '../../compose'
import { source } from '../../compose/_composeEmit'
import { Emit } from '../../compose/_methods'

export function sourceSync<T, S, E>(
	emit: Emit<T, S, E>,
): Optic<
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
