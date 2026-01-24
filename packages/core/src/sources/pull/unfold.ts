import { fromInit, Init } from '../../functions/arguments'
import { result, Result } from '../../tags/results'
import { Source } from '../core/types'

export function unfold<Value>(
	init: Init<Value>,
	cb: (acc: Value) => Result<Value, unknown>,
): Source<Value, never> {
	return function (next, _err, complete) {
		let closed = false
		return {
			start() {
				let res = cb(fromInit(init))
				while (result.success.is(res)) {
					next(result.success.get(res))
					if (closed) return
					res = cb(result.success.get(res))
				}
				complete()
			},
			unmount() {
				closed = true
			},
		}
	}
}
