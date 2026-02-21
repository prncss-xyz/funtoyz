import { Optic } from '../../../compose'

export function debounce(delay: number) {
	return function <T, S, E, G, F extends { SYNC: false }>(
		o: Optic<T, S, E, G, F>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: o.emitter
				? (source, next, error, complete) => {
						let handle: 0 | ReturnType<typeof setTimeout> = 0
						let arg: T
						function eff() {
							next(arg)
						}
						return o.emitter!(
							source,
							(value) => {
								clearTimeout(handle)
								arg = value
								handle = setTimeout(eff, delay)
							},
							(e) => {
								clearTimeout(handle)
								error(e)
							},
							() => {
								if (handle) {
									clearTimeout(handle)
									eff()
									complete()
								}
							},
						)
					}
				: undefined,
			flags: {
				...o.flags,
				SYNC: false,
			} as never,
		}
	}
}
