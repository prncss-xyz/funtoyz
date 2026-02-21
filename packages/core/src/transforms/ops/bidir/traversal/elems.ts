import { traversal } from '.'

export function elems<Value>() {
	return traversal<Value, Value[]>({
		emitter: (acc, next, _error, complete) => {
			let done = false
			return {
				abort: () => {
					done = true
				},
				start: () => {
					for (const t of acc) {
						if (done) break
						next(t)
					}
					complete()
				},
			}
		},
		init: () => [],
		reduce: (t, acc) => [...acc, t],
		set: (v) => [v],
	})
}
