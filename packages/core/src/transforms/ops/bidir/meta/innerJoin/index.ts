import { Optic } from '../../../../compose'
import { Flags } from '../../../../compose/_flags'
import { Once } from '../../../../sources/sync/once'

export function innerJoin<U, V, S, E1, G1, F1 extends Flags>(
	_r: (u: U) => (u: Once<S>) => Optic<V, S, E1, G1, F1>,
) {
	return function <E2, G2, F2 extends Flags>(
		_o: Optic<U, S, E2, G2, F2>,
	): Optic<V, S, E1 | E2, G1 | G2, F1 & F2> {
		// TODO:
		return 0 as never
	}
}
