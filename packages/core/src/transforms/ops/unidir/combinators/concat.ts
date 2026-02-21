import { Optic } from '../../../compose'
import { Flags } from '../../../compose/_flags'

export function concat<T2, S2, E2, G2, F2 extends Flags>(
	o2: Optic<T2, S2, E2, G2, F2>,
) {
	return function <T1, S1, E1, G1, F1 extends Flags>(
		o1: Optic<T1, S1, E1, G1, F1>,
	): Optic<T1 | T2, S1, E1 | E2, G1 | G2, F1> {
		return {
			...o1,
			emitter:
				o1.emitter && o2.emitter
					? (
							source: S1,
							next: (value: T1 | T2) => void,
							e: (error: E1 | E2) => void,
							c: () => void,
						) => {
							let result1: ReturnType<typeof o1.emitter>
							let result2: ReturnType<typeof o2.emitter> | undefined

							result1 = o1.emitter!(source, next as any, e, () => {
								// When first completes, start second
								if (o2.emitter) {
									result2 = o2.emitter(source as any, next as any, e, c)
									result2?.start?.()
								} else {
									c()
								}
							})

							return {
								abort: () => {
									result1?.abort?.()
									result2?.abort?.()
								},
								start: () => {
									result1?.start?.()
								},
							}
						}
					: undefined,
		} as any
	}
}
