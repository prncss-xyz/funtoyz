import { forbidden } from '../../../../assertions'
import { fromInit, Init } from '../../../../functions/arguments'
import { id, noop } from '../../../../functions/basics'
import { Nothing } from '../../../../tags/results'
import { compose } from '../../../compose'
import { Emit, first } from '../../../compose/_methods'

export type Traversal<Acc, Value, Res> = {
	emit: Emit<Value, Res, never>
	init: Init<Acc>
	reduce: (value: Value, acc: Acc) => Acc
	result?: (acc: Acc) => Res
}

export function traversal<Acc, Value, Res = Acc>({
	emit,
	init,
	reduce,
	result,
}: Traversal<Acc, Value, Res>) {
	const modifier = (
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
				next(result ? result(acc) : (acc as any))
				abort()
			},
		)
		start()
	}
	return compose<Res, Value, never, Nothing, { CONSTRUCT: false }>({
		emit,
		flags: { CONSTRUCT: false },
		getter: first(emit),
		modifier,
		remover: (_s, next) => next((result ?? (id as any))(fromInit(init))),
		reviewer: () => forbidden('reviewer') as never,
		setter: (value, next, res) => modifier((_, next) => next(value), next, res),
	})
}
