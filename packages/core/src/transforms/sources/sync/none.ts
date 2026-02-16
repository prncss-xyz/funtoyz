import { noop } from '../../../functions/basics'
import { Empty } from '../../../objects/types'
import { Nothing, nothing } from '../../../tags/results'
import { ISource } from '../../compose'
import { apply, trush } from '../../compose/_methods'

const flags = {}

export function none<S>(): ISource<S, S, never, Nothing, Empty> {
	return {
		emit: (
			_s: S,
			_n: (s: S) => void,
			_e: (e: never) => void,
			start: () => void,
		) => ({
			abort: noop,
			start,
		}),
		flags,
		getter: (_s, _n, e) => e(nothing()),
		modifier: apply,
		remover: trush,
		reviewer: trush,
		setter: trush,
	}
}
