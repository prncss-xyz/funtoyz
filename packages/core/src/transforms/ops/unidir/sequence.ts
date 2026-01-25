import { nothing, Nothing } from '../../../tags/results'
import { _compo } from '../../compose'
import { Emitter } from '../../types'

export function sequence<Part, Whole, E>(emitter: Emitter<Part, Whole, E>) {
	return _compo<
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
