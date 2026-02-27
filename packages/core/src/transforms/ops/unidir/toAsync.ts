import { Optic } from '../../compose'
import { Flags, HasFlag } from '../../compose/flags'

export function toAsync() {
	function res<T, S, E, G, F extends Flags>(
		o: Optic<T, S, E, G, HasFlag<'SYNC', F>>,
	): Optic<T, S, E, G, F & { SYNC: false }> {
		return {
			...o,
			flags: {
				...o.flags,
				SYNC: false,
			},
		}
	}
	return res
}
