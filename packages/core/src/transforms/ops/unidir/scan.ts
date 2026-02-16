import { forbidden } from '../../../assertions'
import { fromInit } from '../../../functions/arguments'
import { id } from '../../../functions/basics'
import { compose } from '../../compose'
import { ReducerDest, trush } from '../../compose/_methods'

export function scan<Event, State, Result>(
	props: ReducerDest<Event, State, Result>,
) {
	return compose<
		Event,
		Result,
		never,
		never,
		{ CONSTRUCT: false; WRITE: false }
	>({
		emitter: (emit) => (source, next, e, c) => {
			const reduce = props.reduceDest ?? props.reduce
			const result = props.result ?? (id as never)
			let acc = fromInit(props.init)
			return emit(
				source,
				(s) => {
					acc = reduce(s, acc)
					next(result(acc))
				},
				e,
				c,
			)
		},
		flags: { CONSTRUCT: false, WRITE: false },
		getter: forbidden as never,
		modifier: forbidden as never,
		remover: trush,
		reviewer: forbidden as never,
		setter: forbidden as never,
	})
}
