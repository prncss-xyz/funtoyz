import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

function pendingCounter(onDone: () => void) {
	let completed = false
	let count = 0
	function after() {
		if (count === 0 && completed) {
			onDone()
		}
	}
	return {
		complete() {
			completed = true
			after()
		},
		async wrap(p: Promise<unknown>) {
			count++
			try {
				await p
			} finally {
				count--
				after()
			}
		},
	}
}

export function mapAsync<T, U>(fn: (value: T) => Promise<U>) {
	return function <S, E, G, F extends Flags>(
		o: Optic<T, S, E, G, F>,
	): Optic<U, S, E, G, F & { SYNC: false }> {
		return {
			...o,
			emitter: o.emitter
				? (source, next, e, c) => {
						const { complete, wrap } = pendingCounter(c)
						return o.emitter!(
							source,
							(value) => {
								wrap(fn(value).then((v) => next(v)))
							},
							e,
							complete,
						)
					}
				: undefined,
			flags: {
				...o.flags,
				SYNC: false,
			},
		} as Optic<U, S, E, G, F & { SYNC: false }>
	}
}
