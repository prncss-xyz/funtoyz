import { fromInit, Init } from '../../../../functions/arguments'
import { id, noop } from '../../../../functions/basics'
import { nothing, Nothing } from '../../../../tags/results'
import { compose } from '../../../compose'
import { source } from '../../../compose/_composeEmit'
import { Emit } from '../../../compose/_methods'

export type Traversal<Acc, Value, Res> = {
	emit: Emit<Value, Res, never>
	init: Init<Acc>
	reduce: (value: Value, acc: Acc) => Acc
	result?: (acc: Acc) => Res
}

// TODO: setter

export function traversal<Acc, Value, Res = Acc>({
	emit,
	init,
	reduce,
	result,
}: Traversal<Acc, Value, Res>) {
	const result_ = result ?? (id as never)
	return compose<Res, Value, never, Nothing, { CONSTRUCT: false }>({
		emitter: source(emit),
		flags: { CONSTRUCT: false },
		modifier: (
			m: (t: Value, next: (t: Value) => void) => void,
			next: (s: Res) => void,
			s: Res,
		) => {
			let acc: Acc
			acc = fromInit(init)
			const { abort, start } = emit(
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
	})
}
