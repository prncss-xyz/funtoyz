import { _compo } from '../../core/compose'
import { Emitter } from '../../core/types'

export function sequence<Part, Whole, E>(emitter: Emitter<Part, Whole, E>) {
	return _compo<
		Part,
		Whole,
		'empty',
		E,
		{
			getter: true
			optional: true
			traversable: true
		}
	>({
		emitter,
		toEmpty: () => 'empty',
	})
}
