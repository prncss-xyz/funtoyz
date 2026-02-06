import { composeRead } from './compose/read_'
import { composeWrite } from './compose/write_'
import { Optic } from './core'
import { Flags, mergeFlags } from './flags'

export function compose<T, S, U, E1, E2, F1 extends Flags, F2 extends Flags>(
	o1: Optic<U, T, E1, F1>,
	o2: Optic<T, S, E2, F2>,
): Optic<U, S, E1 | E2, F1 & F2> {
	const res: Optic<U, S, E1 | E2, F1 & F2> = {
		flags: mergeFlags(o1.flags, o2.flags),
	}
	composeRead(o1, o2, res)
	composeWrite(o1, o2, res)

	// remover

	return res
}
