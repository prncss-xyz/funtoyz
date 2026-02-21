import { sourceAsync } from '.'

export function iterAsync<S>() {
	return sourceAsync<S, AsyncIterable<S>, never>(
		(s, next, _error, complete) => {
			let done = false
			return {
				abort() {
					done = true
				},
				start() {
					;(async () => {
						for await (const t of s) {
							if (done) return
							next(t)
						}
						complete()
					})()
				},
			}
		},
	)
}
