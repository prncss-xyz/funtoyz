import { sourceSync } from '.'
import { fromInit, Init } from '../../../functions/arguments/init'
import { add, gt, lt } from '../../../functions/elementary'

export function loop<Value>(
	init: Init<Value, []>,
	cond: (value: Value) => boolean,
	step: (value: Value) => Value,
) {
	return sourceSync<Value, void, never>((_s, next, _error, complete) => {
		let done = false
		return {
			abort() {
				done = true
			},
			start() {
				for (let acc = fromInit(init); cond(acc); acc = step(acc)) {
					next(acc)
					if (done) return
				}
				complete()
			},
		}
	})
}

export function range(start: number, end: number, step = 1) {
	return loop<number>(start, step > 0 ? lt(end) : gt(end), add(step))
}

export function times(n?: number) {
	return range(0, n ?? Infinity)
}
