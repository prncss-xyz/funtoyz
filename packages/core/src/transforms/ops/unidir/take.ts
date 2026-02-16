import { forbidden } from '../../../assertions'
import { compose } from '../../compose'
import { neverNothing, trush } from '../../compose/_methods'
import { none } from '../../sources/sync/none'

export function take<A>(n: number) {
	if (n === 0) return compose(none()) as never
	return compose<A, A, never, never, { CONSTRUCT: false; WRITE: false }>({
		emitter: (emit) => (source, next, e, c) => {
			let i = 0
			return emit(
				source,
				(s) => {
					next(s)
					if (++i === n) c()
				},
				e,
				c,
			)
		},
		flags: { CONSTRUCT: false, WRITE: false },
		getter: trush,
		modifier: forbidden as never,
		nothing: neverNothing,
		remover: trush,
		reviewer: forbidden as never,
		setter: forbidden as never,
	})
}
