import { fromInit } from '../../../../functions/arguments/init'
import { id, noop } from '../../../../functions/basics'
import { Reducer } from '../../../../reduce'
import { nothing, Nothing } from '../../../../tags/results'
import { compose } from '../../../compose'
import { Emitter } from '../../../compose/_methods'

export type Traversal<Value, Acc = Value, Res = Acc> = Reducer<
	Value,
	Acc,
	Res
> & {
	emitter: Emitter<Value, Res, never>
	set?: (value: Value) => Res
}

export function traversal<Value, Acc = Value, Res = Acc>(
	props: Traversal<Value, Acc, Res>,
) {
	const result_ = props.result ?? (id as never)
	const reduce = props.reduceDest ?? ((props as any).reduce as never)
	return compose<
		Res,
		Value,
		never,
		Nothing,
		{ CONSTRUCT: false; UNIQUE: false }
	>({
		emitter: props.emitter,
		flags: { CONSTRUCT: false, UNIQUE: false },
		modifier: (m, next, s, flush) => {
			let acc: Acc
			acc = fromInit(props.init)
			const { abort, start } = props.emitter(
				s,
				(value) =>
					m(value, (t) => {
						acc = reduce(t, acc)
					}),
				noop,
				() => {
					abort()
					console.log('flush')
					flush((t) => {
						console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!', t)
						acc = reduce(t, acc)
					})
					next(result_(acc))
				},
			)
			start()
		},
		nothing,
		// TODO:
		// reviewer: set ? (value, next) => next(set(value)) : undefined,
		remover: (_s, next) => next(result_(fromInit(props.init))),
	})
}
