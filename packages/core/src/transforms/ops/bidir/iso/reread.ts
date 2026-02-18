import { iso } from '.'
import { id } from '../../../../functions/basics'

export function reread<Whole>(over: (w: Whole) => Whole) {
	return iso({ get: over, set: id })
}
