import { Empty } from '../../../objects/types'
import { Optic } from '../../compose'
import { trush } from '../../compose/_methods'

const flags = {}

export function once<S>(): Optic<S, S, never, never, Empty> {
	return {
		flags,
		getter: trush,
		reviewer: trush,
	}
}
