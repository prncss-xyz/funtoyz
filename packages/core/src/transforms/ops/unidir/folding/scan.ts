import { fromInit } from '../../../../functions/arguments/init'
import { id, noop } from '../../../../functions/basics'
import { ReducerNonDest } from '../../../../reduce'
import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

export function scan<Event, State, Result = State>(
	props: ReducerNonDest<Event, State, Result>,
) {
	return function <S, E, G, F extends Flags & { UNIQUE: false }>(
		o: Optic<Event, S, E, G, F>,
	): Optic<
		Result,
		S,
		E,
		never,
		(F['SYNC'] extends false ? { SYNC: false } : object) & {
			CONSTRUCT: false
			UNIQUE: false
			WRITE: false
		}
	> {
		return {
			emitter: (source, next, _e, c) => {
				const reduce = props.reduce
				const result = props.result ?? (id as never)
				let acc = fromInit(props.init)
				const { abort, start } = o.emitter!(
					source,
					(s) => {
						acc = reduce(s, acc)
						next(result(acc))
					},
					noop,
					c,
				)
				return {
					abort,
					start: () => {
						next(result(acc))
						start()
					},
				}
			},
			flags: {
				CONSTRUCT: false,
				SYNC: o.flags.SYNC as never,
				UNIQUE: false,
				WRITE: false,
			},
		}
	}
}
