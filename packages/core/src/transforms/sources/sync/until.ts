import { sourceSync } from '.'
import { fromInit, Init } from '../../../functions/arguments/init'

export function until<Value>(
	init: Init<Value, []>,
	step: (value: Value) => Value,
	cond: (value: Value) => boolean,
) {
	return sourceSync<Value, void, never>((_s, next, _error, complete) => {
		let done = false
		return {
			abort() {
				done = true
			},
			start() {
				let acc = init
				while (true) {
					acc = step(fromInit(acc))
					next(acc)
					if (done) return
					if (cond(acc)) break
				}
				complete()
			},
		}
	})
}
