import { noop } from '../../../functions/basics'
import { Empty } from '../../../objects/types'
import { ISource } from '../../compose'
import { apply, trush } from '../../compose/_methods'

class ValueOr<S> implements ISource<S, S, never, never, Empty> {
	flags = {}
	getter = trush
	modifier = apply
	remover = trush
	reviewer = trush
	setter = trush
	emit(
		s: S,
		next: (s: S) => void,
		_error: (e: never) => void,
		complete: () => void,
	) {
    let dirty = false
		return {
			abort: noop,
			start: () => {
				next(s)
				complete()
			},
		}
	}
}

export function valueOr<S>(): ISource<S, S, never, never, Empty> {
	return new ValueOr<S>()
}
