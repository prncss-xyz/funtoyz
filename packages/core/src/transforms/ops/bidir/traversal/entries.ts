import { Traversal } from '.'

export function fromEntries<V>(): Traversal<[string, V], Record<string, V>> {
	return {
		emitter: (acc, next, _error, complete) => {
			let done = false
			return {
				abort: () => {
					done = true
				},
				start: () => {
					for (const t of Object.entries(acc)) {
						if (done) break
						next(t)
					}
					complete()
				},
			}
		},
		init: () => ({}) as any,
		reduce: ([k, v], acc) => ({ ...acc, [k]: v }),
		reduceDest: ([k, v], acc) => ((acc[k] = v), acc),
	}
}
