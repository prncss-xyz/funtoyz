import { fromInit } from '../../../functions/arguments/init'
import { id, noop } from '../../../functions/basics'
import { Optic } from '../../compose'
import { Flags } from '../../compose/_flags'
import { ReducerNonDest } from '../../compose/_methods'

export function scan<Event, State, Result = State>(
	props: ReducerNonDest<Event, State, Result>,
) {
	return function <S, E, G, F extends Flags>(
		o: Optic<Event, S, E, G, F>,
	): Optic<
		Result,
		S,
		E,
		never,
		F['SYNC'] & {
			CONSTRUCT: false
			UNIQUE: false
			WRITE: false
		} extends false
			? { SYNC: false }
			: object
	> {
		return {
			emit: o.emit
				? (source, next, _e, c) => {
						const reduce = props.reduce
						const result = props.result ?? (id as never)
						let acc = fromInit(props.init)
						const { abort, start } = o.emit!(
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
					}
				: undefined,
			flags: {
				CONSTRUCT: false,
				SYNC: o.flags.SYNC,
				UNIQUE: false,
				WRITE: false,
			} as never,
		}
	}
}
