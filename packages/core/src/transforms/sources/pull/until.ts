import { fromInit, Init } from '../../../functions/arguments'
import { Source } from '../../types'

export function until<Value>(
	init: Init<Value, []>,
	step: (value: Value) => Value,
	cond: (value: Value) => boolean,
): Source<Value, never> {
	return function (next, _err, complete) {
		let closed = false
		return {
			start() {
				let acc = init
				while (true) {
					acc = step(fromInit(acc))
					next(acc)
					if (closed) return
					if (cond(acc)) break
				}
				complete()
			},
			unmount() {
				closed = true
			},
		}
	}
}
