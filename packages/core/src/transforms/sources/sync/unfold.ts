import { sourceSync } from '.'
import { fromInit, Init } from '../../../functions/arguments/init'
import { result, Result } from '../../../tags/results'

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
				while (result.success.is(res)) {
					next(result.success.get(res))
					if (done) return
					res = cb(result.success.get(res))
				}
				complete()
			},
		}
	})
}
