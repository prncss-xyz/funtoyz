import { iso } from '.'
import { id } from '../../../../functions/basics'

export function normalize<Whole>(over: (w: Whole) => Whole) {
	return iso({ get: id, set: over })
}
