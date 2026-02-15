import { noop } from '../../../functions/basics'
import { Empty } from '../../../objects/types'
import { apply, trush } from '../../compose/_methods'
import { ISource } from '../../compose'

const flags = {}

const emit = <S>(
	s: S,
	next: (s: S) => void,
	_error: (e: never) => void,
	complete: () => void,
) => ({
	abort: noop,
	start: () => {
		next(s)
		complete()
	},
})

export function once<S>(): ISource<S, S, never, never, Empty> {
	return {
		emit,
		flags,
		getter: trush,
		modifier: apply,
		remover: trush,
		reviewer: trush,
		setter: trush,
	}
}
