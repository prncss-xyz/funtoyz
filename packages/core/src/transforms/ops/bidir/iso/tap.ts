import { Empty } from '../../../../objects/types'
import { compose } from '../../../compose'
import { trush } from '../../../compose/_methods'

export function tap<T>(fn: (value: T) => void) {
	return compose<T, T, never, never, Empty>({
		flags: {},
		getter: (s, next) => {
			fn(s)
			next(s)
		},
		reviewer: trush,
	})
}
