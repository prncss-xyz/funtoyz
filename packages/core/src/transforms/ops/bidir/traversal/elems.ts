import { Traversal, traversal } from '.'

export function toArray<T>(): Traversal<T, T[]> {
	return {
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
		reduce: (event, state) => [...state, event],
		reduceDest: (event, state) => {
			state.push(event)
			return state
		},
		set: (v) => [v],
	}
}

export function elems<Value>() {
	return traversal<Value, Value[]>(toArray())
}
