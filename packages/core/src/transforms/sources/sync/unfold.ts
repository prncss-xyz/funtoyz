import { sourceSync } from '.'
import { fromInit, Init } from '../../../functions/arguments/init'
import { Result, success } from '../../../tags/results'

export function unfold<Value>(
	init: Init<Value, []>,
	cb: (acc: Value) => Result<Value, any>,
) {
	return sourceSync<Value, void, never>((_s, next, _error, complete) => {
		let done = false
		return {
			abort() {
				done = true
			},
			start() {
				let res = cb(fromInit(init))
				while (success.is(res)) {
					next(success.get(res))
					if (done) return
					res = cb(success.get(res))
				}
				complete()
			},
		}
	})
}
