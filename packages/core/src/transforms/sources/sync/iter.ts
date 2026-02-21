import { sourceSync } from '.'

export function iter<S>() {
	return sourceSync<S, Iterable<S>, never>((s, next, _error, complete) => {
		let done = false
		return {
			abort() {
				done = true
			},
			start() {
				for (const t of s) {
					if (done) break
					next(t)
				}
				complete()
			},
		}
	})
}
