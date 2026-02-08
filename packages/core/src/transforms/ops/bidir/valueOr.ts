import { noop } from '../../../functions/basics'
import { Empty } from '../../../objects/types'
import { ISource } from '../../core'
import { apply, trush } from '../../methods'

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
