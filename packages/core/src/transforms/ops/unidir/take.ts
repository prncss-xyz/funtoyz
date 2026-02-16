import { forbidden } from '../../../assertions'
import { compose } from '../../compose'
import { trush } from '../../compose/_methods'
import { none } from '../../sources/sync/none'

export function take<A>(n: number) {
	if (n === 0) return compose(none()) as never
	return compose<A, A, never, never, { CONSTRUCT: false; WRITE: false }>({
		emitter: (emit) => {
			let i = 0
			return (source, next, e, c) =>
				emit(
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
		remover: trush,
		reviewer: forbidden as never,
		setter: forbidden as never,
	})
}
