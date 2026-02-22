import { Optic } from '../../../compose'
import { HasFlag } from '../../../compose/_flags'

export function debounceWith<T>(
	delay: number,
	eq: (next: T, last: T) => unknown = Object.is,
) {
	return function <S, E, G, F extends { SYNC: false; UNIQUE: false }>(
		o: Optic<T, S, E, G, HasFlag<'READ', F>>,
	): Optic<T, S, E, G, F> {
		return {
			...o,
			emitter: (source, next, error, complete) => {
				let handle: 0 | ReturnType<typeof setTimeout> = 0
				let arg: T
				let hasArg = false
				function eff() {
					next(arg)
				}
				return o.emitter!(
					source,
					(value) => {
						clearTimeout(handle)
						if (hasArg && !eq(value, arg)) {
							next(arg)
						}
						arg = value
						hasArg = true
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
						}
						complete()
					},
				)
			},
		}
	}
}
