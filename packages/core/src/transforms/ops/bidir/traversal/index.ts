import { fromInit, Init } from '../../../../functions/arguments/init'
import { id, noop } from '../../../../functions/basics'
import { nothing, Nothing } from '../../../../tags/results'
import { compose } from '../../../compose'
import { Emitter } from '../../../compose/_methods'

export type Traversal<Value, Acc, Res> = {
	emitter: Emitter<Value, Res, never>
	init: Init<Acc>
	reduce: (value: Value, acc: Acc) => Acc
	result?: (acc: Acc) => Res
	set?: (value: Value) => Res
}

export function traversal<Value, Acc, Res = Acc>({
	emitter,
	init,
	reduce,
	result,
	// set,
}: Traversal<Value, Acc, Res>) {
	const result_ = result ?? (id as never)
	return compose<
		Res,
		Value,
		never,
		Nothing,
		{ CONSTRUCT: false; UNIQUE: false }
	>({
		emitter,
		flags: { CONSTRUCT: false, UNIQUE: false },
		modifier: (
			m: (t: Value, next: (t: Value) => void) => void,
			next: (s: Res) => void,
			s: Res,
		) => {
			let acc: Acc
			acc = fromInit(init)
			const { abort, start } = emitter(
				s,
				(value) =>
					m(value, (t) => {
						acc = reduce(t, acc)
					}),
				noop,
				() => {
					next(result_(acc))
					abort()
				},
			)
			start()
		},
		nothing,
		remover: (_s, next) => next(result_(fromInit(init))),
		// TODO:
		// reviewer: set ? (value, next) => next(set(value)) : undefined,
	})
}
