import { Empty } from '../../../objects/types'
import { IOptic } from '../../compose'
import { apply, neverNothing, trush } from '../../compose/_methods'

const flags = {}

export function once<S>(): IOptic<S, S, never, never, Empty> {
	return {
		flags,
		getter: trush,
		modifier: apply,
		nothing: neverNothing,
		remover: trush,
		reviewer: trush,
		setter: trush,
	}
}
