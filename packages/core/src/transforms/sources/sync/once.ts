import { exhaustive } from '../../../assertions'
import { noop } from '../../../functions/basics'
import { Empty } from '../../../objects/types'
import { ISource } from '../../compose'
import { apply, neverNothing, trush } from '../../compose/_methods'

const flags = {}

function emit<S>(
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

export function once<S>(): ISource<S, S, never, never, Empty> {
	return {
		emit,
		flags,
		getter: trush,
		modifier: apply,
		nothing: neverNothing,
		remover: trush,
		reviewer: trush,
		setter: trush,
	}
}
