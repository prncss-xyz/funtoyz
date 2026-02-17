import { noop } from '../../../functions/basics'
import { Empty } from '../../../objects/types'
import { Nothing, nothing } from '../../../tags/results'
import { IOptic } from '../../compose'
import { source } from '../../compose/_composeEmit'
import { apply, trush } from '../../compose/_methods'

const flags = {}

export function none<S>(): IOptic<S, S, never, Nothing, Empty> {
	return {
		emitter: source(
			(
				_s: S,
				_n: (s: S) => void,
				_e: (e: never) => void,
				start: () => void,
			) => ({
				abort: noop,
				start,
			}),
		),
		flags,
		getter: (_s, _n, e) => e(nothing()),
		modifier: apply,
		nothing,
		remover: trush,
		reviewer: trush,
		setter: trush,
	}
}
