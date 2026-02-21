import { traversal } from '.'

export function chars() {
	return traversal<string, string>({
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
		init: '',
		reduce: (t, acc) => acc + t,
	})
}
