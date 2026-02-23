import { Traversal } from '.'

export function toJoin(sep: string, trailing: boolean): Traversal<string> {
	return {
		emitter: (acc, next, _error, complete) => {
			let done = false
			return {
				abort: () => {
					done = true
				},
				start: () => {
					let res = ''
					for (const t of acc) {
						if (done) break
						res += t
						if (sep === '') next(res)
						else if (res.endsWith(sep)) {
							next(res.slice(0, -sep.length))
							res = ''
						}
					}
					if (!trailing) next(res)
					complete()
				},
			}
		},
		init: '',
		reduce: trailing
			? (t, acc) => acc + t + sep
			: (t, acc) => (acc === '' ? t : acc + sep + t),
	}
}
