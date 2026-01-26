import { nothing, Nothing } from '../../../tags/results'
import { compo_ } from '../../compose_'
import { Emitter } from '../../types'

export function sequence<Part, Whole, E>(emitter: Emitter<Part, Whole, E>) {
	return compo_<
		Part,
		Whole,
		Nothing,
		E,
		{
			getter: true
			optional: true
			traversable: true
		}
	>({
		emitter,
		toEmpty: () => nothing(),
	})
}
