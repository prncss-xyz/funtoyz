import { forbidden } from '../../../../assertions'
import { fromInit, Init } from '../../../../functions/arguments'
import { id } from '../../../../functions/basics'
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

export function traversal<Acc, Value, Res = Acc>({
	emit,
	init,
	result,
}: Traversal<Acc, Value, Res>) {
	return compose<Res, Value, never, Nothing, { CONSTRUCT: false }>({
		emitter: source(emit),
		flags: { CONSTRUCT: false },
		modifier: forbidden as never,
		nothing,
		remover: (_s, next) => next((result ?? (id as any))(fromInit(init))),
		reviewer: () => forbidden('reviewer') as never,
		setter: forbidden as never,
	})
}
